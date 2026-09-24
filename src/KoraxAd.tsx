import React from 'react';
import {
  AbsoluteFill,
  Img,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {KORAX_LOGO_DATA_URL} from './logoData';

const C = {
  bg: '#020717',
  navy: '#04113a',
  blue: '#075cff',
  cyan: '#12b8ff',
  white: '#f7fbff',
  muted: '#91a6d6',
  red: '#ff4d67',
  green: '#25d366',
  card: '#071433',
};

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const local = (frame: number, start: number, end: number) => clamp((frame - start) / (end - start));
const ease = (v: number) => Easing.bezier(0.18, 0.88, 0.28, 1)(clamp(v));

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const x = 50 + Math.sin(frame / 70) * 18;
  const y = 28 + Math.cos(frame / 90) * 12;
  return (
    <AbsoluteFill
      style={{
        background:
          `radial-gradient(circle at ${x}% ${y}%, rgba(0,95,255,.34), transparent 34%), ` +
          `radial-gradient(circle at 85% 78%, rgba(0,184,255,.16), transparent 28%), ` +
          `linear-gradient(180deg, #020717 0%, #02091e 44%, #01040d 100%)`,
        overflow: 'hidden',
      }}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const top = 140 + i * 360 + ((frame * (0.7 + i * 0.08)) % 360);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: -180,
              top: top - 360,
              width: 1450,
              height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(50,123,255,.22), transparent)',
              transform: 'rotate(-12deg)',
            }}
          />
        );
      })}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.12,
          backgroundImage:
            'linear-gradient(rgba(80,130,255,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(80,130,255,.25) 1px, transparent 1px)',
          backgroundSize: '76px 76px',
          transform: `translateY(${(frame * 0.35) % 76}px)`,
          maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
        }}
      />
    </AbsoluteFill>
  );
};

const Kicker: React.FC<{children: React.ReactNode; accent?: string}> = ({children, accent = C.cyan}) => (
  <div
    style={{
      color: accent,
      fontSize: 24,
      fontWeight: 800,
      letterSpacing: 5,
      textTransform: 'uppercase',
      marginBottom: 20,
    }}
  >
    {children}
  </div>
);

