import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {KORAX_LOGO_DATA_URL} from './logoData';

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const BLUE = '#0057FF';
const CYAN = '#16C7FF';
const NAVY = '#010B36';
const WHITE = '#F7FAFF';
const MUTED = '#94A7C7';

const reveal = (frame: number, start: number, duration = 18) =>
  interpolate(frame, [start, start + duration], [0, 1], clamp);

const sceneOpacity = (
  frame: number,
  start: number,
  end: number,
  fade = 12,
) =>
  interpolate(
    frame,
    [start, start + fade, end - fade, end],
    [0, 1, 1, 0],
    clamp,
  );

const GlowOrb: React.FC<{
  size: number;
  left: number;
  top: number;
  opacity: number;
  drift: number;
}> = ({size, left, top, opacity, drift}) => {
  const frame = useCurrentFrame();
  const x = Math.sin(frame / 38 + drift) * 36;
  const y = Math.cos(frame / 46 + drift) * 34;
  return (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        left: left + x,
        top: top + y,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(0,87,255,${opacity}) 0%, rgba(0,87,255,0) 72%)`,
        filter: 'blur(8px)',
      }}
    />
  );
};

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const scanY = (frame * 5) % 2100 - 100;
  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        background:
          'radial-gradient(circle at 70% 20%, #072661 0%, #010B36 35%, #020713 70%, #010309 100%)',
      }}
    >
      <GlowOrb size={900} left={420} top={-300} opacity={0.28} drift={0.2} />
      <GlowOrb size={760} left={-280} top={1030} opacity={0.2} drift={2.1} />
      <GlowOrb size={680} left={550} top={1120} opacity={0.16} drift={4.4} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.16,
          backgroundImage:
            'linear-gradient(rgba(66,132,255,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(66,132,255,.13) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          transform: `perspective(900px) rotateX(62deg) scale(1.55) translateY(${120 + frame * 0.7}px)`,
          transformOrigin: '50% 100%',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: scanY,
          height: 3,
          background:
            'linear-gradient(90deg, transparent, rgba(22,199,255,.9), transparent)',
          boxShadow: '0 0 28px rgba(22,199,255,.8)',
          opacity: 0.42,
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,0,0,.12), transparent 30%, rgba(0,0,0,.38) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

const Notification: React.FC<{
  delay: number;
  x: number;
  y: number;
  width: number;
  text: string;
  sub: string;
  side?: 'left' | 'right';
}> = ({delay, x, y, width, text, sub, side = 'left'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({
    fps,
    frame: frame - delay,
    config: {damping: 13, stiffness: 130, mass: 0.8},
  });
  const exit = interpolate(frame, [82, 102], [1, 0], clamp);
  const slide = interpolate(p, [0, 1], [side === 'left' ? -180 : 180, 0]);
  const rotate = interpolate(p, [0, 1], [side === 'left' ? -5 : 5, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        opacity: p * exit,
        transform: `translateX(${slide}px) scale(${0.9 + p * 0.1}) rotate(${rotate}deg)`,
        border: '1px solid rgba(72,159,255,.42)',
        borderRadius: 28,
        padding: '22px 24px',
        background:
          'linear-gradient(135deg, rgba(9,28,68,.96), rgba(4,13,35,.91))',
        boxShadow:
          '0 24px 70px rgba(0,0,0,.4), inset 0 0 35px rgba(0,87,255,.08)',
        backdropFilter: 'blur(18px)',
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 17,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(145deg, #23D366, #0EA847)',
            color: 'white',
            fontSize: 26,
            fontWeight: 900,
            boxShadow: '0 0 24px rgba(35,211,102,.32)',
          }}
        >
          ●
        </div>
        <div style={{flex: 1}}>
          <div
            style={{
              color: WHITE,
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: -0.5,
            }}
          >
            {text}
          </div>
          <div style={{color: MUTED, marginTop: 6, fontSize: 20}}>{sub}</div>
        </div>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            background: '#0C5EFF',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: 18,
          }}
        >
          1
        </div>
      </div>
    </div>
  );
};

const LogoBadge: React.FC<{size?: number}> = ({size = 220}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      overflow: 'hidden',
      boxShadow:
        '0 0 0 1px rgba(80,163,255,.3), 0 0 55px rgba(0,87,255,.42), 0 28px 80px rgba(0,0,0,.5)',
    }}
  >
    <Img
      src={KORAX_LOGO_DATA_URL}
      style={{width: '100%', height: '100%', objectFit: 'cover'}}
    />
  </div>
);

const FeatureCard: React.FC<{
  delay: number;
  x: number;
  y: number;
  title: string;
  caption: string;
  code: string;
}> = ({delay, x, y, title, caption, code}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({fps, frame: frame - delay, config: {damping: 15, stiffness: 120}});
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 450,
        height: 162,
        padding: '28px 30px',
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        borderRadius: 30,
        border: '1px solid rgba(74,151,255,.35)',
        background:
          'linear-gradient(135deg, rgba(10,34,82,.9), rgba(3,13,34,.93))',
        boxShadow: '0 24px 65px rgba(0,0,0,.32)',
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [50, 0])}px) scale(${0.94 + p * 0.06})`,
      }}
    >
      <div
        style={{
          width: 92,
          height: 92,
          borderRadius: 27,
          background: 'linear-gradient(145deg, #0C59FF, #12C6FF)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: WHITE,
          fontWeight: 900,
          fontSize: code.length > 2 ? 25 : 38,
          boxShadow: '0 0 34px rgba(0,113,255,.36)',
        }}
      >
        {code}
      </div>
      <div>
        <div style={{color: WHITE, fontSize: 31, fontWeight: 900}}>{title}</div>
        <div style={{color: MUTED, fontSize: 21, marginTop: 7, lineHeight: 1.25}}>
          {caption}
        </div>
      </div>
    </div>
  );
};

