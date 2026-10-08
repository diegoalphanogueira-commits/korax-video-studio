"""Subtle presenter color treatment; retain existing tracked cutout alpha."""
import argparse
from io import BytesIO
import json
from pathlib import Path
import subprocess
import tempfile
from PIL import Image

parser=argparse.ArgumentParser()
parser.add_argument('source',type=Path)
parser.add_argument('--video',type=Path,default=Path('public/video/diego-korax-cor-natural.mp4'))
parser.add_argument('--original-alpha',type=Path,default=Path('public/video/diego-recorte-completo-frames'))
parser.add_argument('--frames',type=Path,default=Path('public/video/diego-recorte-cor-natural-frames'))
args=parser.parse_args()
grade='colorchannelmixer=rr=0.96:gg=1.015:bb=1.07,eq=brightness=0.006:contrast=1.025:gamma=1.06:saturation=0.98,unsharp=5:5:0.24:5:5:0'
args.video.parent.mkdir(parents=True,exist_ok=True);args.frames.mkdir(parents=True,exist_ok=True)
if not args.video.exists():
    print('Balancing color, exposure and definition across all 8615 frames',flush=True)
    subprocess.run(['ffmpeg','-v','error','-i',str(args.source),'-map','0:v:0','-an',
                    '-vf',grade,'-frames:v','8615','-c:v','libx264','-preset','fast',
                    '-crf','12','-pix_fmt','yuv420p','-threads','4','-movflags','+faststart',str(args.video)],check=True)
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0',
             '-show_entries','stream=nb_frames,width,height,duration','-of','json',str(args.video)]))['streams'][0]
assert int(probe['nb_frames'])==8615 and probe['width']==512 and probe['height']==910
assert abs(float(probe['duration'])-8615/30)<.001
source_windows=[(0,204),(1475,1610),(7541,7701),(7896,8132),(8400,8614)]
select='+'.join(f'between(n,{a},{b})' for a,b in source_windows)
with tempfile.TemporaryDirectory() as temp:
    directory=Path(temp)
    subprocess.run(['ffmpeg','-v','error','-i',str(args.video),'-vf',
                    f"select='{select}',setpts=N/30/TB",str(directory/'%04d.png')],check=True)
    paths=sorted(directory.glob('*.png'));assert len(paths)==954
    for i,path in enumerate(paths):
        original_alpha=Image.open(args.original_alpha/path.name).getchannel('A')
        corrected=Image.open(path).convert('RGBA');corrected.putalpha(original_alpha)
        buffer=BytesIO();corrected.save(buffer,format='PNG')
        destination=args.frames/path.name;temporary=destination.with_suffix('.tmp')
        temporary.write_bytes(buffer.getvalue());temporary.replace(destination)
        if (i+1)%180==0:print(f'Matched color on {i+1}/954 cutout frames',flush=True)
for path in args.frames.glob('*.png'):Image.open(path).verify()
print(json.dumps({'frames':8615,'cutoutFrames':954,'filter':grade,
                  'originalIdentityPreserved':True,'generativeChanges':False}),flush=True)
