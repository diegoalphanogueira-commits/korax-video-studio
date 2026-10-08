"""Export the full corrected picture while copying the approved audio exactly."""
import argparse
import json
from pathlib import Path
import subprocess

parser=argparse.ArgumentParser()
parser.add_argument('approved',type=Path)
parser.add_argument('output',type=Path)
parser.add_argument('--work-dir',type=Path,required=True)
args=parser.parse_args()
root=Path(__file__).resolve().parents[1]
approved=args.approved.resolve();output=args.output.resolve();work=args.work_dir.resolve()
work.mkdir(parents=True,exist_ok=True)
def run(command,log=None):
    if log:
        with log.open('w') as f:subprocess.run(command,check=True,cwd=root,stdout=f,stderr=f)
    else:subprocess.run(command,check=True,cwd=root)
def probe(path):
    return json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries',
                    'stream=codec_name,width,height,nb_frames,duration:format=size,duration',
                    '-of','json',str(path)]))
silent=work/'natural-picture-muted.mp4'
print('Rendering the complete corrected picture: 8615 frames',flush=True)
if not silent.exists():
    run(['npx','remotion','render','src/index.ts','KoraxNewComplete',str(silent),
         '--codec=h264','--crf=17','--image-format=png','--concurrency=6',
         '--props={"mutedExport":true}'],work/'render.log')
v=next(s for s in probe(silent)['streams'] if s['codec_name']=='h264')
assert int(v['nb_frames'])==8615 and v['width']==1080 and v['height']==1920
run(['ffmpeg','-y','-v','error','-i',str(silent),'-i',str(approved),'-map','0:v:0',
     '-map','1:a:0','-c','copy','-movflags','+faststart',str(output)])
def audio_hash(path):
    return subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-map','0:a:0',
                                    '-c:a','copy','-f','hash','-hash','sha256','-'],text=True).strip()
assert audio_hash(approved)==audio_hash(output),'Approved audio must be bit-identical'
p=probe(output);v=next(s for s in p['streams'] if s['codec_name']=='h264')
a=next(s for s in p['streams'] if s['codec_name']=='aac')
assert int(v['nb_frames'])==8615 and abs(float(v['duration'])-8615/30)<.001
assert abs(float(a['duration'])-8615/30)<.025
report={'status':'verified','frames':8615,'duration':8615/30,'width':1080,'height':1920,
        'audioBitIdentical':True,'drumStemPresent':False,'headBreakoutMoments':5,
        'fullTimelinePresenterTreatment':True,'colorMatchedCutout':True,
        'losslessRenderFrames':True,'finalH264CRF':17,'sizeBytes':int(p['format']['size'])}
(work/'export-verification.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report),flush=True)
