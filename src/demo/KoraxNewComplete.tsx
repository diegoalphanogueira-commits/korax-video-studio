import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, OffthreadVideo, interpolate, interpolateColors, spring, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import {KORAX_LOGO_DATA_URL} from '../logoData';
import {KoraxReferenceSample} from './KoraxReferenceSample';
import captions from './newFullCaptions.json';
import {MotionSoundEffects} from './MotionSoundEffects';
import {BackgroundMusic} from './BackgroundMusic';

const B='#0057FF', N='#010B36', P='#A7C8FF';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const ease=Easing.bezier(.22,.8,.18,1);
const r=(t:number,a:number,b:number,x=0,y=1)=>interpolate(t,[a,b],[x,y],{...clamp,easing:ease});
const fade=(t:number,a:number,b:number)=>Math.min(r(t,a-.24,a+.24),r(t,b-.24,b+.24,1,0));
type Pose='bottom'|'top'|'portrait';
type Kind='scattered'|'forgotten'|'process'|'brand'|'entry'|'ai'|'skills'|'contrast'|'training'|'handoff'|'context'|'team'|'screen'|'organized'|'follow'|'schedule'|'memory'|'auto'|'journey'|'devices'|'partner'|'diagnosis'|'setup'|'enablement'|'closing'|'cta';
type Scene={start:number;end:number;kind:Kind;dark:boolean;pose:Pose;eyebrow:string;title:string;detail?:string;screen?:string;focus?:[number,number,number];rows?:string[]};
export const fullScenes:Scene[]=[
 {start:26,end:34.66,kind:'scattered',dark:false,pose:'bottom',eyebrow:'PROBLEMA 02',title:'Cada um atende\nde um jeito.',detail:'Sem padrão, a informação se espalha.'},
 {start:34.66,end:43.4,kind:'forgotten',dark:true,pose:'bottom',eyebrow:'PROBLEMA 03',title:'A oportunidade\nfica para trás.',detail:'O cliente some. O retorno não acontece.'},
 {start:43.4,end:49.4,kind:'process',dark:false,pose:'bottom',eyebrow:'O PONTO NÃO É SÓ A DEMANDA',title:'Falta processo.',detail:'Mais contatos não resolvem um atendimento desorganizado.'},
 {start:49.4,end:53.12,kind:'brand',dark:true,pose:'portrait',eyebrow:'UMA OPERAÇÃO CONECTADA',title:'É para isso\nque existe a Korax.'},
 {start:53.12,end:61.16,kind:'entry',dark:false,pose:'bottom',eyebrow:'COMO FUNCIONA',title:'O mesmo WhatsApp.\nUma nova estrutura.',detail:'O cliente continua falando com a sua empresa.'},
 {start:61.16,end:67.12,kind:'ai',dark:true,pose:'top',eyebrow:'INTELIGÊNCIA ARTIFICIAL',title:'Seu funcionário\ndigital.',detail:'Atendimento imediato, treinado para o seu negócio.'},
 {start:67.12,end:72.64,kind:'training',dark:false,pose:'top',eyebrow:'CONHECIMENTO DA EMPRESA',title:'Treinado para\nentender.',rows:['Seu negócio','Seus produtos e serviços','O que o cliente precisa']},
 {start:72.64,end:81.78,kind:'skills',dark:true,pose:'top',eyebrow:'DA CONVERSA À AÇÃO',title:'Mais que responder.\nConduzir.',rows:['Responder dúvidas','Coletar informações','Qualificar o contato','Realizar agendamentos']},
 {start:81.78,end:85.4,kind:'contrast',dark:false,pose:'bottom',eyebrow:'UMA DIFERENÇA IMPORTANTE',title:'Não é só\nresposta pronta.'},
 {start:85.4,end:94.12,kind:'training',dark:true,pose:'top',eyebrow:'TREINADA PARA A SUA OPERAÇÃO',title:'Conhecimento\ncom direção.',rows:['Como a empresa funciona','Quais dados coletar','Quais perguntas fazer','Como conduzir a conversa']},
 {start:94.12,end:102.98,kind:'handoff',dark:false,pose:'bottom',eyebrow:'IA + EQUIPE',title:'A pessoa certa.\nCom o contexto.',detail:'O atendimento muda de responsável, não perde a história.'},
 {start:102.98,end:113.76,kind:'context',dark:true,pose:'top',eyebrow:'CONTINUIDADE NO ATENDIMENTO',title:'Sem começar\ndo zero.',rows:['Quem é o cliente','O que ele procura','O que já foi coletado','De onde continuar']},
 {start:113.76,end:118.6,kind:'team',dark:false,pose:'bottom',eyebrow:'UM ÚNICO AMBIENTE',title:'IA e equipe.\nJuntas na operação.'},
 {start:118.6,end:126.34,kind:'screen',dark:true,pose:'top',eyebrow:'TELA REAL / CONVERSAS',title:'Quem atende.\nOnde agir.',screen:'conversas',focus:[1180,432,1.8],detail:'Responsáveis e conversas no mesmo ambiente.'},
 {start:126.34,end:132.7,kind:'context',dark:false,pose:'top',eyebrow:'INFORMAÇÃO ORGANIZADA',title:'Cada conversa\nconstrói contexto.',rows:['Interesses do cliente','Histórico da conversa','Observações importantes','Dados coletados']},
 {start:132.7,end:137.88,kind:'screen',dark:false,pose:'top',eyebrow:'TELA REAL / CRM',title:'Oportunidades.\nPróximas ações.',screen:'crm',focus:[790,638,1.7],detail:'A informação acompanha a negociação.'},
 {start:137.88,end:145.48,kind:'organized',dark:true,pose:'bottom',eyebrow:'DE CONVERSAS A UMA ESTRUTURA',title:'Uma operação\ncomercial organizada.'},
 {start:145.48,end:153.82,kind:'follow',dark:false,pose:'bottom',eyebrow:'FOLLOW-UP',title:'A venda não termina\nno primeiro contato.',detail:'Muitas oportunidades são perdidas depois.'},
 {start:153.82,end:159.42,kind:'schedule',dark:true,pose:'bottom',eyebrow:'O PRÓXIMO CONTATO',title:'Cada retorno.\nNo seu momento.',rows:['Amanhã','Em 3 dias','Em 1 semana']},
 {start:159.42,end:166.02,kind:'screen',dark:false,pose:'top',eyebrow:'TELA REAL / FOLLOW-UP',title:'Não dependa\nsó da memória.',screen:'follow-up',focus:[1145,600,1.8],detail:'Os retornos ficam organizados na operação.'},
 {start:166.02,end:174.2,kind:'auto',dark:true,pose:'bottom',eyebrow:'AUTOMAÇÃO + IA',title:'O retorno também\npode ser automático.',detail:'Conforme o fluxo definido para a sua empresa.'},
 {start:174.2,end:178.6,kind:'screen',dark:false,pose:'top',eyebrow:'TELA REAL / AGENDA',title:'A conversa vira\num agendamento.',screen:'agenda',focus:[1110,614,1.8]},
 {start:178.6,end:181.06,kind:'journey',dark:true,pose:'bottom',eyebrow:'O FLUXO COMPLETO',title:'Tudo se conecta.'},
 {start:181.06,end:190.32,kind:'journey',dark:true,pose:'top',eyebrow:'JORNADA DO CLIENTE',title:'Uma conversa.\nUm caminho claro.',rows:['Cliente chama','IA atende e coleta','Entende a necessidade','Aciona a pessoa certa']},
 {start:190.32,end:199.46,kind:'journey',dark:false,pose:'top',eyebrow:'DA OPORTUNIDADE AO PRÓXIMO PASSO',title:'A jornada\ncontinua.',rows:['Oportunidade no CRM','Retornos organizados','Horário agendado']},
 {start:199.46,end:201.24,kind:'team',dark:true,pose:'bottom',eyebrow:'TUDO CONECTADO',title:'A mesma estrutura.'},
 {start:201.24,end:210.72,kind:'devices',dark:false,pose:'bottom',eyebrow:'ACOMPANHAMENTO',title:'Sua operação.\nOnde você estiver.',detail:'Celular, tablet ou notebook.'},
 {start:210.72,end:219.84,kind:'partner',dark:true,pose:'bottom',eyebrow:'IMPLANTAÇÃO ACOMPANHADA',title:'Você não precisa\nfazer isso sozinho.',detail:'Nossa equipe entra junto na operação.'},
 {start:219.84,end:230.48,kind:'diagnosis',dark:false,pose:'top',eyebrow:'01 / ENTENDER A SUA REALIDADE',title:'Primeiro,\na sua operação.',rows:['Atendimento atual','Processo comercial','Equipe e informações','Gargalos da operação']},
 {start:230.48,end:234.66,kind:'setup',dark:true,pose:'bottom',eyebrow:'02 / ESTRUTURAR',title:'Korax adaptada\nà sua empresa.',detail:'Uma estrutura de acordo com a sua realidade.'},
 {start:234.66,end:242.02,kind:'training',dark:true,pose:'top',eyebrow:'PREPARAÇÃO DA OPERAÇÃO',title:'Tudo pronto\npara trabalhar.',rows:['Treinar a IA','Organizar os atendentes','Definir os setores','Preparar a estrutura']},
 {start:242.02,end:246.84,kind:'enablement',dark:false,pose:'bottom',eyebrow:'03 / TREINAR A EQUIPE',title:'Sua equipe sabe\ncomo usar.',detail:'Treinamento para o dia a dia.'},
 {start:246.84,end:251.6,kind:'partner',dark:true,pose:'bottom',eyebrow:'04 / COLOCAR EM PRÁTICA',title:'Estruturar.\nColocar para funcionar.',detail:'Implantação dentro da sua empresa.'},
 {start:251.6,end:256.2,kind:'closing',dark:false,pose:'portrait',eyebrow:'O PAPEL DA KORAX',title:'Não substituir\no WhatsApp.'},
 {start:256.2,end:263.44,kind:'organized',dark:true,pose:'bottom',eyebrow:'TRANSFORMAR A OPERAÇÃO',title:'Organizada.\nInteligente. Previsível.'},
 {start:263.44,end:270.54,kind:'closing',dark:false,pose:'portrait',eyebrow:'OLHE PARA A SUA EMPRESA',title:'O que poderia\nestar mais organizado?'},
 {start:270.54,end:287.166667,kind:'cta',dark:true,pose:'portrait',eyebrow:'VEJA A KORAX NA PRÁTICA',title:'Agende uma\ndemonstração.',detail:'Vamos entender a sua operação e mostrar a Korax na prática.'},
];

