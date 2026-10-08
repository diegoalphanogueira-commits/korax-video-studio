import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import {KORAX_LOGO_DATA_URL} from '../logoData';
import transcript from './newOpening.json';

const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const ease=Easing.bezier(.22,.8,.18,1);
const r=(t:number,a:number,b:number,x=0,y=1)=>interpolate(t,[a,b],[x,y],{...clamp,easing:ease});
const fade=(t:number,start:number,end:number)=>Math.min(r(t,start-.22,start+.22),r(t,end-.22,end+.22,1,0));
const B='#0057FF',N='#010B36';
const words=transcript.flatMap(s=>s.words);
const chunks: {start:number;end:number;words:typeof words}[]=[];
for(let i=0;i<words.length;i+=3){const row=words.slice(i,i+3);chunks.push({start:row[0].start,end:words[i+3]?.start??row[row.length-1].end,words:row});}

const Pop:React.FC<{start:number;t:number;children:React.ReactNode;style?:React.CSSProperties}>=({start,t,children,style})=>{
 const p=spring({frame:Math.round((t-start)*30),fps:30,config:{damping:20,stiffness:190}});
 return <div style={{...style,opacity:r(t,start,start+.18),transform:`translateY(${(1-p)*55}px) scale(${.9+.1*p})`}}>{children}</div>;
};

const Icon:React.FC<{kind:number}>=({kind})=><svg width='48' height='48' viewBox='0 0 48 48' fill='none' stroke='currentColor' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round'>
 {kind===0?<><rect x='6' y='8' width='36' height='27' rx='7'/><path d='M16 35l-6 7v-9M15 20h18M15 27h11'/></>:kind===1?<><path d='M8 36V22m12 14V15m12 21V9M5 41h37M7 15l12-7 12 1 10-6'/></>:kind===2?<><rect x='12' y='5' width='26' height='38' rx='4'/><path d='M20 16h10M20 24h10M20 32h6'/></>:<><rect x='6' y='9' width='36' height='33' rx='6'/><path d='M6 20h36M15 5v9M33 5v9M17 30l5 5 10-10'/></>}
</svg>;

