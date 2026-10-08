"""Add the frame-locked motion effects while copying the video packets unchanged."""
import argparse, json, subprocess
from pathlib import Path
import numpy as np
from scipy.io import wavfile
from scipy.ndimage import uniform_filter1d

parser=argparse.ArgumentParser()
parser.add_argument('input',type=Path,help='Approved video with original voice only')
parser.add_argument('output',type=Path)
parser.add_argument('--work-dir',type=Path,required=True)
args=parser.parse_args()
if args.output.exists():
    raise SystemExit('Output exists: inspect before replacing it.')
root=Path(__file__).resolve().parents[1]
args.work_dir.mkdir(parents=True,exist_ok=True)
rate=44100
length=round(8615/30*rate)
raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(args.input),'-map','0:a:0','-f','f32le','-ar',str(rate),'-ac','2','-'])
voice=np.frombuffer(raw,dtype='<f4').reshape(-1,2).copy()
voice=voice[:length]
if len(voice)<length:
    voice=np.pad(voice,((0,length-len(voice)),(0,0)))
cues=json.loads((root/'src/demo/motionSoundCues.json').read_text())
effects=np.zeros((length,2),dtype=np.float32)
cache={}
for cue in cues:
    if cue['sound'] not in cache:
        asset_rate,asset=wavfile.read(root/'public/sfx'/f"{cue['sound']}.wav")
        assert asset_rate==rate and asset.ndim==2
        cache[cue['sound']]=asset.astype(np.float32)/32768
    asset=cache[cue['sound']]
    start=round(cue['time']*rate)
    effects[start:start+len(asset)]+=asset*cue['volume']
# The voice controls the effects, rather than lowering the speech itself.
rms=np.sqrt(uniform_filter1d(np.mean(voice**2,axis=1),round(.06*rate),mode='nearest'))
duck=.52+.48*(1-np.clip(rms/.075,0,1))
effects*=duck[:,None]
mix=voice+effects
mix_path=args.work_dir/'motion-mix.wav'
wavfile.write(mix_path,rate,mix.astype(np.float32))
wavfile.write(args.work_dir/'motion-effects-only.wav',rate,effects.astype(np.float32))
# Limiter only catches peaks; latency compensation keeps speech aligned to the picture.
subprocess.run(['ffmpeg','-v','error','-i',str(args.input),'-i',str(mix_path),'-map','0:v:0','-map','1:a:0','-c:v','copy','-af','alimiter=limit=0.966:attack=5:release=50:level=false:latency=true,atrim=duration=287.166666667','-c:a','aac','-b:a','256k','-ar',str(rate),'-movflags','+faststart',str(args.output)],check=True)
def video_hash(file):
    return subprocess.check_output(['ffmpeg','-v','error','-i',str(file),'-map','0:v:0','-c','copy','-f','hash','-hash','sha256','-'],text=True).strip()
assert video_hash(args.input)==video_hash(args.output),'Video packets must remain identical'
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','stream=codec_name,width,height,duration,nb_frames:format=duration,size','-of','json',str(args.output)],text=True))
v=next(s for s in probe['streams'] if s['codec_name']=='h264')
a=next(s for s in probe['streams'] if s['codec_name']=='aac')
assert v['width']==1080 and v['height']==1920 and int(v['nb_frames'])==8615
assert abs(float(a['duration'])-8615/30)<.025
decoded=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(args.output),'-map','0:a:0','-f','f32le','-ar',str(rate),'-ac','2','-']),dtype='<f4').reshape(-1,2)[:length]
peak=float(np.max(np.abs(decoded)))
assert peak<1.001,'Clipping after AAC export'
report={'status':'verified','cues':len(cues),'videoBitIdentical':True,'frames':8615,'audioRate':rate,'audioBitrate':'256k AAC','peakDbFS':float(20*np.log10(max(peak,1e-12))),'effectsPeakDbFS':float(20*np.log10(np.max(np.abs(effects)))),'voiceRmsDbFS':float(20*np.log10(np.sqrt(np.mean(voice**2)))),'duration':probe['format']['duration'],'sizeBytes':int(probe['format']['size'])}
(args.work_dir/'motion-audio-verification.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report),flush=True)