const Pop:React.FC<{t:number;at:number;children:React.ReactNode;style?:React.CSSProperties}>=({t,at,children,style})=>{
 const p=spring({frame:Math.round((t-at)*30),fps:30,config:{damping:23,stiffness:175}});
 return <div style={{...style,opacity:r(t,at,at+.2),transform:`translateY(${(1-p)*45}px) scale(${.94+.06*p})`}}>{children}</div>;
};
const Glyph:React.FC<{kind?:number;size?:number}>=({kind=0,size=54})=><svg width={size} height={size} viewBox='0 0 48 48' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
 {kind===0?<><rect x='6' y='8' width='36' height='27' rx='7'/><path d='M16 35l-6 7v-9M15 19h18M15 26h11'/></>:kind===1?<><rect x='7' y='10' width='34' height='32' rx='6'/><path d='M7 20h34M15 5v9M33 5v9M17 30l5 5 10-10'/></>:kind===2?<><circle cx='24' cy='14' r='8'/><path d='M8 42v-6a16 16 0 0132 0v6M18 37l4 4 9-10'/></>:kind===3?<><rect x='8' y='10' width='32' height='29' rx='9'/><path d='M24 4v6M4 22h4M40 22h4M15 39v5M33 39v5M16 23h1M31 23h1M18 31h12'/></>:kind===4?<><rect x='10' y='5' width='28' height='38' rx='5'/><path d='M18 16h12M18 24h12M18 32h7'/></>:kind===5?<><path d='M8 39V24m11 15V17m11 22V10M5 43h38M7 16L19 8l12 1 10-5'/></>:kind===6?<><circle cx='24' cy='24' r='18'/><path d='M24 13v12l8 5M8 9H3v8'/></>:<><path d='M8 24h30M28 13l11 11-11 11M8 12v24'/></>}
