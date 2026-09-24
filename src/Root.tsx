import React from 'react';
import {Composition} from 'remotion';
import {KoraxAd} from './KoraxAd';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="KoraxAd"
      component={KoraxAd}
      durationInFrames={825}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
