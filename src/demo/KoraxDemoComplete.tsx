import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import {KORAX_LOGO_DATA_URL} from '../logoData';
import {DemoVideo} from './KoraxDemo';
import {KoraxDemoMotion} from './KoraxDemoMotion';
import captionData from './captions.json';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const easing = Easing.bezier(.22, .8, .2, 1);
const ramp = (t: number, a: number, b: number, x = 0, y = 1) => interpolate(t, [a, b], [x, y], {...clamp, easing});
const BLUE = '#0057FF';
const PALE = '#AEC9FF';
type Focus = {at: number; x: number; y: number; zoom: number; box?: [number, number, number, number]};
type ScreenScene = {start: number; end: number; src: string; eyebrow: string; title: string; description: string; label: string; focus: Focus[]};
const overview: Focus = {at: 0, x: 724, y: 543, zoom: 1};

// Coordinates refer to the original 1448 × 1086 images; no simulated clicks or UI state changes.
const screens: ScreenScene[] = [
  {start: 17.733333, end: 21.6, src: 'conversas', eyebrow: '01 / ATENDIMENTO', title: 'Sua equipe.\nNo mesmo lugar.', description: 'Usuários, responsáveis e contexto.', label: 'RESPONSÁVEL PELO ATENDIMENTO', focus: [overview, {at: 1.35, x: 1180, y: 432, zoom: 2.05, box: [1173, 286, 242, 322]}]},
  {start: 21.6, end: 27.64, src: 'conversas', eyebrow: '01 / CONTINUIDADE', title: 'Outro atendente.\nMesmo histórico.', description: 'Transfira o atendimento mantendo o contexto.', label: 'HISTÓRICO DA CONVERSA', focus: [{...overview, zoom: 1.15}, {at: 1.65, x: 988, y: 242, zoom: 2.15, box: [938, 187, 43, 43]}, {at: 3.7, x: 1030, y: 590, zoom: 1.9, box: [878, 514, 388, 235]}]},
  {start: 27.64, end: 32.0, src: 'crm', eyebrow: '02 / CRM', title: 'Cada negociação.\nUma etapa clara.', description: 'Acompanhe o avanço das oportunidades.', label: 'ETAPAS DA NEGOCIAÇÃO', focus: [overview, {at: 1.6, x: 730, y: 640, zoom: 1.95, box: [527, 471, 533, 357]}]},
  {start: 32.0, end: 37.1, src: 'crm', eyebrow: '02 / GESTÃO', title: 'Visão clara\nda operação.', description: 'Do atendimento aos resultados.', label: 'INDICADORES EM FOCO', focus: [{...overview, zoom: 1.05}, {at: 1.8, x: 760, y: 350, zoom: 1.75, box: [514, 240, 542, 123]}]},
  {start: 37.1, end: 45.28, src: 'follow-up', eyebrow: '03 / FOLLOW-UP', title: 'A próxima ação\njá tem hora.', description: 'Programe os retornos de cada cliente.', label: 'FOLLOW-UPS PROGRAMADOS', focus: [overview, {at: 2, x: 635, y: 637, zoom: 1.65, box: [384, 415, 432, 241]}, {at: 4.55, x: 1145, y: 600, zoom: 2.05, box: [1020, 411, 322, 313]}]},
  {start: 45.28, end: 54.5, src: 'agenda', eyebrow: '04 / AGENDA', title: 'A conversa vira\num compromisso.', description: 'Reunião, consulta ou visita no mesmo fluxo.', label: 'DISPONIBILIDADE E AGENDAMENTO', focus: [overview, {at: 2.4, x: 1110, y: 614, zoom: 2.15, box: [978, 494, 337, 231]}, {at: 5.7, x: 428, y: 771, zoom: 1.65, box: [36, 724, 341, 295]}, {at: 7.9, x: 1150, y: 881, zoom: 1.65, box: [1127, 852, 290, 81]}]},
  {start: 73.72, end: 79.53, src: 'agenda', eyebrow: 'IA / AGENDAMENTO', title: 'Disponibilidade.\nAgendamento.', description: 'Uma jornada conectada à agenda.', label: 'AGENDA DO PRODUTO', focus: [overview, {at: 2, x: 1100, y: 612, zoom: 2.05, box: [978, 494, 337, 231]}, {at: 4.6, x: 1150, y: 874, zoom: 1.55, box: [1127, 852, 290, 81]}]},
  {start: 79.53, end: 89.64, src: 'conversas', eyebrow: 'IA / EQUIPE', title: 'A pessoa certa.\nCom o contexto.', description: 'O atendimento continua com sua equipe.', label: 'RESPONSÁVEL + HISTÓRICO', focus: [overview, {at: 2.5, x: 1180, y: 431, zoom: 2, box: [1173, 286, 242, 322]}, {at: 6.0, x: 1030, y: 590, zoom: 1.85, box: [878, 514, 388, 235]}]},
  {start: 100.26, end: 103.66, src: 'conversas', eyebrow: '05 / ACOMPANHAMENTO', title: 'Quem atende.\nQuem avança.', description: 'Sua operação continua visível.', label: 'ATENDIMENTO E RESPONSÁVEIS', focus: [overview, {at: 1.4, x: 1170, y: 441, zoom: 1.8, box: [1173, 286, 242, 322]}]},
  {start: 103.66, end: 106.02, src: 'crm', eyebrow: '05 / ACOMPANHAMENTO', title: 'Negociações\nem movimento.', description: 'Encontre as oportunidades em cada etapa.', label: 'CRM COMERCIAL', focus: [{...overview, zoom: 1.15}, {at: 1.15, x: 756, y: 645, zoom: 1.8}]},
  {start: 106.02, end: 109.78, src: 'follow-up', eyebrow: '05 / ACOMPANHAMENTO', title: 'Qual é a\npróxima ação?', description: 'Priorize os retornos e acompanhe a operação.', label: 'PRÓXIMOS FOLLOW-UPS', focus: [overview, {at: 1.45, x: 1140, y: 600, zoom: 1.95, box: [1020, 411, 322, 313]}]},
  {start: 130.5, end: 131.76, src: 'respostas-rapidas', eyebrow: '06 / ESTRUTURA', title: 'Atendimento.', description: 'Organização para o dia a dia da equipe.', label: 'RESPOSTAS RÁPIDAS', focus: [{...overview, zoom: 1.12}]},
  {start: 131.76, end: 134.02, src: 'conversas', eyebrow: '06 / ESTRUTURA', title: 'Equipe. Setores.\nHistórico.', description: 'Tudo conectado à conversa.', label: 'CONTINUIDADE NO ATENDIMENTO', focus: [{...overview, zoom: 1.18}, {at: 1.1, x: 1000, y: 510, zoom: 1.65}]},
  {start: 134.02, end: 134.9, src: 'crm', eyebrow: '06 / ESTRUTURA', title: 'CRM.', description: 'As etapas da negociação.', label: 'OPORTUNIDADES', focus: [{...overview, zoom: 1.35}]},
  {start: 134.9, end: 135.45, src: 'follow-up', eyebrow: '06 / ESTRUTURA', title: 'Follow-up.', description: 'O próximo contato.', label: 'RETORNOS', focus: [{...overview, zoom: 1.3}]},
  {start: 135.45, end: 136.4, src: 'agenda', eyebrow: '06 / ESTRUTURA', title: 'Agenda.', description: 'O próximo compromisso.', label: 'AGENDAMENTOS', focus: [{...overview, zoom: 1.25}]},
  {start: 138.9, end: 143, src: 'crm', eyebrow: 'KORAX / NA PRÁTICA', title: 'Operações reais.\nEstrutura real.', description: 'Atendimentos e processos comerciais.', label: 'TELA DO PRODUTO', focus: [overview, {at: 1.8, x: 741, y: 598, zoom: 1.6}]},
  {start: 143, end: 148.66, src: 'respostas-rapidas', eyebrow: 'KORAX / NA PRÁTICA', title: 'Organize o\natendimento.', description: 'Equipe e processos no mesmo lugar.', label: 'ORGANIZAÇÃO DAS RESPOSTAS', focus: [overview, {at: 2.15, x: 694, y: 512, zoom: 1.6}, {at: 4.1, x: 1178, y: 517, zoom: 1.75}]},
];