</svg>;
const Card:React.FC<{children:React.ReactNode;dark:boolean;style?:React.CSSProperties}>=({children,dark,style})=><div style={{background:dark?'linear-gradient(115deg,#143675,#071935)':'#FFFFFF',border:`1px solid ${dark?'#477DD588':'#C2D8FF'}`,borderRadius:28,boxShadow:dark?'0 22px 65px #0004':'0 18px 45px #14377718',...style}}>{children}</div>;
const Title:React.FC<{s:Scene;t:number}>=({s,t})=>{
 const top=s.pose==='top';
 return <div style={{position:'absolute',left:65,top:220,width:top?620:950}}>
  <div style={{fontSize:23,fontWeight:600,letterSpacing:3,color:s.dark?P:B,marginBottom:25}}>{s.eyebrow}</div>
  <Pop t={t} at={s.start-.08}><div style={{fontSize:top?76:s.pose==='portrait'?83:95,fontWeight:700,letterSpacing:top?-3.6:-4.5,lineHeight:1.05,whiteSpace:'pre-line'}}>{s.title}</div></Pop>
  {s.detail&&s.pose!=='portrait'&&<Pop t={t} at={s.start+.35}><div style={{fontSize:28,lineHeight:1.4,color:s.dark?'#BAD0F2':'#557095',marginTop:24,maxWidth:top?570:890}}>{s.detail}</div></Pop>}
 </div>;
};
const Rows:React.FC<{s:Scene;t:number;times?:number[];kind?:number}>=({s,t,times,kind=4})=>{
 const rows=s.rows??['Entender','Organizar','Conduzir'];
 const h=rows.length>3?143:175;
 return <div style={{position:'absolute',left:65,right:65,top:s.pose==='top'?650:635}}>{rows.map((text,i)=>{
  const at=times?.[i]??s.start+.3+i*Math.min(1.7,(s.end-s.start-1.5)/rows.length);
  return <Pop key={text} t={t} at={at} style={{marginBottom:21}}><Card dark={s.dark} style={{height:h,display:'flex',alignItems:'center',gap:28,padding:'25px 32px',boxSizing:'border-box',borderColor:i===rows.length-1?'#0057FF88':undefined}}><div style={{color:s.dark?P:B,width:68}}><Glyph kind={kind===7?i%5:kind}/></div><div style={{fontSize:42,fontWeight:600,letterSpacing:-1.3,flex:1}}>{text}</div><span style={{color:s.dark?P:B,fontSize:31}}>↗</span></Card></Pop>;
 })}</div>;
};
const Connector:React.FC<{t:number;at:number;x:number;y:number;width:number}>=({t,at,x,y,width})=><svg style={{position:'absolute',left:x,top:y,width,height:44}} viewBox={`0 0 ${width} 44`}><path d={`M0 22H${width-15}m-12-10l12 10-12 10`} fill='none' stroke={B} strokeWidth='4' strokeDasharray={width+100} strokeDashoffset={(width+100)*(1-r(t,at,at+.7))}/></svg>;
const Hub:React.FC<{s:Scene;t:number;labels:string[]}>=({s,t,labels})=><div style={{position:'absolute',left:65,right:65,top:650,height:495}}>
 <svg width='950' height='495' viewBox='0 0 950 495' style={{position:'absolute'}}>{labels.map((_,i)=><path key={i} d={`M${[150,475,800][i]} 100 Q${[150,475,800][i]} 325 475 360`} fill='none' stroke={s.dark?'#568BDF':B} strokeWidth='4' strokeDasharray='600' strokeDashoffset={600*(1-r(t,s.start+.4+i*.2,s.start+1.7+i*.2))}/>)}</svg>
 <div style={{display:'flex',gap:24}}>{labels.map((label,i)=><Pop key={label} at={s.start+.1+i*.25} t={t} style={{flex:1}}><Card dark={s.dark} style={{height:174,textAlign:'center',padding:24,boxSizing:'border-box'}}><div style={{color:s.dark?P:B,marginBottom:14}}><Glyph kind={i===0?3:i===1?2:0}/></div><div style={{fontSize:29,fontWeight:700}}>{label}</div></Card></Pop>)}</div>
 <Pop at={s.start+1.2} t={t} style={{position:'absolute',left:255,top:300,width:440}}><div style={{height:166,borderRadius:28,background:B,color:'white',display:'flex',alignItems:'center',justifyContent:'center',gap:24,boxShadow:'0 20px 60px #0057FF33'}}><Img src={KORAX_LOGO_DATA_URL} style={{width:70,height:70}}/><div style={{fontSize:39,fontWeight:700}}>KORAX</div></div></Pop>
