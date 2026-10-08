"""Combine a tracked alpha mask with original video pixels for the 6s preview."""
import argparse
from pathlib import Path
import subprocess
import tempfile
import numpy as np
from PIL import Image
from scipy.ndimage import binary_fill_holes

parser = argparse.ArgumentParser()
parser.add_argument('source', type=Path)
parser.add_argument('alpha', type=Path)
parser.add_argument('--output', type=Path, default=Path('public/video/diego-recorte-frames'))
args = parser.parse_args()
args.output.mkdir(parents=True, exist_ok=True)
with tempfile.TemporaryDirectory() as temp:
    root = Path(temp)
    for name, source in [('original', args.source), ('mask', args.alpha)]:
        (root/name).mkdir()
        decoder = ['-c:v', 'libvpx-vp9'] if name == 'mask' else []
        subprocess.run(['ffmpeg', '-v', 'error', *decoder, '-i', str(source),
                        '-frames:v', '180', str(root/name/'%03d.png')], check=True)
    for path in sorted((root/'mask').glob('*.png')):
        alpha = np.asarray(Image.open(path).getchannel('A')).copy()
        if alpha.min() == 255:
            raise ValueError('Mask is fully opaque: background removal failed')
        # Close enclosed pinholes without expanding the outside hair contour.
        alpha = np.maximum(alpha, binary_fill_holes(alpha > 128).astype('uint8')*255)
        original = Image.open(root/'original'/path.name).convert('RGBA')
        original.putalpha(Image.fromarray(alpha))
        original.save(args.output/path.name)