const Screen: React.FC<{scene: ScreenScene; t: number}> = ({scene, t}) => {
  const local = t - scene.start;
  const steps = scene.focus;
  let previous = steps[0];
  let next = steps[0];
  for (const point of steps.slice(1)) {
    if (local < point.at - .7) break;
    next = point;
    if (local < point.at) break;
    previous = point;
  }
  const progress = previous === next ? 1 : ramp(local, next.at - .7, next.at);
  const x = previous.x + (next.x - previous.x) * progress;
  const y = previous.y + (next.y - previous.y) * progress;
  const zoom = previous.zoom + (next.zoom - previous.zoom) * progress;
  const scale = 972 / 1448 * zoom;
  const entry = ramp(local, 0, .32);
  return <div style={{position:'absolute',left:54,top:663,width:972,height:802,borderRadius:32,overflow:'hidden',background:'#F2F5F9',border:'1px solid rgba(160,195,255,.5)',boxShadow:'0 35px 80px #0007',transform:`translateY(${(1-entry)*65}px)`,opacity:entry}}>
    <div style={{position:'absolute',width:1448,height:1086,transformOrigin:'0 0',transform:`translate(${486-x*scale}px, ${401-y*scale}px) scale(${scale})`}}>
      <Img src={staticFile(`telas/${scene.src}.webp`)} style={{width:1448,height:1086}} />
      {next.box && <div style={{position:'absolute',left:next.box[0],top:next.box[1],width:next.box[2],height:next.box[3],border:'3px solid #0057FF',borderRadius:12,boxShadow:'0 0 0 5px #0057FF22',opacity:ramp(progress,.45,1)}} />}
    </div>
    <div style={{position:'absolute',bottom:0,left:0,right:0,height:5,background:'#0057FF',transform:`scaleX(${ramp(local,0,scene.end-scene.start)})`,transformOrigin:'left'}} />
  </div>;
};

