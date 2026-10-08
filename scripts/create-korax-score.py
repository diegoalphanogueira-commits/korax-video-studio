"""Compose an original restrained electronic instrumental for the 287s Korax VSL."""
import argparse, subprocess
from pathlib import Path
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

parser=argparse.ArgumentParser()
parser.add_argument('--work-dir',type=Path,required=True)
args=parser.parse_args()
args.work_dir.mkdir(parents=True,exist_ok=True)
root=Path(__file__).resolve().parents[1]
out=root/'public/music';out.mkdir(parents=True,exist_ok=True)
RATE=44100;DURATION=8615/30;BEAT=60/96;BAR=4*BEAT
n=round(DURATION*RATE)
score=np.zeros((n,2),dtype=np.float32)
drums=np.zeros((n,2),dtype=np.float32)
rng=np.random.default_rng(6107)
chords=[[54,61,64,68,73],[50,57,61,64,66],[45,52,56,59,61],[52,59,63,66,68]]
basses=[42,38,33,40]
freq=lambda note:440*2**((note-69)/12)

def place(start,signal,amp,pan=0,drum=False):
    target=drums if drum else score
    at=round(start*RATE)
    if at>=n:return
    if at<0:signal=signal[-at:];at=0
    end=min(n,at+len(signal));signal=signal[:end-at]
    if signal.ndim==1:
        target[at:end,0]+=signal*amp*np.sqrt((1-pan)/2)
        target[at:end,1]+=signal*amp*np.sqrt((1+pan)/2)
    else:target[at:end]+=signal*amp

def pad(note,duration,phase):
    t=np.arange(round(duration*RATE))/RATE;f=freq(note)
    env=np.minimum(1,t/1.1)*np.minimum(1,(duration-t)/1.4)
    channels=[]
    for detune,p in [(-.0012,phase),(.0012,phase+.35)]:
        tone=sum(a*np.sin(2*np.pi*f*(1+detune)*h*t+p) for h,a in [(1,1),(2,.13),(3,.045)])
        channels.append(tone*env*(.94+.06*np.sin(2*np.pi*.17*t+p)))
    return np.stack(channels,axis=1)

def pluck(note,duration=.8):
    t=np.arange(round(duration*RATE))/RATE;f=freq(note)
    env=(1-np.exp(-t/.008))*np.exp(-t/.19)
    return (np.sin(2*np.pi*f*t)+.18*np.sin(2*np.pi*f*2*t)+.035*np.sin(2*np.pi*f*3*t))*env

def bass(note):
    t=np.arange(round(.48*RATE))/RATE
    return (np.sin(2*np.pi*freq(note)*t)+.18*np.sin(2*np.pi*freq(note)*2*t))*(1-np.exp(-t/.012))*np.exp(-t/.22)

t=np.arange(round(.28*RATE))/RATE
kick_phase=2*np.pi*(58*t+65*.025*(1-np.exp(-t/.025)))
kick=(np.sin(kick_phase)+.28*np.sin(2*kick_phase))*(1-np.exp(-t/.0015))*np.exp(-t/.065)
t=np.arange(round(.055*RATE))/RATE
shaker=sosfilt(butter(2,[3500,7500],btype='bandpass',fs=RATE,output='sos'),rng.normal(size=len(t)))*np.sin(np.pi*t/.055)**2
t=np.arange(round(.065*RATE))/RATE
rim=(np.sin(2*np.pi*430*t)+.25*np.sin(2*np.pi*820*t))*(1-np.exp(-t/.001))*np.exp(-t/.010)
t=np.arange(round(.13*RATE))/RATE
brush=sosfilt(butter(2,[750,3200],btype='bandpass',fs=RATE,output='sos'),rng.normal(size=len(t)))
brush*=np.exp(-t/.028)*(1-np.exp(-t/.002))
brush/=max(float(np.max(np.abs(brush))),1e-9)
t=np.arange(round(.21*RATE))/RATE
snare_noise=sosfilt(butter(2,[650,6200],btype='bandpass',fs=RATE,output='sos'),rng.normal(size=len(t)))
snare=(.45*np.sin(2*np.pi*175*t)*np.exp(-t/.038)+.22*np.sin(2*np.pi*235*t)*np.exp(-t/.027)+.6*snare_noise*np.exp(-t/.048))*(1-np.exp(-t/.001))
snare/=max(float(np.max(np.abs(snare))),1e-9)

