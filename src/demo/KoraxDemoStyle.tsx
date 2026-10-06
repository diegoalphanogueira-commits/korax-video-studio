import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import {KORAX_LOGO_DATA_URL} from '../logoData';
import {DemoVideo} from './KoraxDemo';
import captionData from './captions.json';

type Caption = {start: number; end: number; text: string};
const captions = captionData as Caption[];
const bounded = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const fade = (frame: number, start: number, end: number) => interpolate(frame, [start, start + 10, end - 10, end], [0, 1, 1, 0], bounded);

export const KoraxDemoStyle: React.FC<{video: DemoVideo}> = ({video}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const seconds = frame / fps;
  const subtitle = captions.find((cue) => seconds >= cue.start && seconds < cue.end);
  const zoom = interpolate(frame, [0, fps * 5, fps * 6, fps * 12, fps * 13, fps * 21], [1, 1.04, 1.01, 1.04, 1.01, 1.035], bounded);
  const entry = spring({frame, fps, config: {damping: 22, stiffness: 90}});
  const hook = fade(frame, fps * .4, fps * 5.05);
  const founder = fade(frame, fps * 7.8, fps * 10.0);
  const promise = fade(frame, fps * 12.7, fps * 17.7);
  const scale = Math.min(width / 1080, height / 1920);
  return (
    <AbsoluteFill style={{background: '#010B36', fontFamily: 'Inter, Arial, sans-serif', overflow: 'hidden'}}>
      <AbsoluteFill>
        <OffthreadVideo src={staticFile(video.src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`, transformOrigin: '50% 42%'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(1,11,54,.3) 0%, transparent 27%, transparent 48%, rgba(1,11,54,.42) 76%, rgba(1,11,54,.92) 100%)'}} />
      <div style={{position: 'absolute', width: 1080, height: 1920, left: (width - 1080 * scale) / 2, top: (height - 1920 * scale) / 2, transform: `scale(${scale})`, transformOrigin: 'top left'}}>
        <div style={{position: 'absolute', right: 66, top: 94, display: 'flex', alignItems: 'center', gap: 10, color: 'white', opacity: .9 * entry}}>
          <Img src={KORAX_LOGO_DATA_URL} style={{width: 42, height: 42}} />
          <span style={{fontSize: 28, fontWeight: 700, letterSpacing: 3}}>KORAX</span>
        </div>
        <div style={{position: 'absolute', left: 72, top: 1280, opacity: hook, transform: `translateY(${(1-hook)*18}px)`, color: 'white'}}>
          <div style={{fontSize: 90, fontWeight: 700, letterSpacing: -4}}>WhatsApp.</div>
          <div style={{display: 'flex', gap: 18, fontSize: 36, fontWeight: 600, marginTop: 20}}>
            {['Atenda.', 'Venda.', 'Organize.'].map((word, i) => <span key={word} style={{color: seconds > [1.15, 2.2, 3.1][i] ? '#ABC5FF' : 'rgba(255,255,255,.28)'}}>{word}</span>)}
          </div>
        </div>
        <div style={{position: 'absolute', left: 72, top: 1350, opacity: founder, transform: `translateY(${(1-founder)*18}px)`}}>
          <div style={{height: 5, width: 54, backgroundColor: '#0057FF', marginBottom: 22}} />
          <div style={{fontSize: 60, fontWeight: 700, color: 'white', letterSpacing: -2}}>Diego Nogueira</div>
          <div style={{fontSize: 30, color: '#C5D4F4', marginTop: 9}}>Fundador da KORAX</div>
        </div>
        <div style={{position: 'absolute', left: 72, top: 1320, opacity: promise, transform: `translateY(${(1-promise)*18}px)`, color: 'white'}}>
          <div style={{fontSize: 23, color: '#AFC6FF', fontWeight: 600, letterSpacing: 4, marginBottom: 18}}>SEU WHATSAPP</div>
          <div style={{fontSize: 72, fontWeight: 700, lineHeight: 1.04, letterSpacing: -3}}>Uma operação<br/>comercial inteligente.</div>
        </div>
        {subtitle && <div style={{position: 'absolute', left: 66, right: 66, bottom: 234, textAlign: 'center'}}>
          <span style={{display: 'inline-block', maxWidth: '100%', background: 'rgba(1,11,54,.87)', borderRadius: 14, padding: '16px 24px', color: 'white', fontSize: 48, lineHeight: 1.22, fontWeight: 600, boxShadow: '0 12px 36px rgba(0,0,0,.15)'}}>{subtitle.text}</span>
        </div>}
        <div style={{position: 'absolute', left: 66, right: 66, bottom: 162, height: 2, background: 'rgba(255,255,255,.16)'}}>
          <div style={{width: `${100 * frame / video.durationInFrames}%`, height: '100%', background: '#0057FF'}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