const Title: React.FC<{eyebrow: string; title: string; description: string; start: number; t: number}> = ({eyebrow,title,description,start,t}) => {
  const local=t-start;
  const p=spring({frame:Math.round(local*30),fps:30,config:{damping:24,stiffness:180}});
  return <div style={{position:'absolute',left:64,top:264,width:650,opacity:ramp(local,0,.18)}}>
    <div style={{fontSize:23,letterSpacing:3,color:PALE,fontWeight:600,marginBottom:28}}>{eyebrow}</div>
    <div style={{overflow:'hidden'}}><div style={{whiteSpace:'pre-line',fontSize:76,lineHeight:1.04,letterSpacing:-3.8,fontWeight:700,transform:`translateY(${(1-p)*155}px)`}}>{title}</div></div>
    <div style={{fontSize:29,lineHeight:1.45,color:'#C1D1F1',marginTop:28,maxWidth:580,opacity:ramp(local,.2,.5)}}>{description}</div>
  </div>;
};

const PathCard: React.FC<{title: string; detail: string; index: number; start: number; t: number; active?: boolean}> = ({title,detail,index,start,t,active=false}) => {
  const p=spring({frame:Math.round((t-start)*30),fps:30,config:{damping:23,stiffness:180}});
  return <div style={{padding:'30px 32px',height:148,borderRadius:26,background:active?'linear-gradient(125deg,#0057FF,#08367B)':'linear-gradient(125deg,#0C2454,#081733)',border:`1px solid ${active?'#9BC4FF':'#23447A'}`,display:'flex',gap:28,alignItems:'center',opacity:ramp(t,start,start+.25),transform:`translateX(${(1-p)*100}px)`,boxShadow:'0 20px 45px #0003'}}>
    <div style={{width:64,height:64,borderRadius:20,background:'#FFFFFF12',display:'grid',placeItems:'center',fontSize:30,fontWeight:600,color:PALE}}>{String(index).padStart(2,'0')}</div>
    <div><div style={{fontSize:43,fontWeight:700,letterSpacing:-1}}>{title}</div><div style={{fontSize:25,color:'#BCD0F5',marginTop:8}}>{detail}</div></div>
    <div style={{marginLeft:'auto',fontSize:36,color:PALE}}>↗</div>
  </div>;
};

