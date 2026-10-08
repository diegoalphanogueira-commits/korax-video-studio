"""Remove only the mixed drum stem, before the final audio limiter."""
import argparse
from pathlib import Path
import numpy as np
from scipy.io import wavfile

parser=argparse.ArgumentParser()
parser.add_argument('mix',type=Path)
parser.add_argument('drums',type=Path)
parser.add_argument('output',type=Path)
args=parser.parse_args()
rate,mix=wavfile.read(args.mix);drum_rate,drums=wavfile.read(args.drums)
if rate!=drum_rate or mix.shape!=drums.shape:
    raise ValueError('The mixed drum stem must match the mix timing and channels')
if mix.dtype!=np.float32 or drums.dtype!=np.float32:
    raise ValueError('Use the original floating-point stems before limiting')
result=(mix-drums).astype(np.float32)
if not np.isfinite(result).all():raise ValueError('Invalid audio sample')
wavfile.write(args.output,rate,result)
print('Removed only the separate mixed drum stem.',flush=True)