export const KoraxReferenceSample:React.FC=()=>{
 const f=useCurrentFrame(),t=f/30;
 const phase=t<7.2?0:t<9.22?1:t<16.82?2:t<19.22?3:4;
 const dark=phase===1||phase===2||phase===4;
 const darkMix=interpolate(t,[0,7.0,7.7,16.6,17.35,18.95,19.7,26],[0,0,1,1,0,0,1,1],{...clamp,easing:ease});
 const pos=(v:number[])=>interpolate(t,[0,6.95,7.7,8.95,9.7,16.55,17.45,18.95,19.7,26],v,{...clamp,easing:ease});
 const x=pos([220,220,160,160,715,715,340,340,320,320]);
 const y=pos([650,650,270,270,180,180,1210,1210,1210,1210]);
 const w=pos([640,640,760,760,340,340,400,400,440,440]);
 const h=pos([1090,1090,1320,1320,340,340,400,400,440,440]);
 const radius=pos([44,44,50,50,170,170,200,200,220,220]);
 // One unbroken video layer, uniformly scaled: masks move, facial proportions never change.
 const sourceScale=pos([1.25,1.25,1.48,1.48,.9,.9,1.05,1.05,1.15,1.15]);
 const sourceTop=pos([0,0,0,0,-64,-64,-73,-73,-79,-79]);
 const cap=chunks.find(c=>t>=c.start&&t<c.end);
 return <AbsoluteFill style={{background:'#F8FAFF',color:dark?'white':N,fontFamily:'Inter,Arial,sans-serif',overflow:'hidden'}}>
  <Audio src={staticFile('video/diego-korax-novo.mp4')}/>
  <AbsoluteFill style={{background:'radial-gradient(ellipse at 60% 60%,#DCE9FF66,transparent 65%)'}}/>
  <AbsoluteFill style={{background:'radial-gradient(ellipse at 80% 0%,#12479688,transparent 65%),linear-gradient(165deg,#010B36,#020718)',opacity:darkMix}}/>
  <div style={{position:'absolute',left:64,top:85,display:'flex',alignItems:'center',gap:15}}><Img src={KORAX_LOGO_DATA_URL} style={{width:44,height:44}}/><span style={{fontSize:27,fontWeight:700,letterSpacing:4}}>KORAX</span></div>
  <div data-presenter='continuous' style={{position:'absolute',left:x,top:y,width:w,height:h,borderRadius:radius,overflow:'hidden',border:`2px solid ${dark?'#76AAFF99':'#0057FF55'}`,boxShadow:dark?'0 20px 85px #0008':'0 25px 70px #0B368B30',zIndex:20,background:N}}>
    <OffthreadVideo muted src={staticFile('video/diego-korax-novo.mp4')} style={{position:'absolute',left:(w-512*sourceScale)/2,top:sourceTop,width:512,height:910,transform:`scale(${sourceScale})`,transformOrigin:'0 0'}}/>
  </div>
  {t<7.42&&<AbsoluteFill style={{opacity:fade(t,-1,7.2)}}>
   <div style={{position:'absolute',left:65,right:65,top:247,textAlign:'center'}}>
    <Pop start={.1} t={t}><div style={{fontSize:37,fontWeight:600}}>Seu atendimento começa no</div></Pop>
    <Pop start={1.9} t={t}><div style={{fontSize:148,letterSpacing:-7,fontWeight:700,color:B,marginTop:12}}>WhatsApp.</div></Pop>
   </div>
   {[{text:'ATENDIMENTO',kind:0,start:2.92,x:45,y:795},{text:'VENDAS',kind:1,start:3.78,x:738,y:1000},{text:'ORÇAMENTOS',kind:2,start:4.62,x:42,y:1320},{text:'AGENDA',kind:3,start:6.2,x:762,y:1470}].map(v=><Pop key={v.text} t={t} start={v.start} style={{position:'absolute',left:v.x,top:v.y,zIndex:22}}><div style={{display:'flex',alignItems:'center',gap:13,background:'white',border:'1px solid #C2D8FF',padding:'20px 17px',borderRadius:22,boxShadow:'0 18px 45px #14377725',color:B,fontSize:23,fontWeight:700}}><Icon kind={v.kind}/>{v.text}</div></Pop>)}
  </AbsoluteFill>}
  {t>=6.98&&t<9.44&&<AbsoluteFill style={{opacity:fade(t,7.2,9.22)}}><Pop t={t} start={7.1} style={{position:'absolute',left:65,right:65,top:1390,textAlign:'center',zIndex:4}}><div style={{fontFamily:'Georgia,serif',fontStyle:'italic',fontSize:136,letterSpacing:-5}}>Olha isso.</div></Pop></AbsoluteFill>}
  {t>=9&&t<17.04&&<AbsoluteFill style={{opacity:fade(t,9.22,16.82)}}>
   <div style={{position:'absolute',left:65,top:246,width:620}}><Pop start={9.05} t={t}><div style={{fontSize:90,lineHeight:1.04,fontWeight:700,letterSpacing:-5}}>Mais contatos.</div></Pop><Pop start={10.6} t={t}><div style={{fontFamily:'Georgia,serif',fontSize:88,fontStyle:'italic',color:'#A7C8FF',marginTop:10}}>Mais demanda.</div></Pop></div>
   <svg style={{position:'absolute',left:0,top:0,width:1080,height:1920}} viewBox='0 0 1080 1920'>
    {[680,920,1160].map((v,i)=><path key={v} d={`M690 ${v} C840 ${v} 740 1390 830 1390`} fill='none' stroke='#518DFF' strokeWidth='5' strokeDasharray='1000' strokeDashoffset={1000*(1-r(t,[13.35,14.55,15.65][i],[14,15.2,16.3][i]))}/>)}
   </svg>
   {[{text:'Tráfego pago',at:13.22,kind:1,y:585},{text:'Indicações',at:14.42,kind:0,y:825},{text:'Marketing',at:15.52,kind:2,y:1065}].map(v=><Pop key={v.text} start={v.at} t={t} style={{position:'absolute',left:68,top:v.y,width:620}}><div style={{height:190,display:'flex',alignItems:'center',gap:30,padding:'30px 35px',background:'linear-gradient(110deg,#153D87,#0A1E4A)',border:'1px solid #80ACFF77',borderRadius:28,boxShadow:'0 20px 65px #0004'}}><div style={{color:'#AFCFFF'}}><Icon kind={v.kind}/></div><span style={{fontSize:53,fontWeight:600,letterSpacing:-2}}>{v.text}</span></div></Pop>)}
   <Pop start={11} t={t} style={{position:'absolute',left:755,top:1290,width:264}}><div style={{background:B,border:'1px solid #AACDFF',borderRadius:30,padding:'35px 18px',textAlign:'center',boxShadow:'0 25px 60px #0005'}}><Icon kind={0}/><div style={{fontSize:33,fontWeight:700,marginTop:20}}>WhatsApp</div></div></Pop>
  </AbsoluteFill>}
  {t>=16.6&&t<19.44&&<AbsoluteFill style={{opacity:fade(t,16.82,19.22)}}>
    <Pop start={16.85} t={t} style={{position:'absolute',left:60,right:60,top:280,textAlign:'center'}}><div style={{fontSize:215,fontWeight:700,color:B,lineHeight:1}}>3</div><div style={{fontSize:62,fontWeight:700,letterSpacing:-2,marginTop:10}}>problemas comuns.</div></Pop>
    <div style={{position:'absolute',left:70,right:70,top:815,display:'flex',gap:22}}>{[1,2,3].map((n)=><Pop key={n} start={17+n*.2} t={t} style={{flex:1}}><div style={{height:250,borderRadius:30,border:'1px solid #BCD3FF',background:'white',display:'grid',placeItems:'center',boxShadow:'0 18px 40px #16357818',fontSize:90,fontWeight:700,color:n===1?B:'#AEC1E3'}}>0{n}</div></Pop>)}</div>
  </AbsoluteFill>}
  {t>=19&&<AbsoluteFill style={{opacity:r(t,19,19.5)}}>
    <div style={{position:'absolute',left:65,top:220,right:65}}><div style={{fontSize:27,color:'#A8C9FF',letterSpacing:4}}>PROBLEMA 01</div><Pop start={19.25} t={t}><div style={{fontSize:111,lineHeight:1.03,letterSpacing:-5,fontWeight:700,marginTop:25}}>Demora para<br/>responder.</div></Pop></div>
    <Pop start={21} t={t} style={{position:'absolute',left:65,top:600,width:950}}><div style={{height:510,borderRadius:36,border:'1px solid #477DD588',background:'linear-gradient(135deg,#143675,#071935)',padding:42,boxShadow:'0 25px 80px #0005'}}>
      <div style={{fontSize:20,letterSpacing:3,color:'#88A9DC'}}>EXEMPLO ILUSTRATIVO</div>
      <div style={{display:'flex',gap:20,alignItems:'center',marginTop:42,opacity:r(t,23.2,25.7,1,.55)}}><div style={{width:72,height:72,borderRadius:'50%',background:'#355CA1',display:'grid',placeItems:'center',fontSize:32}}>C</div><div style={{background:'#E9F2FF',color:N,padding:'24px 27px',borderRadius:'25px 25px 25px 6px',fontSize:36,fontWeight:600}}>Olá, preciso de atendimento.</div></div>
      <div style={{display:'flex',alignItems:'center',gap:25,marginTop:48,color:'#BFD5FB'}}><svg width='70' height='70' viewBox='0 0 70 70'><circle cx='35' cy='35' r='29' fill='none' stroke='#4C77B9' strokeWidth='3'/><path d='M35 15v20l13 10' stroke='#BFD5FB' strokeWidth='4' fill='none' style={{transformOrigin:'35px 35px',transform:`rotate(${r(t,22,25.98,0,160)}deg)`}}/></svg><span style={{fontSize:36}}>Aguardando resposta…</span></div>
      <Pop t={t} start={23.22}><div style={{marginTop:30,fontSize:33,color:'#B8D0FF',fontWeight:700}}>O interesse diminui. ↓</div></Pop>
    </div></Pop>
  </AbsoluteFill>}
  {cap&&<div style={{position:'absolute',left:55,right:55,bottom:100,textAlign:'center',zIndex:10,fontSize:51,fontWeight:700,lineHeight:1.25,textShadow:dark?'0 3px 12px #0009':'none'}}><span style={{display:'inline-block',background:dark?'#010B36D9':'#F8FAFFEB',borderRadius:16,padding:'15px 23px'}}>{cap.words.map((word,i)=><span key={i} style={{color:t>=word.start&&t<word.end?dark?'#83B5FF':B:dark?'white':N}}>{word.word.trim()}{i<cap.words.length-1?' ':''}</span>)}</span></div>}
 </AbsoluteFill>;
};
