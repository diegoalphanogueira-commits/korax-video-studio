import React from 'react';
import {Composition} from 'remotion';
import {KoraxAd} from './KoraxAd';
import {KoraxDemo, DemoVideo} from './demo/KoraxDemo';
import videoConfig from './demo/video.json';

const demoVideo = videoConfig as DemoVideo | null;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="KoraxAd"
      component={KoraxAd}
      durationInFrames={825}
      fps={30}
      width={1080}
      height={1920}
    />
    {demoVideo && (
      <Composition
        id="KoraxDemo"
        component={KoraxDemo}
        durationInFrames={demoVideo.durationInFrames}
        fps={demoVideo.fps}
        width={demoVideo.width}
        height={demoVideo.height}
        defaultProps={{video: demoVideo}}
      />
    )}
  </>
);