</div>;
const Screen:React.FC<{s:Scene;t:number}>=({s,t})=>{
 const focus=s.focus??[724,543,1.6];
 const p=r(t,s.start+1.5,Math.min(s.start+4.1,s.end-.7));
 const x=724+(focus[0]-724)*p,y=543+(focus[1]-543)*p,zoom=1+(focus[2]-1)*p;
 const scale=950/1448*zoom;
 return <Pop t={t} at={s.start+.15} style={{position:'absolute',left:65,top:665,width:950}}>
  <Card dark={s.dark} style={{height:772,overflow:'hidden',borderRadius:30,background:'#EDF2F8'}}>
   <div style={{height:48,display:'flex',alignItems:'center',gap:8,padding:'0 20px',background:s.dark?'#102650':'#E5ECF7',color:s.dark?P:'#587293',fontSize:17,letterSpacing:1}}>{[0,1,2].map(i=><span key={i} style={{width:9,height:9,borderRadius:'50%',background:'#829ABB'}}/>)}<span style={{marginLeft:14}}>KORAX / {s.screen?.toUpperCase()}</span></div>
   <div style={{height:716,position:'relative',overflow:'hidden'}}><Img src={staticFile(`telas/${s.screen}.webp`)} style={{position:'absolute',width:1448,height:1086,maxWidth:'none',transformOrigin:'0 0',transform:`translate(${475-x*scale}px,${358-y*scale}px) scale(${scale})`}}/></div>
   <div style={{height:8,background:B,width:`${100*r(t,s.start,s.end)}%`}}/>
  </Card>
  <div style={{marginTop:25,fontSize:24,color:s.dark?P:'#587293',letterSpacing:1,textAlign:'center'}}>TELA REAL DA PLATAFORMA · DESTAQUE VISUAL</div>
 </Pop>;
};
const Bubble:React.FC<{text:string;dark:boolean;right?:boolean;style?:React.CSSProperties}>=({text,dark,right=false,style})=><div style={{background:right?B:dark?'#DDEAFF':'#ECF3FF',color:right?'white':N,fontSize:36,fontWeight:600,padding:'27px 30px',borderRadius:right?'26px 26px 6px 26px':'26px 26px 26px 6px',...style}}>{text}</div>;
const Device:React.FC<{type:number;label:string;t:number;at:number}>=({type,label,t,at})=>{
 const w=[160,248,340][type],h=[320,305,210][type];
 return <Pop t={t} at={at} style={{width:w,textAlign:'center'}}><div style={{height:360,display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{position:'relative',width:w,height:h,padding:11,boxSizing:'border-box',borderRadius:type===2?17:28,background:'linear-gradient(145deg,#708AB0,#213655)',boxShadow:'0 22px 45px #112E5925',border:'2px solid #7C96BD'}}><div style={{height:'100%',background:N,borderRadius:18,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:18}}><Img src={KORAX_LOGO_DATA_URL} style={{width:65,height:65}}/><span style={{color:'white',fontSize:type===0?16:22,fontWeight:700,letterSpacing:3}}>KORAX</span><div style={{width:'65%',height:3,background:B}}/></div>{type===2&&<div style={{position:'absolute',bottom:-12,left:-20,right:-20,height:14,background:'#536D92',borderRadius:'4px 4px 12px 12px'}}/>}</div></div><div style={{fontSize:29,fontWeight:600,color:'#526C91',marginTop:18}}>{label}</div></Pop>;
};

const Visual:React.FC<{s:Scene;t:number}>=({s,t})=>{
 const l=t-s.start;
 if(s.kind==='screen')return <Screen s={s} t={t}/>;
 if(['training','context','diagnosis','skills'].includes(s.kind))return <Rows s={s} t={t} times={s.start===72.64?[72.64,75.22,76.14,77.64]:s.start===102.98?[106.46,108.56,109.68,111.28]:undefined} kind={s.kind==='skills'?7:s.kind==='context'?4:3}/>;
 if(s.kind==='scattered')return <div style={{position:'absolute',left:65,right:65,top:645}}>{['Atendente A · uma orientação','Atendente B · outra informação','Cliente · sem um caminho claro'].map((text,i)=><Pop key={text} t={t} at={s.start+.2+i*1.4} style={{marginBottom:23,transformOrigin:'center'}}><Card dark={false} style={{height:143,padding:'27px 33px',display:'flex',alignItems:'center',gap:25,boxSizing:'border-box',transform:`rotate(${[1.5,-1.5,.8][i]}deg)`}}><div style={{color:B}}><Glyph kind={i===2?0:2}/></div><span style={{fontSize:34,fontWeight:600}}>{text}</span></Card></Pop>)}</div>;
 if(s.kind==='forgotten')return <Pop t={t} at={s.start+.4} style={{position:'absolute',left:65,right:65,top:665}}><Card dark style={{padding:38,height:455,boxSizing:'border-box'}}><div style={{fontSize:19,letterSpacing:2,color:P,marginBottom:28}}>EXEMPLO ILUSTRATIVO</div><Bubble dark text='Vou analisar o orçamento.' style={{opacity:r(t,s.start+4,s.end-1,1,.65)}}/><div style={{marginTop:35,display:'flex',alignItems:'center',gap:23,color:P}}><Glyph kind={6}/><span style={{fontSize:33}}>A conversa para. O retorno não vem.</span></div><div style={{marginTop:28,height:8,borderRadius:8,background:'#295086'}}><div style={{height:8,borderRadius:8,background:'#85B6FF',width:`${100*r(l,2,7,1,.12)}%`}}/></div></Card></Pop>;
 if(s.kind==='process')return <div style={{position:'absolute',left:65,right:65,top:670}}><Pop t={t} at={s.start+.2}><Card dark={false} style={{padding:38,display:'flex',alignItems:'center',gap:25,height:145,boxSizing:'border-box'}}><span style={{fontSize:55,color:'#A8BCD9'}}>≠</span><span style={{fontSize:40,color:'#5B7495'}}>Só mais contatos chegando</span></Card></Pop><Pop t={t} at={47.2}><div style={{marginTop:36,padding:42,borderRadius:28,background:B,color:'white',fontSize:61,fontWeight:700,letterSpacing:-2}}>Processo no atendimento.</div></Pop></div>;
 if(s.kind==='brand')return <Pop t={t} at={s.start+.2} style={{position:'absolute',left:75,right:75,top:1560,textAlign:'center',zIndex:22}}><div style={{display:'inline-flex',alignItems:'center',gap:20,background:B,padding:'25px 35px',borderRadius:26}}><Img src={KORAX_LOGO_DATA_URL} style={{width:58,height:58}}/><span style={{fontSize:40,fontWeight:700}}>KORAX</span></div></Pop>;
 if(s.kind==='entry')return <><Pop t={t} at={s.start+.2} style={{position:'absolute',left:65,top:670,width:390}}><Card dark={false} style={{height:290,display:'grid',placeItems:'center',textAlign:'center',padding:25,boxSizing:'border-box'}}><div style={{color:B}}><Glyph kind={0} size={90}/><div style={{fontSize:40,fontWeight:700,marginTop:24}}>WhatsApp</div></div></Card></Pop><Connector t={t} at={57.26} x={465} y={785} width={145}/><Pop t={t} at={57.5} style={{position:'absolute',left:625,top:670,width:390}}><div style={{height:290,borderRadius:28,background:B,color:'white',display:'grid',placeItems:'center',textAlign:'center'}}><div><Img src={KORAX_LOGO_DATA_URL} style={{width:90,height:90}}/><div style={{fontSize:40,fontWeight:700,marginTop:24}}>Sua operação</div></div></div></Pop><Pop t={t} at={58.78} style={{position:'absolute',left:65,right:65,top:1025,textAlign:'center',fontSize:32,color:'#587293'}}>Você define como o atendimento funciona.</Pop></>;
 if(s.kind==='ai')return <><div style={{position:'absolute',left:260,top:735,width:560,height:560,borderRadius:'50%',border:'1px solid #639DFF66',transform:`scale(${1+.015*Math.sin(l*2)})`}}/><Pop t={t} at={s.start+.3} style={{position:'absolute',left:345,top:820}}><div style={{width:390,height:390,borderRadius:90,background:'linear-gradient(145deg,#176DFF,#092B75)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',boxShadow:'0 0 110px #0057FF55',gap:35}}><Glyph kind={3} size={160}/><div style={{fontSize:40,fontWeight:700}}>Funcionário digital</div></div></Pop><Pop t={t} at={64.76} style={{position:'absolute',left:65,right:65,top:1380,textAlign:'center',fontFamily:'Georgia,serif',fontSize:61,fontStyle:'italic',color:P}}>Conhecimento + ação.</Pop></>;
 if(s.kind==='contrast')return <div style={{position:'absolute',left:65,right:65,top:665,display:'flex',gap:27}}>{['Respostas genéricas','Objetivo + contexto'].map((text,i)=><Pop key={text} t={t} at={s.start+.2+i*.5} style={{flex:1}}><Card dark={false} style={{height:310,padding:35,boxSizing:'border-box',background:i?B:'white',color:i?'white':'#7790B1'}}><Glyph kind={i?3:0} size={75}/><div style={{fontSize:44,fontWeight:700,letterSpacing:-1.5,marginTop:32}}>{text}</div></Card></Pop>)}</div>;
 if(s.kind==='handoff')return <><div style={{position:'absolute',left:65,right:65,top:645,display:'flex',gap:155}}>{['Funcionário digital','Atendente humano'].map((text,i)=><Pop key={text} t={t} at={s.start+.3+i*.9} style={{width:397}}><Card dark={false} style={{height:270,padding:32,textAlign:'center',boxSizing:'border-box'}}><div style={{color:B}}><Glyph kind={i?2:3} size={87}/></div><div style={{fontSize:37,fontWeight:700,marginTop:23}}>{text}</div></Card></Pop>)}</div><Connector t={t} at={98.06} x={470} y={750} width={140}/><Pop t={t} at={100.3} style={{position:'absolute',left:65,right:65,top:985}}><div style={{padding:'32px 40px',background:B,color:'white',borderRadius:25,fontSize:37,fontWeight:600,display:'flex',alignItems:'center',justifyContent:'space-between'}}>Histórico + informações + contexto <Glyph kind={4}/></div></Pop></>;
 if(s.kind==='team')return <Hub s={s} t={t} labels={['IA','Atendentes','Vendedores']}/>;
 if(s.kind==='organized')return <><Hub s={s} t={t} labels={s.start>250?['Atendimento','Vendas','Previsibilidade']:['Conversas','Equipe','Informações']}/><Pop t={t} at={s.start+1.5} style={{position:'absolute',left:70,right:70,top:560,textAlign:'center',fontFamily:'Georgia,serif',fontSize:49,fontStyle:'italic',color:P}}>Tudo conectado à jornada do cliente.</Pop></>;
 if(s.kind==='follow')return <Pop t={t} at={s.start+.3} style={{position:'absolute',left:65,right:65,top:655}}><Card dark={false} style={{padding:38,height:445,boxSizing:'border-box'}}><div style={{fontSize:19,letterSpacing:2,color:'#587293',marginBottom:24}}>EXEMPLO ILUSTRATIVO</div><Bubble dark={false} text='Pode me enviar um orçamento?'/><div style={{display:'flex',gap:20,alignItems:'center',marginTop:32,color:B}}><Glyph kind={6}/><span style={{fontSize:35,fontWeight:600}}>E depois do primeiro atendimento?</span></div><Pop t={t} at={152.34}><div style={{fontSize:33,color:'#587293',marginTop:28}}>É aqui que o follow-up faz diferença.</div></Pop></Card></Pop>;
 if(s.kind==='schedule')return <div style={{position:'absolute',left:65,right:65,top:670}}><div style={{height:5,background:'#3765A5',position:'absolute',left:145,right:145,top:115}}/><div style={{display:'flex',gap:24}}>{(s.rows??[]).map((text,i)=><Pop key={text} t={t} at={[156.5,157.26,158.46][i]} style={{flex:1}}><Card dark style={{height:295,padding:25,textAlign:'center',boxSizing:'border-box',borderColor:i===1?'#86B8FF':'#477DD588'}}><div style={{display:'inline-flex',width:88,height:88,alignItems:'center',justifyContent:'center',borderRadius:24,background:B,fontSize:43,fontWeight:700,marginTop:40}}>{[1,3,7][i]}</div><div style={{fontSize:31,fontWeight:600,marginTop:30}}>{text}</div></Card></Pop>)}</div><Pop t={t} at={s.start+.1} style={{marginTop:40,textAlign:'center',fontSize:28,color:P}}>Orçamento hoje → próximos contatos definidos.</Pop></div>;
 if(s.kind==='auto')return <><Pop t={t} at={s.start+.2} style={{position:'absolute',left:65,right:65,top:660}}><Card dark style={{padding:35,height:430,boxSizing:'border-box'}}><div style={{fontSize:20,letterSpacing:2,color:P,marginBottom:30}}>FLUXO ILUSTRATIVO</div><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div style={{textAlign:'center',fontSize:29,color:P}}><Glyph kind={6} size={80}/><div style={{marginTop:16}}>Hora do retorno</div></div><span style={{color:P,fontSize:45}}>→</span><div style={{textAlign:'center',fontSize:29,color:P}}><Glyph kind={3} size={80}/><div style={{marginTop:16}}>Funcionário digital</div></div></div><Pop t={t} at={169.14} style={{marginTop:40}}><Bubble dark right text='Olá! Podemos continuar?'/></Pop></Card></Pop></>;
 if(s.kind==='journey')return s.rows?<Rows s={s} t={t} kind={7} times={s.start===181.06?[181.06,182.58,185.12,187.42]:[190.32,192.68,195.26]}/>:<Hub s={s} t={t} labels={['Atendimento','CRM','Agenda']}/>;
 if(s.kind==='devices')return <div style={{position:'absolute',left:100,right:100,top:700,display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}><Device type={0} label='Celular' at={205.06} t={t}/><Device type={1} label='Tablet' at={205.94} t={t}/><Device type={2} label='Notebook' at={206.52} t={t}/></div>;
 if(s.kind==='partner')return <><Pop t={t} at={s.start+.3} style={{position:'absolute',left:65,right:65,top:670}}><Card dark style={{height:340,padding:35,boxSizing:'border-box',display:'flex',alignItems:'center',gap:35}}><div style={{flex:1,textAlign:'center'}}><Glyph kind={2} size={95}/><div style={{fontSize:37,fontWeight:600,marginTop:25}}>Sua empresa</div></div><span style={{fontSize:60,color:P}}>+</span><div style={{flex:1,textAlign:'center'}}><Img src={KORAX_LOGO_DATA_URL} style={{width:95,height:95}}/><div style={{fontSize:37,fontWeight:600,marginTop:25}}>Equipe Korax</div></div></Card></Pop><Pop t={t} at={s.start+1.5} style={{position:'absolute',left:65,right:65,top:1075,textAlign:'center',fontSize:29,color:P}}>Entender → estruturar → treinar → implementar.</Pop></>;
 if(s.kind==='setup')return <Hub s={s} t={t} labels={['Processos','Equipe','Inteligência']}/>;
 if(s.kind==='enablement')return <Rows s={{...s,rows:['Aprender a plataforma','Usar no dia a dia','Trabalhar com uma estrutura']}} t={t} kind={2}/>;
 if(s.kind==='closing')return <Pop t={t} at={s.start+.3} style={{position:'absolute',left:70,right:70,top:1560,textAlign:'center',zIndex:22}}><div style={{display:'inline-block',padding:'25px 33px',borderRadius:24,background:s.dark?B:'white',color:s.dark?'white':B,fontSize:34,fontWeight:700,boxShadow:'0 18px 40px #14377722'}}>{s.start<260?'Transformar sua operação comercial.':'Atendimento · retornos · oportunidades'}</div></Pop>;
 if(s.kind==='cta')return <><Pop t={t} at={s.start+.2} style={{position:'absolute',left:65,right:65,top:1560,textAlign:'center',zIndex:22}}><div style={{display:'inline-flex',alignItems:'center',gap:25,padding:'28px 40px',background:B,borderRadius:25,boxShadow:'0 18px 65px #0057FF55',fontSize:42,fontWeight:700}}>Agendar demonstração <Glyph kind={7}/></div></Pop><Pop t={t} at={281.76} style={{position:'absolute',left:65,right:65,top:1670,textAlign:'center',fontSize:28,color:P,zIndex:22}}>Clique no botão ou envie uma mensagem.</Pop></>;
 return null;
};

type Placement={x:number;y:number;w:number;h:number;radius:number;scale:number;sourceTop:number};
const poses:Record<Pose,Placement>={
 bottom:{x:320,y:1210,w:440,h:440,radius:220,scale:1.15,sourceTop:-79},
 top:{x:715,y:180,w:340,h:340,radius:170,scale:.9,sourceTop:-64},
 portrait:{x:220,y:610,w:640,h:1090,radius:44,scale:1.25,sourceTop:0},
};
const openingTimes=[0,6.95,7.7,8.95,9.7,16.55,17.45,18.95,19.7,26];
const openingValues:Record<keyof Placement,number[]>={x:[220,220,160,160,715,715,340,340,320,320],y:[650,650,270,270,180,180,1210,1210,1210,1210],w:[640,640,760,760,340,340,400,400,440,440],h:[1090,1090,1320,1320,340,340,400,400,440,440],radius:[44,44,50,50,170,170,200,200,220,220],scale:[1.25,1.25,1.48,1.48,.9,.9,1.05,1.05,1.15,1.15],sourceTop:[0,0,0,0,-64,-64,-73,-73,-79,-79]};
export const presenterPlacement=(t:number):Placement=>{
 const result={} as Placement;
 if(t<=26){for(const k of Object.keys(openingValues) as (keyof Placement)[])result[k]=interpolate(t,openingTimes,openingValues[k],{...clamp,easing:ease});return result;}
 let previous=poses.bottom;
 for(const s of fullScenes){const next=poses[s.pose];if(t<s.start+.55){const p=r(t,s.start-.25,s.start+.55);for(const k of Object.keys(previous) as (keyof Placement)[])result[k]=previous[k]+(next[k]-previous[k])*p;return result;}previous=next;}
 return previous;
};
const backgroundMix=(t:number)=>{
 if(t<=26)return interpolate(t,[0,7,7.7,16.6,17.35,18.95,19.7,26],[0,0,1,1,0,0,1,1],{...clamp,easing:ease});
 let previous=1;
 for(const s of fullScenes){const next=s.dark?1:0;if(t<s.start+.5)return previous+(next-previous)*r(t,s.start-.25,s.start+.5);previous=next;}
 return previous;
};

export const KoraxNewComplete:React.FC=()=>{
 const t=useCurrentFrame()/30,p=presenterPlacement(t),mix=backgroundMix(t);
 const dark=mix>.5;
 const cap=captions.find(c=>t>=c.start&&t<c.end);
 return <AbsoluteFill style={{background:'#F8FAFF',color:interpolateColors(mix,[0,1],[N,'#FFFFFF']),fontFamily:'Inter,Arial,sans-serif',overflow:'hidden'}}>
  <Audio src={staticFile('video/diego-korax-novo.mp4')}/>
  <MotionSoundEffects/>
  <BackgroundMusic/>
  <AbsoluteFill style={{background:'radial-gradient(ellipse at 60% 60%,#DCE9FF66,transparent 65%)'}}/>
  <AbsoluteFill style={{background:'radial-gradient(ellipse at 80% 0%,#12479688,transparent 65%),linear-gradient(165deg,#010B36,#020718)',opacity:mix}}/>
  <div style={{position:'absolute',left:-490,top:620,width:1100,height:1100,borderRadius:'50%',border:'1px solid #568AFF18',transform:`translate(${30*Math.sin(t*.3)}px,${20*Math.cos(t*.24)}px)`}}/>
  <div style={{position:'absolute',left:64,top:85,display:'flex',alignItems:'center',gap:15}}><Img src={KORAX_LOGO_DATA_URL} style={{width:44,height:44}}/><span style={{fontSize:27,fontWeight:700,letterSpacing:4}}>KORAX</span></div>
  {t<26.24&&<AbsoluteFill style={{opacity:r(t,25.76,26.24,1,0)}}><KoraxReferenceSample graphicsOnly/></AbsoluteFill>}
  {fullScenes.filter(s=>t>=s.start-.24&&t<s.end+.24).map(s=><AbsoluteFill key={s.start} style={{opacity:fade(t,s.start,s.end),color:s.dark?'white':N}}><Title s={s} t={t}/>{s.pose!=='portrait'&&<Visual s={s} t={t}/>}</AbsoluteFill>)}
  {/* This is the only video element. Never unmounted, faded, stretched or covered by wipes. */}
  <div data-presenter='continuous' style={{position:'absolute',left:p.x,top:p.y,width:p.w,height:p.h,borderRadius:p.radius,overflow:'hidden',border:`2px solid ${dark?'#76AAFF99':'#0057FF55'}`,boxShadow:dark?'0 20px 85px #0008':'0 25px 70px #0B368B30',background:N,zIndex:20}}>
   <OffthreadVideo muted src={staticFile('video/diego-korax-novo.mp4')} style={{position:'absolute',left:(p.w-512*p.scale)/2,top:p.sourceTop,width:512,height:910,transform:`scale(${p.scale})`,transformOrigin:'0 0'}}/>
  </div>
  {fullScenes.filter(s=>s.pose==='portrait'&&t>=s.start-.24&&t<s.end+.24).map(s=><AbsoluteFill key={s.start} style={{opacity:fade(t,s.start,s.end),color:s.dark?'white':N,zIndex:22}}><Visual s={s} t={t}/></AbsoluteFill>)}
  {t>=26&&cap&&<div style={{position:'absolute',left:55,right:55,bottom:100,textAlign:'center',zIndex:30,fontSize:49,fontWeight:700,lineHeight:1.25,textShadow:dark?'0 3px 12px #0009':'none'}}><span style={{display:'inline-block',maxWidth:935,background:dark?'#010B36E8':'#F8FAFFF2',borderRadius:16,padding:'15px 23px'}}>{cap.words.map((word,i)=><span key={i} style={{color:t>=word.start&&t<word.end?dark?'#83B5FF':B:dark?'white':N}}>{word.word.trim()}{i<cap.words.length-1?' ':''}</span>)}</span></div>}
  {t>=26&&<div style={{position:'absolute',left:65,right:65,bottom:49,height:3,background:dark?'#6F9FEB22':'#0057FF18',zIndex:30}}><div style={{height:3,background:B,width:`${100*t/287.166667}%`}}/></div>}
 </AbsoluteFill>;
};
