import React from 'react';
import {Audio, staticFile} from 'remotion';
import gain from './musicGain.json';

const volume=(frame:number,values:number[])=>{
 const position=frame/30*5;
 const index=Math.min(Math.floor(position),values.length-1);
 const next=Math.min(index+1,values.length-1);
 return values[index]+(values[next]-values[index])*(position-index);
};
export const BackgroundMusic:React.FC=()=> <>
 <Audio src={staticFile('music/korax-trilha-original.mp3')} volume={frame=>volume(frame,gain)}/>
</>;