const SceneOne: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, 0, 108, 10);
  const titleIn = reveal(frame, 15, 20);
  const titleY = interpolate(titleIn, [0, 1], [60, 0]);
  const pulse = 1 + Math.sin(frame / 7) * 0.012;

  return (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      <Notification delay={1} x={64} y={220} width={660} text="Oi, vocês atendem hoje?" sub="Novo cliente • agora" />
      <Notification delay={10} x={344} y={410} width={670} text="Quero saber o valor" sub="Novo cliente • agora" side="right" />
      <Notification delay={20} x={82} y={620} width={700} text="Tem horário amanhã?" sub="Novo cliente • agora" />
      <Notification delay={32} x={306} y={825} width={700} text="Posso agendar uma avaliação?" sub="Novo cliente • agora" side="right" />
      <Notification delay={44} x={78} y={1030} width={650} text="Vocês atendem sábado?" sub="Novo cliente • agora" />

      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 70,
          bottom: 205,
          opacity: titleIn,
          transform: `translateY(${titleY}px) scale(${pulse})`,
        }}
      >
        <div
          style={{
            color: '#6AA8FF',
            fontSize: 28,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: 6,
            marginBottom: 18,
          }}
        >
          TODO DIA É ASSIM?
        </div>
        <div
          style={{
            color: WHITE,
            fontSize: 84,
            fontWeight: 950,
            lineHeight: 0.98,
            letterSpacing: -4.2,
          }}
        >
          SEU WHATSAPP
          <br />
          <span
            style={{
              background: 'linear-gradient(90deg, #19CBFF, #0861FF)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            NÃO PARA?
          </span>
        </div>
      </div>
    </div>
  );
};

