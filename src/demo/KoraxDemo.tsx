import React from 'react';
import {AbsoluteFill, OffthreadVideo, staticFile} from 'remotion';

export type DemoVideo = {
  src: string;
  durationInFrames: number;
  durationInSeconds: number;
  fps: number;
  width: number;
  height: number;
};

// Base fiel ao original. Motion, legendas e telas entram após analisar a gravação.
export const KoraxDemo: React.FC<{video: DemoVideo}> = ({video}) => (
  <AbsoluteFill style={{backgroundColor: '#010B36'}}>
    <OffthreadVideo
      src={staticFile(video.src)}
      style={{width: '100%', height: '100%', objectFit: 'contain'}}
    />
  </AbsoluteFill>
);