const Intelligence: React.FC<{t: number; start: number}> = ({t,start}) => {
  const training = t>=64.86&&t<73.72;
  const summary = t>=89.64 || t>=136.4;
  const rows = training ? [
    {title:'Seu negócio',detail:'Produtos, serviços e regras',at:64.86},
    {title:'Sua jornada',detail:'O caminho comercial do cliente',at:69.5},
    {title:'Seu atendimento',detail:'O contexto de cada conversa',at:71.75},
  ] : [
    {title:'Entender',detail:'Negócio, regras e contexto',at:start+.5},
    {title:'Agendar',detail:'Conectar a conversa à agenda',at:start+1.15},
    {title:'Acionar a equipe',detail:'A pessoa certa com o histórico',at:start+1.8},
  ];
  const intro=t<64.86;
  return <>
    <Title t={t} start={start} eyebrow='KORAX / INTELIGÊNCIA ARTIFICIAL' title={training?'Treinada para\no seu negócio.':summary?'IA + equipe.\nNo mesmo fluxo.':'Inteligência\nque participa.'} description={training?'Conhecimento que acompanha a jornada comercial.':'Da conversa à próxima ação comercial.'} />
    <div style={{position:'absolute',left:64,top:685,right:64}}>
      <div style={{fontSize:26,letterSpacing:3,color:PALE,marginBottom:30}}>JORNADA COMERCIAL</div>
      {rows.map((r,i)=><React.Fragment key={r.title}><PathCard title={r.title} detail={r.detail} index={i+1} start={r.at} t={t} active={training?i===1:summary?i===2:i===0}/>{i<2&&<div style={{height:59,marginLeft:65,display:'flex',alignItems:'center'}}><div style={{height:39,width:3,background:BLUE,opacity:ramp(t,r.at+.4,r.at+.8)}}/></div>}</React.Fragment>)}
      <div style={{marginTop:38,fontSize:24,color:'#87A3CF',letterSpacing:1}}>{intro?'CONHECIMENTO + AÇÃO + CONTEXTO':'TUDO CONECTADO À OPERAÇÃO'}</div>
    </div>
  </>;
};

