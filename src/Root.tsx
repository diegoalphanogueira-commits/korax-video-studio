import React from 'react';
import {Composition} from 'remotion';
import {KoraxAd} from './KoraxAd';
import {KoraxDemo, DemoVideo} from './demo/KoraxDemo';
import {KoraxDemoStyle} from './demo/KoraxDemoStyle';
import {KoraxDemoMotion} from './demo/KoraxDemoMotion';
import {KoraxDemoComplete} from './demo/KoraxDemoComplete';
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
      <>
      <Composition
        id="KoraxDemo"
        component={KoraxDemo}
        durationInFrames={demoVideo.durationInFrames}
        fps={demoVideo.fps}
        width={demoVideo.width}
        height={demoVideo.height}
        defaultProps={{video: demoVideo}}
      />
      <Composition
        id="KoraxDemoStyle"
        component={KoraxDemoStyle}
        durationInFrames={demoVideo.durationInFrames}
        fps={demoVideo.fps}
        width={1080}
        height={1920}
        defaultProps={{video: demoVideo}}
      />
      <Composition
        id="KoraxDemoMotion"
        component={KoraxDemoMotion}
        durationInFrames={532}
        fps={demoVideo.fps}
        width={1080}
        height={1920}
        defaultProps={{video: demoVideo}}
      />
      <Composition
        id="KoraxDemoComplete"
        component={KoraxDemoComplete}
        durationInFrames={demoVideo.durationInFrames}
        fps={demoVideo.fps}
        width={1080}
        height={1920}
        defaultProps={{video: demoVideo}}
      />
      </>
    )}
  </>
);
