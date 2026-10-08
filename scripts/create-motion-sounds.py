"""Original, deterministic UI sound design. No sampled reference audio."""
from pathlib import Path
import numpy as np
from scipy.signal import butter, sosfilt, chirp
from scipy.io import wavfile

RATE = 44100
ROOT = Path(__file__).resolve().parents[1] / 'public' / 'sfx'
ROOT.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(4037)

def band_noise(n, lo, hi):
    return sosfilt(butter(3, [lo, hi], btype='bandpass', fs=RATE, output='sos'), rng.normal(size=n))

def save(name, x, pan=0, width=.15):
    x = x / max(np.max(np.abs(x)), 1e-9) * .75
    # Tiny stereo width and centered loudness: still clean when folded to mono.
    delay = np.roll(x, 22); delay[:22] = 0
    stereo = np.stack([(x*(1-width)+delay*width)*(1-pan*.2), (x*(1-width)+np.roll(delay, 10)*width)*(1+pan*.2)], axis=1)
    stereo[-min(120,len(x)):] *= np.linspace(1,0,min(120,len(x)))[:,None]
    wavfile.write(ROOT / f'{name}.wav', RATE, np.round(np.clip(stereo,-1,1)*32767).astype(np.int16))

for name, duration, reverse, pan in [('whoosh-soft',.42,False,-.2),('whoosh-swipe',.52,True,.2)]:
    t=np.arange(round(duration*RATE))/RATE
    u=t/duration
    noise=band_noise(len(t),350,5800)
    soft=band_noise(len(t),180,1800)
    envelope=np.sin(np.pi*u)**2.3
    brightness=u if not reverse else 1-u
    x=(noise*(.18+.7*brightness)+soft*.32)*envelope
    x+=.025*chirp(t,240 if not reverse else 420,duration,420 if not reverse else 190)*envelope
    save(name,x,pan)

t=np.arange(round(.17*RATE))/RATE
phase=2*np.pi*(150*t+(560-150)*.023*(1-np.exp(-t/.023)))
pop=np.sin(phase)*np.exp(-t/ .030)*(1-np.exp(-t/.002))
pop+=.08*band_noise(len(t),900,3600)*np.exp(-t/.018)*(1-np.exp(-t/.001))
save('pop-soft',pop,width=.07)

t=np.arange(round(.072*RATE))/RATE
tick=(np.sin(2*np.pi*1450*t)+.3*np.sin(2*np.pi*2350*t))*np.exp(-t/.009)*(1-np.exp(-t/.0008))
tick+=.45*band_noise(len(t),1100,7000)*np.exp(-t/.006)*(1-np.exp(-t/.0005))
save('click-soft',tick,width=.04)

t=np.arange(round(.30*RATE))/RATE
accent=np.sin(2*np.pi*(74*t+105*.027*(1-np.exp(-t/.027))))*np.exp(-t/.065)*(1-np.exp(-t/.003))
accent+=.17*np.sin(2*np.pi*720*t)*np.exp(-t/.038)*(1-np.exp(-t/.002))
accent+=.06*band_noise(len(t),700,3000)*np.exp(-t/.025)
save('accent-soft',accent,width=.10)

t=np.arange(round(.34*RATE))/RATE
confirm=np.zeros_like(t)
for offset,freq,amp in [(0,640,1),(.075,850,.65)]:
    local=np.maximum(0,t-offset)
    confirm+=amp*np.sin(2*np.pi*freq*local)*np.exp(-local/.050)*(1-np.exp(-local/.002))*(t>=offset)
save('confirm-soft',confirm,width=.08)
print('Created six original motion effects at 44.1 kHz stereo.')
