const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="bg" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#092966"/>
      <stop offset="70%" stop-color="#04143d"/>
      <stop offset="100%" stop-color="#02091f"/>
    </radialGradient>
    <linearGradient id="k" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#20baff"/>
      <stop offset="52%" stop-color="#0878ff"/>
      <stop offset="100%" stop-color="#1e42ff"/>
    </linearGradient>
    <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="10" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <circle cx="256" cy="256" r="252" fill="url(#bg)"/>
  <g fill="url(#k)" filter="url(#glow)">
    <rect x="157" y="129" width="66" height="254" rx="15"/>
    <path d="M215 258 L310 137 Q318 128 331 128 H370 Q384 128 376 140 L276 263 Q269 271 277 280 L378 373 Q386 384 370 384 H326 Q315 384 307 376 L215 290 Q199 275 215 258Z"/>
  </g>
</svg>`;

export const KORAX_LOGO_DATA_URL =
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
