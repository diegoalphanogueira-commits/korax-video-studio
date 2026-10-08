"""Prepare original-pixel cutouts for the alternating full-video scenes."""
import argparse
from pathlib import Path
import subprocess
import tempfile
from io import BytesIO
import numpy as np
from PIL import Image
from scipy.ndimage import binary_fill_holes, binary_closing, label

parser = argparse.ArgumentParser()
parser.add_argument('source', type=Path)
parser.add_argument('alpha', type=Path)
parser.add_argument('--output', type=Path, default=Path('public/video/diego-recorte-completo-frames'))
parser.add_argument('--repair', action='store_true', help='Regenerate only missing or incomplete PNG frames')
args = parser.parse_args()
args.output.mkdir(parents=True, exist_ok=True)
source_windows = [(0,204),(1475,1610),(7541,7701),(7896,8132),(8400,8614)]
source_frames=[n for a,b in source_windows for n in range(a,b+1)]
indices=list(range(954))
if args.repair:
    indices=[]
    for n in range(954):
        try:Image.open(args.output/f'{n+1:04d}.png').verify()
        except Exception:indices.append(n)
    if not indices:
        print('All cutout PNG frames are complete.',flush=True)
        raise SystemExit(0)
    print(f'Repairing {len(indices)} incomplete PNG frames',flush=True)
select='+'.join(f'eq(n,{source_frames[n]})' for n in indices)
mask_select='+'.join(f'eq(n,{n})' for n in indices)
with tempfile.TemporaryDirectory() as temp:
    root = Path(temp)
    (root/'original').mkdir(); (root/'mask').mkdir()
    subprocess.run(['ffmpeg','-v','error','-i',str(args.source),'-vf',
                    f"select='{select}',setpts=N/30/TB",str(root/'original'/'%04d.png')],check=True)
    subprocess.run(['ffmpeg','-v','error','-c:v','libvpx-vp9','-i',str(args.alpha),
                    '-vf',f"select='{mask_select}',setpts=N/30/TB",
                    '-frames:v',str(len(indices)),str(root/'mask'/'%04d.png')],check=True)
    paths = sorted((root/'mask').glob('*.png'))
    if len(paths) != len(indices):
        raise ValueError(f'Expected {len(indices)} alpha frames, found {len(paths)}')
    for i,path in enumerate(paths):
        alpha=np.asarray(Image.open(path).getchannel('A')).copy()
        if alpha.min()==255:
            raise ValueError(f'Fully opaque alpha at frame {i}')
        alpha=np.maximum(alpha,binary_fill_holes(alpha>128).astype('uint8')*255)
        original=Image.open(root/'original'/path.name).convert('RGBA')
        rgb=np.asarray(original)[:,:,:3]
        dark=np.zeros(alpha.shape,dtype=bool)
        dark[30:190,70:420]=rgb[30:190,70:420].max(axis=2)<125
        regions,_=label(dark)
        candidates,counts=np.unique(regions[70:150,130:350],return_counts=True)
        valid=candidates!=0
        if valid.any():
            hair=regions==candidates[valid][np.argmax(counts[valid])]
            hair=binary_fill_holes(binary_closing(hair,iterations=1))
            alpha=np.maximum(alpha,hair.astype('uint8')*255)
        original.putalpha(Image.fromarray(alpha))
        buffer=BytesIO();original.save(buffer,format='PNG')
        destination=args.output/f'{indices[i]+1:04d}.png'
        temporary=destination.with_suffix('.tmp')
        temporary.write_bytes(buffer.getvalue());temporary.replace(destination)
        if (i+1)%180==0:print(f'Prepared {i+1}/954 frames',flush=True)
for n in range(954):Image.open(args.output/f'{n+1:04d}.png').verify()
print('Verified all 954 cutout frames from original pixels.',flush=True)