const ChatBubble: React.FC<{
  text: string;
  top: number;
  side: 'left' | 'right';
  delay: number;
  bad?: boolean;
}> = ({text, top, side, delay, bad}) => {
  const frame = useCurrentFrame();
  const p = ease(local(frame, delay, delay + 14));
  const x = (1 - p) * (side === 'left' ? -460 : 460);
  const rotate = (1 - p) * (side === 'left' ? -4 : 4);
  return (
    <div
      style={{
        position: 'absolute',
        top,
        [side]: 54,
        width: 690,
        padding: '24px 28px',
        borderRadius: 22,
        background: bad ? 'rgba(255,77,103,.10)' : 'rgba(7,20,51,.95)',
        border: `1px solid ${bad ? 'rgba(255,77,103,.38)' : 'rgba(70,130,255,.28)'}`,
        boxShadow: '0 20px 50px rgba(0,0,0,.28)',
        transform: `translateX(${x}px) rotate(${rotate}deg) scale(${0.86 + p * 0.14})`,
        opacity: p,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 13,
          background: bad ? C.red : C.green,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 900,
          color: 'white',
          flex: '0 0 auto',
        }}
      >
        {bad ? '!' : '•'}
      </div>
      <div style={{color: C.white, fontSize: 31, fontWeight: 700, lineHeight: 1.15}}>{text}</div>
    </div>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const p = ease(local(frame, 0, 18));
  const p2 = ease(local(frame, 66, 92));
  return (
    <AbsoluteFill style={{fontFamily: 'Inter, Arial, sans-serif'}}>
      <ChatBubble text="Qual o valor?" top={180} side="left" delay={3} />
      <ChatBubble text="Tem horário hoje?" top={318} side="right" delay={15} />
      <ChatBubble text="Quero agendar" top={456} side="left" delay={27} />
      <ChatBubble text="Vocês atendem sábado?" top={594} side="right" delay={39} />
      <div
        style={{
          position: 'absolute',
          left: 58,
          right: 58,
          bottom: 170,
          transform: `translateY(${(1 - p) * 120}px) scale(${0.9 + p * 0.1})`,
          opacity: p,
        }}
      >
        <Kicker>Se você já tentou IA no WhatsApp</Kicker>
        <div style={{color: C.white, fontSize: 92, fontWeight: 950, lineHeight: 0.92, letterSpacing: -4}}>
          E SE
          <br />
          <span style={{color: C.red}}>ARREPENDEU?</span>
        </div>
        <div
          style={{
            marginTop: 30,
            color: C.muted,
            fontSize: 31,
            lineHeight: 1.25,
            maxWidth: 820,
            opacity: p2,
            transform: `translateX(${(1 - p2) * 60}px)`,
          }}
        >
          Talvez o problema nunca tenha sido usar IA.
        </div>
      </div>
    </AbsoluteFill>
  );
};

const PainCard: React.FC<{title: string; subtitle: string; y: number; delay: number; index: number}> = ({
  title,
  subtitle,
  y,
  delay,
  index,
}) => {
  const frame = useCurrentFrame();
  const p = ease(local(frame, delay, delay + 14));
  const flash = interpolate(Math.sin((frame - delay) / 5), [-1, 1], [0.7, 1]);
  return (
    <div
      style={{
        position: 'absolute',
        left: 64,
        right: 64,
        top: y,
        height: 250,
        borderRadius: 30,
        padding: 30,
        background: 'linear-gradient(135deg, rgba(255,77,103,.12), rgba(7,20,51,.92))',
        border: '1px solid rgba(255,77,103,.34)',
        transform: `translateX(${(1 - p) * (index % 2 === 0 ? -520 : 520)}px) scale(${0.9 + p * 0.1})`,
        opacity: p,
        display: 'flex',
        alignItems: 'center',
        gap: 28,
      }}
    >
      <div
        style={{
          width: 94,
          height: 94,
          borderRadius: 28,
          background: `rgba(255,77,103,${0.12 * flash})`,
          border: '2px solid rgba(255,77,103,.55)',
          color: C.red,
          fontSize: 46,
          fontWeight: 950,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ×
      </div>
      <div>
        <div style={{color: C.white, fontSize: 45, fontWeight: 950, letterSpacing: -1.5}}>{title}</div>
        <div style={{color: C.muted, fontSize: 28, marginTop: 9, lineHeight: 1.18}}>{subtitle}</div>
      </div>
    </div>
  );
};

const Pain: React.FC = () => {
  const frame = useCurrentFrame();
  const title = ease(local(frame, 98, 116));
  return (
    <AbsoluteFill style={{fontFamily: 'Inter, Arial, sans-serif'}}>
      <div style={{position: 'absolute', top: 115, left: 64, opacity: title, transform: `translateY(${(1-title)*40}px)`}}>
        <Kicker accent={C.red}>Foi isso que aconteceu?</Kicker>
        <div style={{color: C.white, fontWeight: 950, fontSize: 66, lineHeight: 0.98, letterSpacing: -3}}>
          A IA COMEÇAVA BEM.
          <br />
          <span style={{color: C.red}}>DEPOIS SE PERDIA.</span>
        </div>
      </div>
      <PainCard index={0} title="RESPOSTAS ENGESSADAS" subtitle="Fala bonito, mas não conduz a conversa." y={465} delay={118} />
      <PainCard index={1} title="IGNORA O PROCESSO" subtitle="Pula etapas e não respeita seu comercial." y={755} delay={144} />
      <PainCard index={2} title="PERDE O TREINAMENTO" subtitle="Depois de algumas mensagens, sai do caminho." y={1045} delay={170} />
      <div
        style={{
          position: 'absolute',
          bottom: 145,
          left: 64,
          right: 64,
          height: 8,
          borderRadius: 10,
          background: 'rgba(255,255,255,.06)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${Math.min(100, Math.max(0, ((frame - 112) / 110) * 100))}%`,
            background: `linear-gradient(90deg, ${C.red}, #ff9a7a)`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const Reframe: React.FC = () => {
  const frame = useCurrentFrame();
  const p1 = ease(local(frame, 228, 247));
  const p2 = ease(local(frame, 258, 282));
  const p3 = ease(local(frame, 286, 308));
  return (
    <AbsoluteFill style={{fontFamily: 'Inter, Arial, sans-serif', justifyContent: 'center', padding: '0 62px'}}>
      <div style={{opacity: p1, transform: `translateY(${(1-p1)*80}px)`}}>
        <Kicker>O ponto é outro</Kicker>
        <div style={{color: C.white, fontSize: 84, fontWeight: 950, lineHeight: 0.93, letterSpacing: -4}}>
          O PROBLEMA
          <br />
          <span style={{color: C.cyan}}>NÃO É A IA.</span>
        </div>
      </div>
      <div
        style={{
          marginTop: 48,
          opacity: p2,
          transform: `translateX(${(1-p2)*100}px)`,
          color: C.muted,
          fontSize: 37,
          fontWeight: 700,
          lineHeight: 1.18,
        }}
      >
        É usar uma IA que não entende
        <br />
        <span style={{color: C.white, fontSize: 49}}>como a sua operação vende.</span>
      </div>
      <div
        style={{
          marginTop: 42,
          height: 84,
          borderRadius: 20,
          background: `linear-gradient(90deg, rgba(7,92,255,.14), rgba(18,184,255,.14))`,
          border: '1px solid rgba(18,184,255,.28)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 28px',
          color: C.cyan,
          fontSize: 30,
          fontWeight: 900,
          letterSpacing: 1,
          opacity: p3,
          transform: `scaleX(${0.7 + p3 * 0.3})`,
          transformOrigin: 'left center',
        }}
      >
        IA PRECISA ENTENDER PROCESSO + CONTEXTO + MOMENTO
      </div>
    </AbsoluteFill>
  );
};

const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - 316, fps, config: {damping: 12, stiffness: 110, mass: 0.8}});
  const p = ease(local(frame, 330, 356));
  return (
    <AbsoluteFill style={{fontFamily: 'Inter, Arial, sans-serif', alignItems: 'center', justifyContent: 'center'}}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: 360 + i * 180,
            height: 360 + i * 180,
            borderRadius: '50%',
            border: '1px solid rgba(18,184,255,.16)',
            transform: `scale(${0.86 + s * 0.14}) rotate(${frame * (0.1 + i * 0.04)}deg)`,
          }}
        />
      ))}
      <div style={{transform: `scale(${0.35 + s * 0.65})`, opacity: clamp(s), filter: 'drop-shadow(0 0 55px rgba(0,110,255,.7))'}}>
        <Img src={KORAX_LOGO_DATA_URL} style={{width: 340, height: 340}} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1210,
          textAlign: 'center',
          opacity: p,
          transform: `translateY(${(1-p)*45}px)`,
        }}
      >
        <Kicker>Conheça a</Kicker>
        <div style={{fontSize: 92, color: C.white, fontWeight: 950, letterSpacing: 8}}>KORAX</div>
        <div style={{fontSize: 30, color: C.muted, marginTop: 10}}>IA que respeita o seu processo comercial.</div>
      </div>
    </AbsoluteFill>
  );
};

