import React from 'react';
import {Audio, staticFile} from 'remotion';
import gain from './musicGain.json';

export const BackgroundMusic:React.FC=()=> <Audio src={staticFile('music/korax-trilha-original.mp3')} volume={frame=>{
 const position=frame/30*5;
 const index=Math.min(Math.floor(position),gain.length-1);
 const next=Math.min(index+1,gain.length-1);
 return gain[index]+(gain[next]-gain[index])*(position-index);
}}/>;