const SceneTwo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = sceneOpacity(frame, 92, 205, 14);
  const logoSpring = spring({
    fps,
    frame: frame - 105,
    config: {damping: 12, stiffness: 95, mass: 0.85},
  });
  const ring = interpolate(frame, [105, 190], [0.68, 1.5], clamp);
  const ringOpacity = interpolate(frame, [105, 135, 190], [0, 0.7, 0], clamp);
  const copyIn = reveal(frame, 126, 22);

  return (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 380,
          width: 420,
          height: 420,
          marginLeft: -210,
          borderRadius: '50%',
          border: '2px solid rgba(22,199,255,.7)',
          opacity: ringOpacity,
          transform: `scale(${ring})`,
          boxShadow: '0 0 90px rgba(0,87,255,.2)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 445,
          transform: `translateX(-50%) scale(${0.68 + logoSpring * 0.32}) rotate(${interpolate(
            logoSpring,
            [0, 1],
            [-8, 0],
          )}deg)`,
          opacity: logoSpring,
        }}
      >
        <LogoBadge size={300} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 70,
          top: 880,
          textAlign: 'center',
          opacity: copyIn,
          transform: `translateY(${interpolate(copyIn, [0, 1], [42, 0])}px)`,
        }}
      >
        <div
          style={{
            color: CYAN,
            fontSize: 29,
            letterSpacing: 7,
            fontWeight: 850,
            textTransform: 'uppercase',
          }}
        >
          CHEGOU A KORAX
        </div>
        <div
          style={{
            color: WHITE,
            fontSize: 82,
            lineHeight: 1.02,
            fontWeight: 950,
            letterSpacing: -4.2,
            marginTop: 22,
          }}
        >
          DEIXE A IA
          <br />
          <span style={{color: '#4196FF'}}>FAZER O PRIMEIRO ATENDIMENTO.</span>
        </div>
        <div
          style={{
            color: MUTED,
            fontSize: 28,
            lineHeight: 1.35,
            marginTop: 30,
            maxWidth: 820,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Responde, entende a necessidade e conduz cada conversa até o próximo passo.
        </div>
      </div>
    </div>
  );
};