const Device: React.FC<{type:'laptop'|'tablet'|'phone'; label:string; start:number;t:number}> = ({type,label,start,t}) => {
  const p=spring({frame:Math.round((t-start)*30),fps:30,config:{damping:20,stiffness:140}});
  const w=type==='laptop'?350:type==='tablet'?250:168;
  const h=type==='laptop'?220:type==='tablet'?310:340;
  return <div style={{textAlign:'center',transform:`translateY(${(1-p)*90}px)`,opacity:ramp(t,start,start+.2)}}>
    <div style={{width:w,height:380,display:'grid',placeItems:'center'}}><div style={{width:w,height:h,padding:14,background:'linear-gradient(140deg,#466494,#142549)',border:'2px solid #7698C7',borderRadius:type==='laptop'?18:28,boxShadow:'0 30px 65px #0007',position:'relative'}}>
      <div style={{width:'100%',height:'100%',borderRadius:14,background:'radial-gradient(ellipse at top,#084EC2,#020D34 80%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:15}}><Img src={KORAX_LOGO_DATA_URL} style={{width:type==='phone'?54:70,height:type==='phone'?54:70}}/><div style={{fontSize:type==='phone'?17:23,fontWeight:600,letterSpacing:2}}>KORAX</div></div>
      {type==='laptop'&&<div style={{position:'absolute',left:-20,right:-20,height:15,bottom:-12,background:'linear-gradient(#94AED0,#33486B)',borderRadius:'3px 3px 15px 15px'}}/>}
    </div></div>
    <div style={{fontSize:30,color:PALE,marginTop:25}}>{label}</div>
  </div>;
};

const Freedom: React.FC<{t:number}> = ({t}) => <>
  <Title t={t} start={109.78} eyebrow='KORAX / MOBILIDADE' title={'Sua operação.\nOnde você estiver.'} description='Liberdade para acompanhar o seu negócio.' />
  <div style={{position:'absolute',left:75,right:75,top:880,display:'flex',alignItems:'flex-end',justifyContent:'space-between'}}>
    <Device type='laptop' label='Notebook' start={113.7} t={t}/><Device type='tablet' label='Tablet' start={115.4} t={t}/><Device type='phone' label='Celular' start={116.4} t={t}/>
  </div>
  <div style={{position:'absolute',left:65,right:65,top:1435,textAlign:'center',fontSize:27,color:PALE,opacity:ramp(t,118.8,119.2)}}>Acompanhamento além da mesa do escritório.</div>
</>;

const Structure: React.FC<{t:number}> = ({t}) => <>
  <Title t={t} start={123.14} eyebrow='KORAX / ESTRUTURA COMERCIAL' title={'Conversas que\nviram operação.'} description='Organização para cada parte do atendimento.' />
  <div style={{position:'absolute',left:65,right:65,top:706,display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
    {['Atendimento','Equipe','CRM','Follow-up','Agenda','Inteligência'].map((text,i)=>{
      const a=123.6+i*.65;
      return <div key={text} style={{height:207,padding:'35px 30px',border:'1px solid #345CA0',borderRadius:26,background:i===5?BLUE:'#0A2050',opacity:ramp(t,a,a+.25),transform:`translateY(${ramp(t,a,a+.4,60,0)}px)`}}><div style={{color:PALE,fontSize:22,marginBottom:34}}>0{i+1}</div><div style={{fontSize:40,fontWeight:700,letterSpacing:-1}}>{text}</div></div>;
    })}
  </div>
</>;

const Closing: React.FC<{t:number}> = ({t}) => {
  const cta=t>=159.2;
  return <div style={{position:'absolute',left:64,right:64,top:1060}}>
    <div style={{fontSize:25,letterSpacing:4,color:PALE,marginBottom:26,opacity:ramp(t,148.66,149)}}>{cta?'VEJA A KORAX NA PRÁTICA':'O PRÓXIMO PASSO DO SEU WHATSAPP'}</div>
    <div style={{fontSize:94,lineHeight:1.04,fontWeight:700,letterSpacing:-4.5,whiteSpace:'pre-line'}}>{cta?'Vamos conversar\nsobre sua empresa?':t>=156.12?'Uma verdadeira\noperação comercial.':'Seu WhatsApp\npode ir além.'}</div>
    {cta&&<div style={{marginTop:32,display:'inline-flex',alignItems:'center',gap:24,padding:'23px 32px',borderRadius:22,background:BLUE,fontSize:35,fontWeight:600,opacity:ramp(t,162.2,162.5),transform:`translateY(${ramp(t,162.2,162.6,35,0)}px)`}}>Fale com Diego Nogueira <span>↗</span></div>}
  </div>;
};

export const KoraxDemoComplete: React.FC<{video: DemoVideo}> = ({video}) => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const t=frame/fps;
  const scene=screens.find(s=>t>=s.start&&t<s.end);
  const ending=t>=148.66;
  const subtitle=captionData.find(c=>t>=c.start&&t<c.end);
  const chapter = t<54.5 ? 1 : t<100.26 ? 2 : t<123.14 ? 3 : t<148.66 ? 4 : 5;
  return <AbsoluteFill style={{background:'#010B36',color:'white',fontFamily:'Inter,Arial,sans-serif',overflow:'hidden'}}>
    <Audio src={staticFile(video.src)} />
    <AbsoluteFill style={{background:'radial-gradient(ellipse at 85% 12%,#092C71 0%,transparent 58%),linear-gradient(160deg,#010B36,#000619)'}}/>
    <div style={{position:'absolute',left:-430,top:795,width:1180,height:1180,borderRadius:'50%',border:'1px solid #5B91E922',transform:`translateX(${Math.sin(t*.15)*65}px)`}}/>
    <div style={{position:'absolute',left:-325,top:900,width:960,height:960,borderRadius:'50%',border:'1px solid #5B91E913'}}/>
    <div style={{position:'absolute',left:64,top:86,display:'flex',alignItems:'center',gap:14}}><Img src={KORAX_LOGO_DATA_URL} style={{width:45,height:45}}/><span style={{fontSize:28,fontWeight:700,letterSpacing:4}}>KORAX</span></div>
    {frame>=532&&<div style={{position:'absolute',left:ending?254:764,top:ending?182:165,width:ending?572:240,height:ending?820:427,overflow:'hidden',borderRadius:ending?38:26,boxShadow:'0 30px 75px #0007',border:'1px solid #709CDE66',transition:'none'}}>
      <OffthreadVideo muted src={staticFile(video.src)} style={{width:'100%',height:'100%',objectFit:'cover'}} />
      <AbsoluteFill style={{background:'linear-gradient(180deg,transparent 70%,#010B3688)'}}/>
      {ending&&<div style={{position:'absolute',bottom:26,left:28,fontSize:26,fontWeight:600}}>Diego Nogueira <span style={{fontSize:21,color:PALE}}>· Fundador</span></div>}
    </div>}
    {scene&&<><Title {...scene} t={t}/><Screen key={scene.start} scene={scene} t={t}/><div style={{position:'absolute',left:64,top:1510,fontSize:23,letterSpacing:2,color:PALE}}><span style={{color:BLUE,marginRight:12}}>●</span>{scene.label}</div></>}
    {t>=54.5&&t<73.72&&<Intelligence t={t} start={t<64.86?54.5:64.86}/>}
    {t>=89.64&&t<100.26&&<Intelligence t={t} start={89.64}/>}
    {t>=109.78&&t<123.14&&<Freedom t={t}/>}
    {t>=123.14&&t<130.5&&<Structure t={t}/>}
    {t>=136.4&&t<138.9&&<Intelligence t={t} start={136.4}/>}
    {ending&&<Closing t={t}/>}
    {t>=17.733333&&subtitle&&<div style={{position:'absolute',left:64,right:64,bottom:142,textAlign:'center',zIndex:8}}><span style={{display:'inline-block',maxWidth:'100%',padding:'17px 26px',borderRadius:16,background:'rgba(0,6,28,.94)',fontSize:43,fontWeight:600,lineHeight:1.27,boxShadow:'0 12px 30px #0004'}}>{subtitle.text}</span></div>}
    <div style={{position:'absolute',left:64,right:64,bottom:76,display:'flex',gap:9}}>{Array.from({length:5},(_,i)=><div key={i} style={{height:3,flex:1,background:i<chapter?BLUE:'#23406D'}}/>)}</div>
    <Sequence durationInFrames={532}><KoraxDemoMotion video={video} muted/></Sequence>
  </AbsoluteFill>;
};
