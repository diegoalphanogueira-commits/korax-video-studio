"""Combine a tracked alpha mask with original video pixels for the 6s preview."""
import argparse
from pathlib import Path
import subprocess
import tempfile
import numpy as np
from PIL import Image
from scipy.ndimage import binary_fill_holes, binary_closing, label

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
        # Recover dark hair lost by the tracker on a head turn. This source's
        # upper wall is light; select only the connected dark hair region.
        rgb = np.asarray(original)[:,:,:3]
        dark = np.zeros(alpha.shape, dtype=bool)
        dark[30:190,70:420] = rgb[30:190,70:420].max(axis=2) < 125
        regions, _ = label(dark)
        candidates, counts = np.unique(regions[70:150,130:350], return_counts=True)
        valid = candidates != 0
        if valid.any():
            hair = regions == candidates[valid][np.argmax(counts[valid])]
            hair = binary_fill_holes(binary_closing(hair, iterations=1))
            alpha = np.maximum(alpha, hair.astype('uint8')*255)
        original.putalpha(Image.fromarray(alpha))
        original.save(args.output/path.name)