const SceneThree: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, 184, 318, 12);
  const phoneIn = reveal(frame, 196, 24);
  const reply1 = reveal(frame, 220, 12);
  const reply2 = reveal(frame, 245, 12);
  const reply3 = reveal(frame, 270, 12);

  return (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      <div
        style={{
          position: 'absolute',
          left: 64,
          top: 165,
          color: WHITE,
        }}
      >
        <div style={{color: CYAN, fontSize: 27, fontWeight: 900, letterSpacing: 6}}>
          80% DO CAMINHO
        </div>
        <div
          style={{
            fontSize: 78,
            fontWeight: 950,
            lineHeight: 1,
            letterSpacing: -3.7,
            marginTop: 16,
          }}
        >
          ELA ATENDE.
          <br />
          ELA QUALIFICA.
          <br />
          <span style={{color: '#3D94FF'}}>ELA AGENDA.</span>
        </div>
      </div>

      <FeatureCard delay={205} x={55} y={620} code="24H" title="ATENDE" caption="Responde mesmo fora do horário." />
      <FeatureCard delay={222} x={55} y={805} code="✓" title="QUALIFICA" caption="Entende interesse e prioridade." />
      <FeatureCard delay={239} x={55} y={990} code="CAL" title="AGENDA" caption="Conduz até a confirmação." />

      <div
        style={{
          position: 'absolute',
          right: 46,
          top: 610,
          width: 500,
          height: 880,
          borderRadius: 62,
          border: '2px solid rgba(83,158,255,.45)',
          background:
            'linear-gradient(180deg, rgba(5,19,52,.96), rgba(2,8,23,.98))',
          boxShadow:
            '0 40px 120px rgba(0,0,0,.48), 0 0 80px rgba(0,87,255,.16)',
          padding: 28,
          opacity: phoneIn,
          transform: `translateX(${interpolate(phoneIn, [0, 1], [90, 0])}px) rotate(${interpolate(
            phoneIn,
            [0, 1],
            [4, 0],
          )}deg)`,
        }}
      >
        <div
          style={{
            height: 76,
            borderBottom: '1px solid rgba(91,158,255,.18)',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <LogoBadge size={54} />
          <div>
            <div style={{color: WHITE, fontSize: 24, fontWeight: 900}}>Korax IA</div>
            <div style={{color: '#4DFF9A', fontSize: 16, marginTop: 2}}>● online agora</div>
          </div>
        </div>

        <div style={{marginTop: 28}}>
          <div
            style={{
              marginLeft: 70,
              borderRadius: '24px 24px 6px 24px',
              padding: '20px 22px',
              color: WHITE,
              fontSize: 22,
              lineHeight: 1.3,
              background: 'rgba(35,211,102,.16)',
              border: '1px solid rgba(35,211,102,.2)',
            }}
          >
            Oi! Queria marcar uma avaliação amanhã.
          </div>

          <div
            style={{
              marginTop: 22,
              marginRight: 45,
              borderRadius: '24px 24px 24px 6px',
              padding: '20px 22px',
              color: WHITE,
              fontSize: 22,
              lineHeight: 1.3,
              background: 'rgba(0,87,255,.2)',
              border: '1px solid rgba(80,155,255,.3)',
              opacity: reply1,
              transform: `translateY(${interpolate(reply1, [0, 1], [22, 0])}px)`,
            }}
          >
            Claro. Para eu te direcionar certinho: qual serviço você procura?
          </div>

          <div
            style={{
              marginTop: 22,
              marginLeft: 126,
              borderRadius: '24px 24px 6px 24px',
              padding: '18px 22px',
              color: WHITE,
              fontSize: 22,
              background: 'rgba(35,211,102,.16)',
              border: '1px solid rgba(35,211,102,.2)',
              opacity: reply2,
            }}
          >
            Avaliação inicial.
          </div>

          <div
            style={{
              marginTop: 22,
              marginRight: 30,
              borderRadius: '24px 24px 24px 6px',
              padding: '20px 22px',
              color: WHITE,
              fontSize: 22,
              lineHeight: 1.3,
              background: 'rgba(0,87,255,.22)',
              border: '1px solid rgba(80,155,255,.32)',
              opacity: reply3,
              transform: `translateY(${interpolate(reply3, [0, 1], [18, 0])}px)`,
            }}
          >
            Perfeito. Tenho 14h ou 16h. Qual horário fica melhor para você?
          </div>
        </div>
      </div>
    </div>
  );
};

const SceneFour: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = sceneOpacity(frame, 298, 392, 11);
  const card = spring({fps, frame: frame - 310, config: {damping: 13, stiffness: 105}});
  const check = spring({fps, frame: frame - 336, config: {damping: 11, stiffness: 150}});

  return (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      <div
        style={{
          position: 'absolute',
          left: 72,
          right: 72,
          top: 235,
          textAlign: 'center',
        }}
      >
        <div style={{color: CYAN, fontSize: 28, fontWeight: 900, letterSpacing: 6}}>
          PRÓXIMO PASSO
        </div>
        <div
          style={{
            color: WHITE,
            fontSize: 82,
            lineHeight: 1.02,
            fontWeight: 950,
            letterSpacing: -4,
            marginTop: 20,
          }}
        >
          O CLIENTE JÁ CHEGA
          <br />
          <span style={{color: '#4196FF'}}>COM O CAMINHO ANDADO.</span>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 95,
          right: 95,
          top: 720,
          height: 610,
          borderRadius: 48,
          padding: 50,
          background:
            'linear-gradient(145deg, rgba(11,38,92,.96), rgba(3,12,32,.98))',
          border: '1px solid rgba(86,163,255,.45)',
          boxShadow:
            '0 45px 120px rgba(0,0,0,.42), inset 0 0 70px rgba(0,87,255,.07)',
          opacity: card,
          transform: `translateY(${interpolate(card, [0, 1], [80, 0])}px) scale(${0.92 + card * 0.08})`,
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <div style={{color: MUTED, fontSize: 23, letterSpacing: 3, fontWeight: 800}}>
              AGENDAMENTO
            </div>
            <div style={{color: WHITE, fontSize: 46, fontWeight: 950, marginTop: 10}}>
              Avaliação inicial
            </div>
          </div>
          <div
            style={{
              width: 112,
              height: 112,
              borderRadius: 56,
              background: 'linear-gradient(145deg, #15C971, #0B8D4B)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 58,
              fontWeight: 900,
              transform: `scale(${check}) rotate(${interpolate(check, [0, 1], [-20, 0])}deg)`,
              boxShadow: '0 0 52px rgba(21,201,113,.3)',
            }}
          >
            ✓
          </div>
        </div>

        <div
          style={{
            marginTop: 46,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 20,
          }}
        >
          {[
            ['DATA', '25 SET'],
            ['HORÁRIO', '14:00'],
            ['STATUS', 'CONFIRMADO'],
            ['ORIGEM', 'KORAX IA'],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                borderRadius: 26,
                padding: '24px 26px',
                background: 'rgba(255,255,255,.035)',
                border: '1px solid rgba(111,170,255,.14)',
              }}
            >
              <div style={{color: MUTED, fontSize: 18, fontWeight: 800, letterSpacing: 2.5}}>
                {label}
              </div>
              <div style={{color: WHITE, fontSize: 30, fontWeight: 900, marginTop: 8}}>
                {value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 36,
            paddingTop: 30,
            borderTop: '1px solid rgba(91,158,255,.18)',
            color: '#63A8FF',
            fontSize: 25,
            fontWeight: 850,
            textAlign: 'center',
          }}
        >
          ✓ Cliente qualificado · ✓ Horário definido · ✓ Confirmação enviada
        </div>
      </div>
    </div>
  );
};

