export function RetinaIllustration() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" role="img" aria-labelledby="retina-illustration-title">
      <title id="retina-illustration-title">
        Illustration of a retina with blood vessels spreading from the optic disc
      </title>
      <defs>
        <radialGradient id="retinaBase" cx="42%" cy="46%" r="62%">
          <stop offset="0" stopColor="#E0FBFF" />
          <stop offset="0.45" stopColor="#3FB8CF" />
          <stop offset="0.8" stopColor="#12506B" />
          <stop offset="1" stopColor="#0A2A3F" />
        </radialGradient>
        <radialGradient id="discGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.6" stopColor="#CFFAFE" />
          <stop offset="1" stopColor="#22D3EE" stopOpacity="0.6" />
        </radialGradient>
      </defs>

      <circle cx="200" cy="200" r="190" fill="url(#retinaBase)" />
      <circle cx="200" cy="200" r="168" fill="none" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="4 6" />
      <circle cx="200" cy="200" r="122" fill="none" stroke="#FFFFFF" strokeOpacity="0.18" strokeWidth="1" />
      <circle cx="200" cy="200" r="76" fill="none" stroke="#FFFFFF" strokeOpacity="0.12" strokeWidth="1" />

      <g fill="none" strokeLinecap="round" stroke="#0A2A3F" strokeOpacity="0.75">
        <path d="M130 196 C 165 150 185 118 228 84" strokeWidth="6" />
        <path d="M130 196 C 168 180 196 168 240 160" strokeWidth="4.5" />
        <path d="M130 196 C 160 222 186 248 220 290" strokeWidth="5" />
        <path d="M130 196 C 104 170 84 150 62 124" strokeWidth="3.5" />
        <path d="M130 196 C 110 232 96 262 92 304" strokeWidth="3" />
        <path d="M168 180 C 180 150 196 132 212 118" strokeWidth="2" />
        <path d="M168 180 C 186 196 200 210 232 214" strokeWidth="2" />
        <path d="M160 222 C 182 232 204 240 236 262" strokeWidth="2" />
        <path d="M228 84 C 244 98 258 110 282 116" strokeWidth="2.5" />
        <path d="M240 160 C 262 146 282 142 310 150" strokeWidth="2" />
        <path d="M220 290 C 238 300 256 304 284 300" strokeWidth="2" />
      </g>

      <circle cx="130" cy="196" r="36" fill="url(#discGlow)" />
      <circle cx="130" cy="196" r="14" fill="#0A6D69" fillOpacity="0.35" />
      <circle cx="268" cy="214" r="9" fill="#07111F" fillOpacity="0.5" />
      <circle cx="268" cy="214" r="22" fill="none" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="1.5" />
    </svg>
  );
}
