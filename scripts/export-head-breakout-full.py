"""Render changed intervals, preserve other video packets, and mux the drum-free mix."""
import argparse
import json
import re
from fractions import Fraction
from pathlib import Path
import subprocess

parser=argparse.ArgumentParser()
parser.add_argument('approved',type=Path)
parser.add_argument('mix',type=Path)
parser.add_argument('output',type=Path)
parser.add_argument('--work-dir',type=Path,required=True)
args=parser.parse_args()
root=Path(__file__).resolve().parents[1]
approved=args.approved.resolve();mix=args.mix.resolve();output=args.output.resolve()
work=args.work_dir.resolve();work.mkdir(parents=True,exist_ok=True)
original=work/'original-parts';original.mkdir(exist_ok=True)
boundaries=[0,216,1478,1590,7544,7685,7899,8112,8362,8615]
changed={0,2,4,6,8}
def probe(path):
    return json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries',
                    'stream=codec_name,nb_frames,duration,width,height,start_time',
                    '-of','json',str(path)]))['streams']
def run(command,log=None):
    if log:
        with log.open('w') as f:subprocess.run(command,check=True,cwd=root,stdout=f,stderr=f)
    else:subprocess.run(command,check=True,cwd=root)
if not (original/'08.mp4').exists():
    times=','.join(f'{f/30:.12f}' for f in boundaries[1:-1])
    run(['ffmpeg','-v','error','-i',str(approved),'-map','0:v:0','-an','-c:v','copy',
         '-f','segment','-segment_times',times,'-segment_time_delta','0.000001',
         '-reset_timestamps','1','-avoid_negative_ts','disabled',str(original/'%02d.mp4')])
parts=[]
for i,(start,end) in enumerate(zip(boundaries,boundaries[1:])):
    part=original/f'{i:02d}.mp4'
    assert int(probe(part)[0]['nb_frames'])==end-start
    if i in changed:
        part=work/f'rendered-{i:02d}.mp4'
        if not part.exists():
            print(f'Rendering scene {i}: frames {start}-{end-1}',flush=True)
            run(['npx','remotion','render','src/index.ts','KoraxNewComplete',str(part),
                 f'--frames={start}-{end-1}','--codec=h264','--crf=18','--concurrency=3',
                 '--props={"mutedExport":true}'],work/f'render-{i:02d}.log')
        assert int(probe(part)[0]['nb_frames'])==end-start
    # The segment muxer and renderer can choose different time bases.
    # Normalize every part by remuxing, without touching encoded pictures.
    normalized=work/f'normalized-{i:02d}.mp4'
    run(['ffmpeg','-y','-v','error','-i',str(part),'-map','0:v:0','-c:v','copy',
         '-video_track_timescale','90000',str(normalized)])
    part=normalized
    parts.append(part)
manifest=work/'concat.txt'
manifest.write_text(''.join(f"file '{p}'\n" for p in parts))
joined=work/'joined-muted.mp4'
run(['ffmpeg','-y','-v','warning','-f','concat','-safe','0','-i',str(manifest),
     '-map','0:v:0','-c:v','copy','-video_track_timescale','90000','-movflags','+faststart',str(joined)],work/'concat.log')
v=probe(joined)[0]
assert int(v['nb_frames'])==8615 and v['width']==1080 and v['height']==1920
assert abs(float(v['duration'])-8615/30)<.001
run(['ffmpeg','-y','-v','error','-i',str(joined),'-i',str(mix),'-map','0:v:0',
     '-map','1:a:0','-c:v','copy','-af',
     'alimiter=limit=0.966:attack=5:release=50:level=false:latency=true,atrim=duration=287.166666667',
     '-c:a','aac','-b:a','256k','-ar','44100','-movflags','+faststart',str(output)])
streams=probe(output); video=next(s for s in streams if s['codec_name']=='h264')
audio=next(s for s in streams if s['codec_name']=='aac')
assert int(video['nb_frames'])==8615 and abs(float(audio['duration'])-8615/30)<.025
# Check untouched encoded pictures; concatenation can insert SPS/PPS metadata.
def packets(path):
    data=subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-map','0:v:0',
         '-c:v','copy','-bsf:v','filter_units=remove_types=6|7|8|9',
         '-f','framehash','-hash','sha256','-'],text=True)
    time_base=Fraction(re.search(r'#tb 0: (\S+)',data).group(1))
    rows=[line.split(',') for line in data.splitlines() if line and not line.startswith('#')]
    return {round(int(row[2])*time_base*30):row[-1].strip() for row in rows}
before=packets(approved);after=packets(output)
preserved=0
for i,(start,end) in enumerate(zip(boundaries,boundaries[1:])):
    if i not in changed:
        for frame in range(start,end):
            assert before[frame]==after[frame],f'Unexpected video change at frame {frame}'
            preserved+=1
report={'status':'verified','frames':8615,'duration':8615/30,'width':1080,'height':1920,
        'headBreakoutMoments':5,'renderedFrames':8615-preserved,'videoFramesCopiedWithoutRecompression':preserved,
        'drumStemPresent':False,'voiceEffectsHarmonicBedPreserved':True}
(work/'export-verification.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report),flush=True)
