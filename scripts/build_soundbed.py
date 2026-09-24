import numpy as np
import wave

SR = 44100
DURATION = 18.3
N = int(SR * DURATION)
t = np.arange(N) / SR
buf = np.zeros((N, 2), dtype=np.float32)


def add(sig, start, pan=0.0):
    s = int(start * SR)
    e = min(N, s + len(sig))
    if e <= s:
        return
    sig = sig[: e - s]
    buf[s:e, 0] += sig * (1 - pan) * 0.5
    buf[s:e, 1] += sig * (1 + pan) * 0.5


def tone(start, dur, freq, amp=0.1, pan=0.0, kind='sine'):
    m = int(dur * SR)
    tt = np.arange(m) / SR
    if kind == 'saw':
        sig = 2 * ((freq * tt) % 1) - 1
    elif kind == 'tri':
        sig = 2 * np.abs(2 * ((freq * tt) % 1) - 1) - 1
    else:
        sig = np.sin(2 * np.pi * freq * tt)
    a = max(1, int(0.004 * SR))
    r = max(1, int(min(0.22, dur * 0.45) * SR))
    env = np.ones(m, dtype=np.float32)
    env[:a] = np.linspace(0, 1, a)
    env[-r:] *= np.linspace(1, 0, r)
    add(sig * env * amp, start, pan)


def noise(start, dur, amp=0.05, hp=1000, lp=12000, pan=0.0):
    m = int(dur * SR)
    x = np.random.default_rng(int(start * 1000 + dur * 100)).normal(0, 1, m)
    f = np.fft.rfft(x)
    freqs = np.fft.rfftfreq(m, 1 / SR)
    mask = (freqs >= hp) & (freqs <= lp)
    f *= mask
    sig = np.fft.irfft(f, n=m).astype(np.float32)
    mx = np.max(np.abs(sig)) or 1
    sig /= mx
    env = np.linspace(1, 0, m, dtype=np.float32)
    add(sig * env * amp, start, pan)

# cinematic tech bed
for freq, amp in [(82.41, 0.030), (123.47, 0.018), (164.81, 0.012)]:
    sig = np.sin(2 * np.pi * freq * t + 0.45 * np.sin(2 * np.pi * 0.07 * t)) * amp
    buf[:, 0] += sig * 0.92
    buf[:, 1] += sig * 1.08

# pulse rhythm
beat = 60 / 108
for i, st in enumerate(np.arange(0, DURATION, beat)):
    tone(st, 0.28, 58, 0.065)
    tone(st, 0.10, 110, 0.025, kind='tri')
    noise(st + beat / 2, 0.06, 0.020, 5000, 15000, -0.2 if i % 2 else 0.2)

# message pops
for i, st in enumerate([0.55, 0.95, 1.35, 1.78, 2.18]):
    pan = -0.7 + i * 0.35
    tone(st, 0.11, 900 - i * 35, 0.13, pan, 'tri')
    tone(st + 0.03, 0.08, 1400 - i * 35, 0.07, pan)

# headline hit
noise(2.9, 0.9, 0.16, 350, 11000)
tone(3.12, 0.45, 145, 0.10, kind='saw')
tone(3.14, 0.34, 66, 0.15)

# brand arrival
noise(5.0, 1.0, 0.16, 250, 10000)
tone(5.22, 0.70, 240, 0.09, kind='saw')
tone(5.26, 0.42, 82, 0.17)

# feature blips
for st, fr, pan in [(7.25, 720, -0.25), (7.95, 830, 0), (8.65, 930, 0.25)]:
    noise(st - 0.07, 0.16, 0.045, 1600, 12000, pan)
    tone(st, 0.18, fr, 0.13, pan, 'tri')
    tone(st + 0.05, 0.12, fr * 1.5, 0.06, pan)

# UI clicks / conversation
for st in [9.7, 10.05, 10.35, 10.68, 11.00, 11.28]:
    tone(st, 0.05, 1600, 0.05, -0.15, 'tri')
for st in [10.20, 10.82, 11.40]:
    tone(st, 0.09, 920, 0.085, 0.18, 'tri')

# confirmation ding
tone(12.10, 0.38, 880, 0.11)
tone(12.14, 0.55, 1320, 0.07)

# final build + resolve
noise(14.0, 1.3, 0.09, 800, 15000)
for i, st in enumerate([14.3, 14.8, 15.3]):
    tone(st, 0.18, 440 + 110 * i, 0.08, kind='tri')
noise(15.72, 0.70, 0.13, 300, 10000)
tone(15.85, 0.48, 190, 0.12, kind='saw')
tone(15.88, 0.36, 72, 0.16)
tone(16.60, 0.90, 520, 0.05)
tone(16.72, 0.60, 780, 0.035)

# master
peak = np.max(np.abs(buf)) or 1
buf *= 0.82 / peak
fade = int(0.55 * SR)
buf[-fade:] *= np.linspace(1, 0, fade)[:, None]

with wave.open('out/soundbed.wav', 'wb') as wf:
    wf.setnchannels(2)
    wf.setsampwidth(2)
    wf.setframerate(SR)
    wf.writeframes((np.clip(buf, -1, 1) * 32767).astype(np.int16).tobytes())
