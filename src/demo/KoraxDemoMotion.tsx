import React from 'react';
import {AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import {KORAX_LOGO_DATA_URL} from '../logoData';
import {DemoVideo} from './KoraxDemo';
import captionData from './captions.json';

type Caption = {start: number; end: number; text: string};
const captions = captionData as Caption[];
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(.2, .8, .2, 1);
const range = (time: number, from: number, to: number, a = 0, b = 1) => interpolate(time, [from, to], [a, b], {...clamp, easing: ease});
const envelope = (time: number, from: number, to: number) => Math.min(range(time, from, from + .22), range(time, to - .22, to, 1, 0));

const Reveal: React.FC<{children: React.ReactNode; start: number; y?: number; fontSize?: number; color?: string; align?: 'left' | 'center'}> = ({children, start, y=0, fontSize=100, color='white', align='left'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - Math.round(start * fps), fps, config: {damping: 20, stiffness: 170, mass: .8}});
  return <div style={{overflow: 'hidden', paddingBottom: 8, marginTop: y}}><div style={{transform: `translateY(${(1-p)*120}%)`, fontSize, fontWeight: 700, color, lineHeight: 1, letterSpacing: -fontSize*.045, textAlign: align}}>{children}</div></div>;
};

export const KoraxDemoMotion: React.FC<{video: DemoVideo; muted?: boolean}> = ({video, muted = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t=frame/fps;
  const path=[0, 4.98, 5.48, 7.35, 7.83, 9.98, 10.48, 11.3, 12.15, 17.73];
  const pos=(values:number[])=>interpolate(t,path,values,{...clamp,easing:ease});
  const w=pos([1080,1080,770,770,470,470,365,365,280,280]);
  const h=w*1920/1080;
  const x=pos([0,0,155,155,545,545,640,640,730,730]);
  const y=pos([0,0,160,160,255,255,950,950,150,150]);
  const radius=pos([0,0,38,38,38,38,32,32,28,28]);
  const rotate=pos([0,0,-2,-2,2,2,-3,-3,0,0]);
  const zoom=range(t,0,5,1,1.065);
  const subtitle=captions.find(c=>t>=c.start&&t<c.end);
  const hook=envelope(t,.45,5.1);
  const attention=envelope(t,5.05,7.78);
  const founder=envelope(t,7.82,10.15);
  const brand=envelope(t,10.0,11.9);
  const flow=envelope(t,11.55,18);
  const operation=range(t,12.78,13.3);
  const flash=envelope(t,9.98,10.32)*.14;
  return <AbsoluteFill style={{backgroundColor:'#010B36',fontFamily:'Inter, Arial, sans-serif',overflow:'hidden',color:'white'}}>
    <AbsoluteFill style={{background:'radial-gradient(ellipse at 75% 20%, #052875 0%, transparent 62%), linear-gradient(160deg, #010B36, #000619)'}} />
    <div style={{position:'absolute',width:1100,height:1100,left:-550+range(t,5,17,0,180),top:560,border:'1px solid rgba(106,153,255,.13)',borderRadius:'50%'}} />
    <div style={{position:'absolute',width:860,height:860,left:-420+range(t,5,17,0,140),top:680,border:'1px solid rgba(106,153,255,.09)',borderRadius:'50%'}} />
    <div style={{position:'absolute',left:66,top:86,display:'flex',alignItems:'center',gap:14,opacity:range(t,5,5.5),zIndex:5}}>
      <Img src={KORAX_LOGO_DATA_URL} style={{width:45,height:45}} />
      <span style={{fontWeight:700,fontSize:28,letterSpacing:4}}>KORAX</span>
    </div>
    <div style={{position:'absolute',left:x,top:y,width:w,height:h,overflow:'hidden',borderRadius:radius,transform:`perspective(1800px) rotateY(${rotate}deg) rotateZ(${rotate*.45}deg)`,boxShadow:'0 40px 100px rgba(0,0,0,.48)',border:t>5?'1px solid rgba(170,195,255,.22)':'none',zIndex:3}}>
      <OffthreadVideo muted={muted} src={staticFile(video.src)} style={{width:'100%',height:'100%',objectFit:'cover',transform:`scale(${t<5?zoom:1.03})`,transformOrigin:'50% 35%'}} />
      <AbsoluteFill style={{background:'linear-gradient(180deg, transparent 45%, rgba(1,11,54,.15) 63%, rgba(1,11,54,.86) 100%)'}} />
    </div>
    <div style={{position:'absolute',left:66,right:66,top:1260,zIndex:4,opacity:hook}}>
      <div style={{fontSize:26,letterSpacing:5,fontWeight:600,marginBottom:22}}>SE VOCÊ USA</div>
      <Reveal start={.48} fontSize={146}>WhatsApp.</Reveal>
      <div style={{height:120,position:'relative',marginTop:24}}>
        {[{label:'ATENDA.',start:1.22,end:2.16},{label:'VENDA.',start:2.2,end:3.1},{label:'ORGANIZE.',start:3.12,end:5.05}].map(v=>{
          const a=envelope(t,v.start,v.end);
          return <div key={v.label} style={{position:'absolute',left:0,top:0,opacity:a,transform:`translateX(${(1-range(t,v.start,v.start+.24))*160}px)`,fontSize:86,fontWeight:700,letterSpacing:-3,color:'#A8C6FF'}}>{v.label}</div>;
        })}
      </div>
    </div>
    <div style={{position:'absolute',left:66,right:66,top:1260,zIndex:4,opacity:attention}}>
      <Reveal start={5.14} fontSize={140}>PRESTA</Reveal>
      <Reveal start={5.48} fontSize={140} color='#ABC6FF'>ATENÇÃO.</Reveal>
      <div style={{width:range(t,5.7,6.2,0,210),height:7,background:'#0057FF',marginTop:26}} />
    </div>
    <div style={{position:'absolute',left:70,top:590,width:430,zIndex:4,opacity:founder}}>
      <div style={{fontSize:23,letterSpacing:4,color:'#ABC6FF',marginBottom:26}}>QUEM ESTÁ FALANDO</div>
      <Reveal start={7.87} fontSize={112}>Diego</Reveal>
      <Reveal start={8.18} fontSize={83}>Nogueira.</Reveal>
      <div style={{fontSize:34,lineHeight:1.4,marginTop:34,opacity:range(t,8.85,9.15),transform:`translateY(${range(t,8.85,9.15,25,0)}px)`}}>Fundador da<br/><span style={{fontWeight:700,color:'#AFC8FF'}}>KORAX</span></div>
    </div>
    <div style={{position:'absolute',left:66,right:66,top:450,zIndex:4,opacity:brand,textAlign:'center'}}>
      <Img src={KORAX_LOGO_DATA_URL} style={{width:170,height:170,transform:`scale(${range(t,10.02,10.48,.55,1)}) rotate(${range(t,10.02,10.48,-12,0)}deg)`}} />
      <Reveal start={10.08} fontSize={194} align='center'>KORAX</Reveal>
      <div style={{fontSize:27,letterSpacing:5,marginTop:28,color:'#BCD0FB',opacity:range(t,10.5,10.8)}}>OPERAÇÃO COMERCIAL INTELIGENTE</div>
    </div>
    <div style={{position:'absolute',inset:0,zIndex:4,opacity:flow}}>
      <div style={{position:'absolute',left:80,top:570,width:460,opacity:1-operation,transform:`translateY(${(1-range(t,11.55,12))*90}px) scale(${range(t,11.55,12,.85,1)})`,transformOrigin:'left center'}}>
        <div style={{fontSize:27,letterSpacing:4,color:'#BCD0FB',marginBottom:24}}>TRANSFORME SEU</div>
        <div style={{background:'#092932',border:'1px solid #2DA481',borderRadius:32,padding:'42px 34px',boxShadow:'0 24px 55px rgba(0,0,0,.25)'}}>
          <div style={{fontSize:74,fontWeight:700,letterSpacing:-3}}>WhatsApp</div>
          <div style={{fontSize:28,color:'#A7DACC',marginTop:12}}>Conversas que avançam.</div>
        </div>
      </div>
      <div style={{position:'absolute',left:100,top:910,width:880,height:5,background:'rgba(123,160,240,.2)',opacity:1-operation,transform:'rotate(-8deg)',transformOrigin:'left center'}}>
        <div style={{height:5,width:range(t,12.2,12.78,0,880),background:'#0057FF'}} />
      </div>
      <div style={{position:'absolute',left:80,top:660,width:920,opacity:operation,transform:`perspective(1600px) translateY(${(1-operation)*120}px) rotateX(${(1-operation)*25}deg) scale(${.84+operation*.16})`,transformOrigin:'center center'}}>
        <div style={{background:'linear-gradient(135deg,#063BA1,#071C52)',border:'1px solid rgba(128,174,255,.55)',borderRadius:40,padding:'56px 48px',boxShadow:'0 35px 90px rgba(0,0,0,.4)'}}>
          <div style={{fontSize:25,letterSpacing:4,color:'#BFD5FF',marginBottom:30}}>O PRÓXIMO NÍVEL DO WHATSAPP</div>
          <Reveal start={12.85} fontSize={105}>OPERAÇÃO</Reveal>
          <Reveal start={13.1} fontSize={105}>COMERCIAL.</Reveal>
        </div>
      </div>
      <div style={{position:'absolute',left:80,right:80,top:1170,display:'flex',gap:16}}>
        {[{label:'Organizada',start:14.74},{label:'Acompanhável',start:16.36},{label:'Inteligente',start:17.0}].map((v,i)=>{
          const p=spring({frame:frame-Math.round(v.start*fps),fps,config:{damping:18,stiffness:160}});
          return <div key={v.label} style={{width:296,height:160,padding:'28px 20px',borderRadius:24,background:i===2?'#0057FF':'#0B1E49',border:'1px solid rgba(152,186,255,.35)',opacity:range(t,v.start,v.start+.12),transform:`translateY(${(1-p)*95}px) scale(${.75+.25*p})`,boxShadow:'0 20px 45px rgba(0,0,0,.25)'}}>
            <div style={{fontSize:22,color:'#B8D0FF',letterSpacing:3,marginBottom:20}}>0{i+1}</div>
            <div style={{fontSize:i===1?31:37,fontWeight:600,letterSpacing:-1}}>{v.label}</div>
          </div>;
        })}
      </div>
    </div>
    <AbsoluteFill style={{backgroundColor:'#0057FF',opacity:flash,pointerEvents:'none',zIndex:6}} />
    {subtitle&&<div style={{position:'absolute',left:64,right:64,bottom:142,textAlign:'center',zIndex:8}}>
      <span style={{display:'inline-block',maxWidth:'100%',padding:'17px 26px',borderRadius:16,background:'rgba(0,6,28,.92)',fontSize:47,fontWeight:600,lineHeight:1.24,boxShadow:'0 12px 30px rgba(0,0,0,.22)'}}>{subtitle.text}</span>
    </div>}
  </AbsoluteFill>;
};