const SceneFive: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = interpolate(frame, [370, 390, 450], [0, 1, 1], clamp);
  const logo = spring({fps, frame: frame - 382, config: {damping: 12, stiffness: 115}});
  const copy = reveal(frame, 398, 20);
  const cta = spring({fps, frame: frame - 416, config: {damping: 14, stiffness: 125}});
  const glow = 0.72 + Math.sin(frame / 5) * 0.22;

  return (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 240,
          transform: `translateX(-50%) scale(${0.7 + logo * 0.3})`,
          opacity: logo,
        }}
      >
        <LogoBadge size={270} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 65,
          right: 65,
          top: 600,
          textAlign: 'center',
          opacity: copy,
          transform: `translateY(${interpolate(copy, [0, 1], [45, 0])}px)`,
        }}
      >
        <div
          style={{
            color: WHITE,
            fontSize: 92,
            lineHeight: 0.98,
            fontWeight: 950,
            letterSpacing: -5,
          }}
        >
          MAIS RESPOSTAS.
          <br />
          MAIS AGENDAMENTOS.
          <br />
          <span
            style={{
              background: 'linear-gradient(90deg, #1DCBFF, #0A63FF)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            MAIS VENDAS.
          </span>
        </div>
        <div style={{color: MUTED, fontSize: 30, marginTop: 34, lineHeight: 1.4}}>
          Tenha um agente de IA atendendo e agendando por você.
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 80,
          right: 80,
          bottom: 260,
          height: 170,
          borderRadius: 42,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(90deg, #0758FF, #0FA9FF)',
          color: WHITE,
          fontSize: 41,
          fontWeight: 950,
          letterSpacing: -1,
          opacity: cta,
          transform: `scale(${0.88 + cta * 0.12})`,
          boxShadow: `0 0 ${48 + glow * 40}px rgba(0,123,255,${0.3 + glow * 0.18}), 0 36px 90px rgba(0,0,0,.4)`,
        }}
      >
        CLIQUE E FALE COM O AGENTE →
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 155,
          textAlign: 'center',
          color: '#6F87B0',
          fontSize: 21,
          fontWeight: 700,
          letterSpacing: 4,
        }}
      >
        KORAX · OPERAÇÃO COMERCIAL INTELIGENTE
      </div>
    </div>
  );
};

export const KoraxAd: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        fontFamily: 'Arial, Helvetica, sans-serif',
        color: WHITE,
        backgroundColor: NAVY,
      }}
    >
      <Background />
      <SceneOne />
      <SceneTwo />
      <SceneThree />
      <SceneFour />
      <SceneFive />
    </AbsoluteFill>
  );
};
