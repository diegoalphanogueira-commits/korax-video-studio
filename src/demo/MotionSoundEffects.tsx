import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import cues from './motionSoundCues.json';

/** Frame-locked UI effects. Final delivery adds speech ducking and peak limiting. */
export const MotionSoundEffects:React.FC=()=> <>{cues.map((cue,i)=><Sequence key={i} from={Math.round(cue.time*30)} durationInFrames={Math.ceil(cue.duration*30)+1} layout='none'>
 <Audio src={staticFile(`sfx/${cue.sound}.wav`)} volume={cue.volume}/>
</Sequence>)}</>;