# Four warm extended chords; alternate voicings and arp phrasing every 8 bars.
for bar in range(int(np.ceil(DURATION/BAR))):
    start=bar*BAR;ci=(bar//2)%4;chord=chords[ci]
    if bar%2==0:
        # Preserve the soft opening, then give the growing drum groove more room.
        pad_level=.042 if bar<4 else .032
        for j,note in enumerate(chord):place(start-.35,pad(note,2*BAR+1.6,j*.73+bar*.09),pad_level)
    section=bar//16
    if bar<4:energy=.52
    elif start>=210 and start<251:energy=.7
    elif start>=263:energy=1.04
    else:energy=.86 if section%2==0 else .76
    if start>=280:energy*=.55
    pattern=[0,2,1,3] if section%2==0 else [1,3,2,0]
    for step in range(4):
        if bar<4 and step%2:continue
        note=chord[1+pattern[step]%4]+(12 if bar%8 in [6,7] else 0)
        place(start+step*BEAT+(.025 if step%2 else 0),pluck(note),.045*energy,[-.3,.25,-.12,.32][step])
    if 3<=bar and start<282:
        # Relaxed rock groove with an audible backbeat, not a buried percussion texture.
        progress=min(1,max(0,(start-7.5)/10))
        drum_energy=energy*(.65+.35*progress)
        kick_beats=[0,2] if bar<7 else [0,1.5,2]
        for beat in kick_beats:
            place(start+beat*BEAT+float(rng.uniform(-.005,.005)),kick,.35*drum_energy*(1 if beat%2==0 else .65),drum=True)
        for beat in [0,2]:
            place(start+beat*BEAT+.035,bass(basses[ci]),.062*energy)
        if bar>=7 and bar%4==3:place(start+3.5*BEAT,kick,.17*drum_energy,drum=True)
        for beat in [1,3]:
            place(start+beat*BEAT+.014+float(rng.uniform(-.005,.005)),snare,.30*drum_energy,.06,drum=True)
        for step in range(8):
            swing=.012 if step%2 else 0
            accent=.70 if step%2==0 else 1
            place(start+step*BEAT/2+.008+swing,shaker,.10*drum_energy*accent,(-.25 if step%2 else .25),drum=True)
        if bar>=15 and bar%8==7:
            place(start+3.5*BEAT,snare,.10*drum_energy,.1,drum=True)
            place(start+3.75*BEAT,snare,.07*drum_energy,-.1,drum=True)

# A warm resolving chord at the end, with percussion already retreating.
for j,note in enumerate(chords[0]):place(282.5,pad(note,4.65,j*.8),.022)
dry=score.copy()
for delay,gain in [(.137,.12),(.271,.08),(.413,.05)]:
    offset=round(delay*RATE)
    room=sosfilt(butter(2,2600,fs=RATE,output='sos'),dry[:-offset],axis=0)
    score[offset:]+=room[:,::-1]*gain
score=sosfilt(butter(2,[42,4800],btype='bandpass',fs=RATE,output='sos'),score,axis=0).astype(np.float32)
time=np.arange(n)/RATE
score*=np.minimum(1,time/2)[:,None]*np.minimum(1,np.maximum(0,DURATION-time)/3.8)[:,None]
score*=.72/max(float(np.max(np.abs(score))),1e-9)
drums=sosfilt(butter(2,[45,7500],btype='bandpass',fs=RATE,output='sos'),drums,axis=0).astype(np.float32)
drums*=np.minimum(1,np.maximum(0,time-7.4)/.35)[:,None]*np.minimum(1,np.maximum(0,DURATION-time)/3.8)[:,None]
drums*=.9/max(float(np.max(np.abs(drums))),1e-9)
wav=args.work_dir/'korax-original-score.wav'
wavfile.write(wav,RATE,score)
drum_wav=args.work_dir/'korax-drums.wav'
wavfile.write(drum_wav,RATE,drums)
subprocess.run(['ffmpeg','-v','error','-y','-i',str(wav),'-c:a','libmp3lame','-b:a','192k',str(out/'korax-trilha-original.mp3')],check=True)
subprocess.run(['ffmpeg','-v','error','-y','-i',str(drum_wav),'-c:a','libmp3lame','-b:a','192k',str(out/'korax-bateria-original.mp3')],check=True)
print(f'Original instrumental: {DURATION:.3f}s, 96 BPM, distinct rock drum stem from 7.5s.',flush=True)
