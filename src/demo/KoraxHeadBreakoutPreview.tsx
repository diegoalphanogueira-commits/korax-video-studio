import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {KoraxReferenceSample} from './KoraxReferenceSample';

// Both layers share source coordinates and timing. Only the alpha head
// crosses the card's top edge; the original room stays inside the card.
export const KoraxHeadBreakoutPreview: React.FC = () => {
  const frame = useCurrentFrame();
  const x = 220, y = 760, width = 640, height = 980, scale = 1.45;
  const videoStyle: React.CSSProperties = {
    position: 'absolute', left: (width - 512 * scale) / 2, top: -230,
    width: 512, height: 910, transform: `scale(${scale})`, transformOrigin: '0 0',
  };
  return <KoraxReferenceSample graphicsOnly presenter={<>
    <div style={{position: 'absolute', left: x, top: y, width, height,
      borderRadius: 44, overflow: 'hidden', border: '2px solid #0057FF55',
      boxShadow: '0 25px 70px #0B368B30', zIndex: 20}}>
      <OffthreadVideo muted src={staticFile('video/diego-korax-novo.mp4')} style={videoStyle}/>
    </div>
    <AbsoluteFill style={{zIndex: 21, clipPath: `inset(0 0 ${1920-y-120}px 0)`}}>
      <Img src={staticFile(`video/diego-recorte-frames/${String(frame+1).padStart(3,'0')}.png`)}
        style={{...videoStyle, left: x + 2 + (width-512*scale)/2, top: y + 2 - 230}}/>
    </AbsoluteFill>
  </>}/>;
};