const FlowNode: React.FC<{label: string; sub: string; y: number; index: number; active: number}> = ({label, sub, y, index, active}) => {
  const on = active >= index;
  const current = active === index;
  return (
    <div
      style={{
        position: 'absolute',
        left: 100,
        right: 100,
        top: y,
        height: 160,
        borderRadius: 30,
        background: current
          ? 'linear-gradient(120deg, rgba(7,92,255,.34), rgba(18,184,255,.14))'
          : 'rgba(7,20,51,.78)',
        border: `1px solid ${on ? 'rgba(18,184,255,.48)' : 'rgba(100,130,190,.16)'}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 28px',
        gap: 22,
        transform: `scale(${current ? 1.035 : 1})`,
        boxShadow: current ? '0 0 42px rgba(0,95,255,.22)' : 'none',
      }}
    >
      <div
        style={{
          width: 70,
          height: 70,
          borderRadius: 22,
          background: on ? C.blue : 'rgba(255,255,255,.06)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 950,
          fontSize: 26,
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </div>
      <div>
        <div style={{color: C.white, fontSize: 36, fontWeight: 950}}>{label}</div>
        <div style={{color: C.muted, fontSize: 24, marginTop: 5}}>{sub}</div>
      </div>
      <div style={{marginLeft: 'auto', color: on ? C.cyan : 'rgba(255,255,255,.2)', fontSize: 34, fontWeight: 900}}>
        {on ? '✓' : '—'}
      </div>
    </div>
  );
};

const Flow: React.FC = () => {
  const frame = useCurrentFrame();
  const p = ease(local(frame, 390, 410));
  const active = Math.max(0, Math.min(4, Math.floor((frame - 420) / 38)));
  const lineProgress = clamp((frame - 420) / 190);
  return (
    <AbsoluteFill style={{fontFamily: 'Inter, Arial, sans-serif'}}>
      <div style={{position: 'absolute', top: 84, left: 72, right: 72, opacity: p, transform: `translateY(${(1-p)*34}px)`}}>
        <Kicker>O que muda na prática</Kicker>
        <div style={{color: C.white, fontSize: 63, fontWeight: 950, lineHeight: 0.98, letterSpacing: -2.5}}>
          ELA NÃO SÓ RESPONDE.
          <br />
          <span style={{color: C.cyan}}>ELA SEGUE O CAMINHO.</span>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 132,
          top: 520,
          width: 5,
          height: 760,
          background: 'rgba(255,255,255,.06)',
          borderRadius: 10,
        }}
      >
        <div
          style={{
            width: '100%',
            height: `${lineProgress * 100}%`,
            background: `linear-gradient(180deg, ${C.cyan}, ${C.blue})`,
            borderRadius: 10,
            boxShadow: '0 0 20px rgba(18,184,255,.5)',
          }}
        />
      </div>
      <FlowNode label="MANTÉM O CONTEXTO" sub="Entende o que já foi dito." y={460} index={0} active={active} />
      <FlowNode label="SEGUE O PROCESSO" sub="Não pula etapas do seu comercial." y={650} index={1} active={active} />
      <FlowNode label="QUALIFICA" sub="Identifica intenção e oportunidade." y={840} index={2} active={active} />
      <FlowNode label="AGENDA" sub="Conduz para o próximo passo." y={1030} index={3} active={active} />
      <FlowNode label="CHAMA O HUMANO" sub="Só quando realmente precisa." y={1220} index={4} active={active} />
      <div
        style={{
          position: 'absolute',
          bottom: 110,
          left: 100,
          right: 100,
          padding: '24px 28px',
          borderRadius: 24,
          background: 'rgba(37,211,102,.08)',
          border: '1px solid rgba(37,211,102,.26)',
          color: '#bfffd5',
          fontSize: 28,
          fontWeight: 800,
          textAlign: 'center',
          opacity: ease(local(frame, 585, 610)),
        }}
      >
        A IA continua o processo. Sua equipe entra só na hora certa.
      </div>
    </AbsoluteFill>
  );
};

const Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p1 = ease(local(frame, 620, 645));
  const p2 = ease(local(frame, 665, 695));
  const logo = spring({frame: frame - 720, fps, config: {damping: 13, stiffness: 125}});
  const cta = ease(local(frame, 742, 772));
  return (
    <AbsoluteFill style={{fontFamily: 'Inter, Arial, sans-serif', padding: '0 64px', justifyContent: 'center'}}>
      <div style={{opacity: p1, transform: `translateY(${(1-p1)*70}px)`}}>
        <Kicker>Seu atendimento pode ser automático</Kicker>
        <div style={{color: C.white, fontSize: 73, lineHeight: 0.94, fontWeight: 950, letterSpacing: -3.5}}>
          SEM PERDER
          <br />
          <span style={{color: C.cyan}}>O CONTROLE</span>
          <br />
          COMERCIAL.
        </div>
      </div>
      <div
        style={{
          marginTop: 50,
          opacity: p2,
          transform: `translateX(${(1-p2)*80}px)`,
          color: C.muted,
          fontSize: 34,
          lineHeight: 1.2,
          fontWeight: 650,
        }}
      >
        IA no WhatsApp que trabalha do seu jeito,
        <br />
        e não obriga sua empresa a trabalhar do jeito dela.
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 155,
          left: 64,
          right: 64,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          opacity: clamp(logo),
          transform: `translateY(${(1-clamp(logo))*70}px)`,
        }}
      >
        <Img src={KORAX_LOGO_DATA_URL} style={{width: 122, height: 122, filter: 'drop-shadow(0 0 22px rgba(0,100,255,.6))'}} />
        <div style={{flex: 1}}>
          <div style={{color: C.white, fontSize: 54, fontWeight: 950, letterSpacing: 4}}>KORAX</div>
          <div style={{color: C.muted, fontSize: 23, marginTop: 2}}>OPERAÇÃO COMERCIAL INTELIGENTE</div>
        </div>
        <div
          style={{
            width: 240,
            height: 76,
            borderRadius: 20,
            background: `linear-gradient(90deg, ${C.blue}, ${C.cyan})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 26,
            fontWeight: 900,
            opacity: cta,
            transform: `scale(${0.85 + cta * 0.15})`,
            boxShadow: '0 0 35px rgba(7,92,255,.35)',
          }}
        >
          CONHEÇA AGORA
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const KoraxAd: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Background />
      {frame < 105 && <Hook />}
      {frame >= 90 && frame < 230 && <Pain />}
      {frame >= 220 && frame < 318 && <Reframe />}
      {frame >= 308 && frame < 390 && <Reveal />}
      {frame >= 380 && frame < 625 && <Flow />}
      {frame >= 610 && <Closing />}
    </AbsoluteFill>
  );
};
