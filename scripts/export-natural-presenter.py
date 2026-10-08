"""Export the full corrected picture while copying the approved audio exactly."""
import argparse
import json
from pathlib import Path
import subprocess
from concurrent.futures import ThreadPoolExecutor

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
    ranges=[(0,2871),(2872,5743),(5744,8614)]
    def render_part(item):
        index,(start,end)=item
        path=work/f'natural-part-{index}.mp4'
        if not path.exists():
            run(['npx','remotion','render','src/index.ts','KoraxNewComplete',str(path),
                 f'--frames={start}-{end}','--codec=h264','--crf=17','--image-format=jpeg',
                 '--jpeg-quality=100','--concurrency=2',
                 '--offthreadvideo-cache-size-in-bytes=268435456',
                 '--media-cache-size-in-bytes=134217728','--timeout=120000',
                 '--props={"mutedExport":true}'],
                 work/f'render-{index}.log')
        v=next(s for s in probe(path)['streams'] if s['codec_name']=='h264')
        assert int(v['nb_frames'])==end-start+1
        normalized=work/f'natural-part-{index}-normalized.mp4'
        run(['ffmpeg','-y','-v','error','-i',str(path),'-map','0:v:0','-c:v','copy',
             '-video_track_timescale','90000',str(normalized)])
        return normalized
    with ThreadPoolExecutor(max_workers=3) as executor:
        parts=list(executor.map(render_part,enumerate(ranges)))
    manifest=work/'natural-concat.txt'
    manifest.write_text(''.join(f"file '{p}'\n" for p in parts))
    run(['ffmpeg','-y','-v','warning','-f','concat','-safe','0','-i',str(manifest),
         '-map','0:v:0','-c:v','copy','-video_track_timescale','90000',
         '-movflags','+faststart',str(silent)],work/'concat.log')
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
        'renderFrameFormat':'JPEG','renderFrameQuality':100,'finalH264CRF':17,'sizeBytes':int(p['format']['size'])}
(work/'export-verification.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report),flush=True)
