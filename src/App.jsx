import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ═══════════════════════════════════════════════════════════
// SHARPMIND — OCEAN JOURNEY
// Cognitive training as a descent through the sea.
// Complete daily dives to unlock new zones and collect creatures.
// ═══════════════════════════════════════════════════════════

const C = {
  // Ocean depths
  abyss: "#040814", deepNavy: "#0a1a30", midnight: "#0e2540",
  ocean: "#1a4a7a", surface: "#2e7ab0", shallow: "#7ec8e3",
  foam: "#e8f4f8", sand: "#e8d5a8", pearl: "#f5f0e6",
  // Accents
  coral: "#ff7a6a", gold: "#f4c763", aqua: "#5ed3d3",
  seagrass: "#4a9b6b", bioGlow: "#a8e6cf", anemone: "#d97aa8",
  slate: "#6b7a8f",
  // Status
  success: "#5ed3a3", warning: "#f4c763", error: "#ff7676",
  // BG
  bg: "#eaf3f7", cardBg: "#ffffff", cardDark: "rgba(20,40,70,0.55)",
};

const font = (size, weight = 400) => ({ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: size, fontWeight: weight, lineHeight: 1.4 });
const mono = (size, weight = 700) => ({ fontFamily: "'DM Mono', 'SF Mono', monospace", fontSize: size, fontWeight: weight });
const displayFont = (size) => ({ fontFamily: "'Outfit', 'DM Sans', system-ui, sans-serif", fontSize: size, fontWeight: 700, lineHeight: 1.1 });

const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
  return null;
};

// ═══════════════════════════════════════════════════════════
// CUTE KAWAII SEA CREATURES
// Style: big sparkly eyes, blush cheeks, soft rounded shapes,
// thick warm-brown outlines, tiny smiles.
// ═══════════════════════════════════════════════════════════

// Reusable kawaii face — big sparkly eye + optional blush
const KawaiiEyes = ({ cx, cy, spacing = 18, eyeSize = 7, dark = "#2a1810" }) => (
  <g>
    <ellipse cx={cx - spacing/2} cy={cy} rx={eyeSize} ry={eyeSize * 1.15} fill={dark}/>
    <ellipse cx={cx + spacing/2} cy={cy} rx={eyeSize} ry={eyeSize * 1.15} fill={dark}/>
    {/* big highlight top */}
    <circle cx={cx - spacing/2 - eyeSize*0.25} cy={cy - eyeSize*0.35} r={eyeSize * 0.42} fill="white"/>
    <circle cx={cx + spacing/2 - eyeSize*0.25} cy={cy - eyeSize*0.35} r={eyeSize * 0.42} fill="white"/>
    {/* small highlight bottom */}
    <circle cx={cx - spacing/2 + eyeSize*0.35} cy={cy + eyeSize*0.45} r={eyeSize * 0.2} fill="white"/>
    <circle cx={cx + spacing/2 + eyeSize*0.35} cy={cy + eyeSize*0.45} r={eyeSize * 0.2} fill="white"/>
  </g>
);
const Blush = ({ cx, cy, r = 5, color = "#ff9a8a" }) => (
  <g opacity="0.7">
    <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.7} fill={color}/>
  </g>
);
const Smile = ({ cx, cy, w = 6, color = "#3a2418" }) => (
  <path d={`M${cx-w} ${cy} Q${cx} ${cy+w*0.6} ${cx+w} ${cy}`} stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
);
const OUTLINE = "#3a2418";

// Goldfish — modeled on the cute kawaii reference. Round yellow body,
// small dark eyes with sparkle, blush, tiny smile, fluffy dorsal fin.
const Clownfish = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 200 160">
    <defs>
      <radialGradient id="cf-b" cx="40%" cy="35%"><stop offset="0%" stopColor="#ffe46a"/><stop offset="100%" stopColor="#f4b830"/></radialGradient>
      <radialGradient id="cf-belly" cx="50%" cy="80%"><stop offset="0%" stopColor="#ffd968"/><stop offset="100%" stopColor="#e89c2a"/></radialGradient>
    </defs>
    <ellipse cx="100" cy="148" rx="60" ry="6" fill="#000" opacity="0.12"/>
    {/* tail — fluffy fan */}
    <path d="M148 80 Q172 60 182 50 Q176 78 178 88 Q186 100 180 118 Q170 112 158 102 Q150 95 148 90 Z"
      fill="url(#cf-b)" stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round"/>
    {/* tail detail lines */}
    <path d="M158 75 Q168 80 170 100" stroke={OUTLINE} strokeWidth="1.5" fill="none" opacity="0.5"/>
    <path d="M155 92 Q165 100 168 112" stroke={OUTLINE} strokeWidth="1.5" fill="none" opacity="0.5"/>
    {/* body — round and plump */}
    <ellipse cx="92" cy="88" rx="62" ry="50" fill="url(#cf-b)" stroke={OUTLINE} strokeWidth="3"/>
    {/* belly highlight — bottom darker */}
    <path d="M40 100 Q92 130 145 100 Q140 130 92 134 Q44 130 40 100 Z" fill="url(#cf-belly)" opacity="0.6"/>
    {/* top fin — wavy crown like reference */}
    <path d="M68 42 Q78 22 92 38 Q102 26 118 38 Q124 28 130 42 Q120 44 110 42 Q98 44 88 42 Q78 44 68 42 Z"
      fill="url(#cf-b)" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round"/>
    {/* side fin */}
    <path d="M85 110 Q72 128 90 130 Q98 124 96 112 Z" fill="url(#cf-belly)" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round"/>
    {/* face — small cute eyes spaced apart */}
    <g>
      <ellipse cx="68" cy="82" rx="7" ry="8.5" fill="#2a1810"/>
      <ellipse cx="100" cy="82" rx="7" ry="8.5" fill="#2a1810"/>
      <circle cx="65" cy="78" r="3.2" fill="white"/>
      <circle cx="97" cy="78" r="3.2" fill="white"/>
      <circle cx="71" cy="86" r="1.5" fill="white"/>
      <circle cx="103" cy="86" r="1.5" fill="white"/>
    </g>
    {/* peach blush */}
    <Blush cx={62} cy={100} r={6} color="#ff8a7a"/>
    {/* tiny smile */}
    <Smile cx={85} cy={102} w={5}/>
  </svg>
);

const Seahorse = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 140 180">
    <defs>
      <radialGradient id="sh-b" cx="50%" cy="40%"><stop offset="0%" stopColor="#ffe28a"/><stop offset="100%" stopColor="#e89c2a"/></radialGradient>
    </defs>
    <ellipse cx="70" cy="172" rx="35" ry="4" fill="#000" opacity="0.12"/>
    {/* curly tail — single chunky stroke */}
    <path d="M70 125 Q40 138 50 165 Q72 175 82 158 Q70 158 65 148" fill="none" stroke={OUTLINE} strokeWidth="22" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M70 125 Q40 138 50 165 Q72 175 82 158 Q70 158 65 148" fill="none" stroke="url(#sh-b)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
    {/* body */}
    <path d="M75 38 Q102 55 92 85 Q78 110 68 125" fill="none" stroke={OUTLINE} strokeWidth="24" strokeLinecap="round"/>
    <path d="M75 38 Q102 55 92 85 Q78 110 68 125" fill="none" stroke="url(#sh-b)" strokeWidth="20" strokeLinecap="round"/>
    {/* head — round and chubby */}
    <ellipse cx="68" cy="34" rx="24" ry="20" fill="url(#sh-b)" stroke={OUTLINE} strokeWidth="3"/>
    {/* snout */}
    <path d="M48 30 Q28 30 24 38 Q38 40 52 36 Z" fill="url(#sh-b)" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round"/>
    {/* crown spikes */}
    <path d="M68 14 L72 4 L78 14 L84 6 L88 16" stroke={OUTLINE} strokeWidth="2.5" fill="#e89c2a" strokeLinejoin="round"/>
    {/* dorsal fin */}
    <path d="M95 60 Q116 55 118 80 Q105 78 92 75 Z" fill="#ffd97a" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round"/>
    {/* face */}
    <KawaiiEyes cx={70} cy={32} spacing={18} eyeSize={6}/>
    <Blush cx={50} cy={42} r={3.5}/>
    <Blush cx={86} cy={42} r={3.5}/>
    <Smile cx={64} cy={48} w={4}/>
  </svg>
);

const Pufferfish = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 180 170">
    <defs>
      <radialGradient id="pf-b" cx="40%" cy="35%"><stop offset="0%" stopColor="#ffe9a0"/><stop offset="100%" stopColor="#d8a052"/></radialGradient>
    </defs>
    <ellipse cx="90" cy="160" rx="55" ry="5" fill="#000" opacity="0.12"/>
    {/* spikes */}
    <g fill="url(#pf-b)" stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round">
      <path d="M30 60 L18 50 L35 58 Z"/><path d="M28 80 L12 78 L33 84 Z"/>
      <path d="M30 100 L14 105 L34 100 Z"/><path d="M35 120 L22 132 L40 122 Z"/>
      <path d="M55 138 L48 155 L62 138 Z"/><path d="M85 142 L85 158 L92 142 Z"/>
      <path d="M110 140 L118 156 L115 138 Z"/><path d="M132 125 L145 138 L132 118 Z"/>
      <path d="M142 105 L160 102 L142 100 Z"/><path d="M140 82 L158 78 L140 78 Z"/>
      <path d="M132 60 L148 50 L132 56 Z"/><path d="M110 42 L118 28 L108 42 Z"/>
      <path d="M85 38 L85 22 L92 38 Z"/><path d="M60 42 L48 28 L58 42 Z"/>
    </g>
    {/* body — perfectly round */}
    <circle cx="90" cy="90" r="58" fill="url(#pf-b)" stroke={OUTLINE} strokeWidth="3"/>
    {/* belly highlight */}
    <ellipse cx="90" cy="120" rx="40" ry="18" fill="#fff5d0" opacity="0.5"/>
    {/* face */}
    <KawaiiEyes cx={90} cy={82} spacing={36} eyeSize={9}/>
    <Blush cx={64} cy={102} r={6}/>
    <Blush cx={116} cy={102} r={6}/>
    {/* tiny pursed mouth */}
    <ellipse cx="90" cy="108" rx="5" ry="3.5" fill="#c4502a" stroke={OUTLINE} strokeWidth="2"/>
  </svg>
);

const SeaTurtle = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 200 160">
    <defs>
      <radialGradient id="tt-s" cx="50%" cy="35%"><stop offset="0%" stopColor="#a8d29a"/><stop offset="100%" stopColor="#5a8a4a"/></radialGradient>
      <radialGradient id="tt-k" cx="50%" cy="50%"><stop offset="0%" stopColor="#c8d8a8"/><stop offset="100%" stopColor="#7a9070"/></radialGradient>
    </defs>
    <ellipse cx="100" cy="150" rx="65" ry="5" fill="#000" opacity="0.12"/>
    {/* back flippers */}
    <ellipse cx="42" cy="115" rx="22" ry="11" fill="url(#tt-k)" stroke={OUTLINE} strokeWidth="2.5" transform="rotate(-20 42 115)"/>
    <ellipse cx="158" cy="115" rx="22" ry="11" fill="url(#tt-k)" stroke={OUTLINE} strokeWidth="2.5" transform="rotate(20 158 115)"/>
    {/* front flippers */}
    <path d="M28 75 Q8 65 5 80 Q12 95 38 90 Q48 80 28 75 Z" fill="url(#tt-k)" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="M172 75 Q192 65 195 80 Q188 95 162 90 Q152 80 172 75 Z" fill="url(#tt-k)" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round"/>
    {/* head — bigger and rounder, more kawaii */}
    <ellipse cx="100" cy="36" rx="26" ry="22" fill="url(#tt-k)" stroke={OUTLINE} strokeWidth="3"/>
    {/* shell */}
    <ellipse cx="100" cy="90" rx="62" ry="46" fill="url(#tt-s)" stroke={OUTLINE} strokeWidth="3"/>
    {/* shell pattern — simple hexagons */}
    <g stroke={OUTLINE} strokeWidth="2" fill="none" opacity="0.85" strokeLinejoin="round">
      <path d="M100 55 L82 70 L82 95 L100 108 L118 95 L118 70 Z" fill="#7da570" fillOpacity="0.5"/>
      <path d="M60 80 L52 95 L70 110 L80 95 Z" fill="#7da570" fillOpacity="0.4"/>
      <path d="M140 80 L148 95 L130 110 L120 95 Z" fill="#7da570" fillOpacity="0.4"/>
    </g>
    {/* shell highlight */}
    <ellipse cx="100" cy="62" rx="50" ry="10" fill="white" opacity="0.25"/>
    {/* face */}
    <KawaiiEyes cx={100} cy={32} spacing={20} eyeSize={6.5}/>
    <Blush cx={82} cy={44}/>
    <Blush cx={118} cy={44}/>
    <Smile cx={100} cy={48} w={5}/>
  </svg>
);

const Octopus = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <defs>
      <radialGradient id="oc-b" cx="50%" cy="35%"><stop offset="0%" stopColor="#ffb8c8"/><stop offset="100%" stopColor="#d4708c"/></radialGradient>
    </defs>
    <ellipse cx="100" cy="190" rx="70" ry="5" fill="#000" opacity="0.12"/>
    {/* tentacles — 8 wavy */}
    <g fill="url(#oc-b)" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round">
      <path d="M50 110 Q30 130 32 155 Q42 165 48 150 Q52 135 58 122 Z"/>
      <path d="M68 120 Q55 150 62 175 Q75 178 76 160 Q76 140 78 128 Z"/>
      <path d="M88 125 Q82 155 88 180 Q98 182 98 165 Q96 145 96 132 Z"/>
      <path d="M112 125 Q118 155 112 180 Q102 182 102 165 Q104 145 104 132 Z"/>
      <path d="M132 120 Q145 150 138 175 Q125 178 124 160 Q124 140 122 128 Z"/>
      <path d="M150 110 Q170 130 168 155 Q158 165 152 150 Q148 135 142 122 Z"/>
    </g>
    {/* suckers */}
    <g fill="#ffd0dc" stroke={OUTLINE} strokeWidth="1" opacity="0.7">
      <circle cx="42" cy="145" r="2"/><circle cx="55" cy="158" r="2"/>
      <circle cx="68" cy="170" r="2"/><circle cx="92" cy="170" r="2"/>
      <circle cx="108" cy="170" r="2"/><circle cx="132" cy="170" r="2"/>
      <circle cx="145" cy="158" r="2"/><circle cx="158" cy="145" r="2"/>
    </g>
    {/* head — big rounded dome */}
    <ellipse cx="100" cy="75" rx="60" ry="56" fill="url(#oc-b)" stroke={OUTLINE} strokeWidth="3"/>
    {/* head highlight */}
    <ellipse cx="80" cy="45" rx="25" ry="12" fill="white" opacity="0.35"/>
    {/* face */}
    <KawaiiEyes cx={100} cy={75} spacing={42} eyeSize={11}/>
    <Blush cx={68} cy={95}/>
    <Blush cx={132} cy={95}/>
    <Smile cx={100} cy={102} w={7}/>
  </svg>
);

const Crab = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 200 160">
    <defs>
      <radialGradient id="cr-b" cx="50%" cy="40%"><stop offset="0%" stopColor="#ff9a8a"/><stop offset="100%" stopColor="#d24020"/></radialGradient>
    </defs>
    <ellipse cx="100" cy="148" rx="70" ry="5" fill="#000" opacity="0.12"/>
    {/* legs */}
    <g fill="url(#cr-b)" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round">
      <path d="M52 95 Q30 100 18 118 Q28 125 38 118 Q48 108 55 100 Z"/>
      <path d="M48 80 Q22 78 10 90 Q15 100 28 95 Q42 90 52 85 Z"/>
      <path d="M50 65 Q25 55 18 40 Q28 35 38 45 Q48 58 55 70 Z"/>
      <path d="M148 95 Q170 100 182 118 Q172 125 162 118 Q152 108 145 100 Z"/>
      <path d="M152 80 Q178 78 190 90 Q185 100 172 95 Q158 90 148 85 Z"/>
      <path d="M150 65 Q175 55 182 40 Q172 35 162 45 Q152 58 145 70 Z"/>
    </g>
    {/* big claws */}
    <ellipse cx="20" cy="75" rx="16" ry="14" fill="url(#cr-b)" stroke={OUTLINE} strokeWidth="3" transform="rotate(-20 20 75)"/>
    <path d="M12 62 Q20 70 26 70 Q22 60 16 58 Z" fill="url(#cr-b)" stroke={OUTLINE} strokeWidth="2"/>
    <ellipse cx="180" cy="75" rx="16" ry="14" fill="url(#cr-b)" stroke={OUTLINE} strokeWidth="3" transform="rotate(20 180 75)"/>
    <path d="M188 62 Q180 70 174 70 Q178 60 184 58 Z" fill="url(#cr-b)" stroke={OUTLINE} strokeWidth="2"/>
    {/* body — rounded */}
    <ellipse cx="100" cy="85" rx="50" ry="38" fill="url(#cr-b)" stroke={OUTLINE} strokeWidth="3"/>
    {/* shell highlight */}
    <ellipse cx="100" cy="65" rx="35" ry="8" fill="white" opacity="0.3"/>
    {/* eye stalks */}
    <line x1="88" y1="58" x2="84" y2="42" stroke={OUTLINE} strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="112" y1="58" x2="116" y2="42" stroke={OUTLINE} strokeWidth="2.5" strokeLinecap="round"/>
    {/* eyes on stalks — big and cute */}
    <circle cx="84" cy="40" r="8" fill="white" stroke={OUTLINE} strokeWidth="2.5"/>
    <circle cx="116" cy="40" r="8" fill="white" stroke={OUTLINE} strokeWidth="2.5"/>
    <circle cx="85" cy="42" r="5" fill="#2a1810"/>
    <circle cx="117" cy="42" r="5" fill="#2a1810"/>
    <circle cx="83" cy="40" r="2.2" fill="white"/>
    <circle cx="115" cy="40" r="2.2" fill="white"/>
    <Blush cx={75} cy={92}/>
    <Blush cx={125} cy={92}/>
    <Smile cx={100} cy={95} w={6}/>
  </svg>
);

const Stingray = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 200 180">
    <defs>
      <radialGradient id="sr-b" cx="50%" cy="35%"><stop offset="0%" stopColor="#d4b890"/><stop offset="100%" stopColor="#8a6838"/></radialGradient>
    </defs>
    <ellipse cx="100" cy="165" rx="60" ry="5" fill="#000" opacity="0.12"/>
    {/* tail */}
    <path d="M100 130 Q108 145 118 160 Q125 168 130 168" stroke={OUTLINE} strokeWidth="4" fill="none" strokeLinecap="round"/>
    <path d="M100 130 Q108 145 118 160 Q125 168 130 168" stroke="#8a6838" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <circle cx="128" cy="166" r="4" fill="#8a6838" stroke={OUTLINE} strokeWidth="2"/>
    {/* wide diamond body */}
    <path d="M100 30 Q35 45 28 95 Q42 130 100 130 Q158 130 172 95 Q165 45 100 30 Z" fill="url(#sr-b)" stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round"/>
    {/* spots */}
    <g fill="#5a4020" opacity="0.5">
      <circle cx="60" cy="80" r="4"/><circle cx="140" cy="80" r="4"/>
      <circle cx="80" cy="105" r="3"/><circle cx="120" cy="105" r="3"/>
      <circle cx="100" cy="90" r="3.5"/>
    </g>
    {/* highlight */}
    <ellipse cx="100" cy="55" rx="45" ry="8" fill="white" opacity="0.3"/>
    {/* face */}
    <KawaiiEyes cx={100} cy={62} spacing={26} eyeSize={7}/>
    <Blush cx={80} cy={78}/>
    <Blush cx={120} cy={78}/>
    <Smile cx={100} cy={82} w={5}/>
  </svg>
);

const MantaRay = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 220 150">
    <defs>
      <linearGradient id="mr-b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#5a7596"/><stop offset="100%" stopColor="#28405a"/></linearGradient>
    </defs>
    <ellipse cx="110" cy="140" rx="70" ry="5" fill="#000" opacity="0.12"/>
    {/* wide body */}
    <path d="M110 35 Q50 32 18 65 Q8 78 22 85 Q60 82 92 88 Q110 92 128 88 Q160 82 198 85 Q212 78 202 65 Q170 32 110 35 Z" fill="url(#mr-b)" stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round"/>
    {/* belly speckles */}
    <g fill="white" opacity="0.7">
      <circle cx="78" cy="62" r="2"/><circle cx="142" cy="62" r="2"/>
      <circle cx="100" cy="55" r="1.6"/><circle cx="120" cy="55" r="1.6"/>
    </g>
    {/* cephalic horns */}
    <path d="M96 42 Q88 28 96 22 Q102 32 102 44 Z" fill="url(#mr-b)" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="M124 42 Q132 28 124 22 Q118 32 118 44 Z" fill="url(#mr-b)" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round"/>
    {/* small tail */}
    <path d="M110 95 Q113 115 118 130 Q112 132 108 110 Z" fill="url(#mr-b)" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round"/>
    {/* face */}
    <KawaiiEyes cx={110} cy={62} spacing={32} eyeSize={7.5}/>
    <Blush cx={88} cy={78} color="#ff7a8a"/>
    <Blush cx={132} cy={78} color="#ff7a8a"/>
    <Smile cx={110} cy={82} w={6} color="#2a3548"/>
  </svg>
);

const Jellyfish = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 180 200">
    <defs>
      <radialGradient id="jf-b" cx="50%" cy="40%"><stop offset="0%" stopColor="#ffc4dc"/><stop offset="100%" stopColor="#d490c0"/></radialGradient>
    </defs>
    <ellipse cx="90" cy="195" rx="55" ry="4" fill="#000" opacity="0.1"/>
    {/* tentacles — wavy */}
    <g stroke="#d490c0" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.95">
      <path d="M50 90 Q42 120 50 150 Q42 170 50 195"/>
      <path d="M70 92 Q62 130 70 165 Q62 180 70 198"/>
      <path d="M90 92 Q90 135 90 180"/>
      <path d="M110 92 Q118 130 110 165 Q118 180 110 198"/>
      <path d="M130 90 Q138 120 130 150 Q138 170 130 195"/>
    </g>
    <g stroke={OUTLINE} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7">
      <path d="M50 90 Q42 120 50 150 Q42 170 50 195"/>
      <path d="M70 92 Q62 130 70 165 Q62 180 70 198"/>
      <path d="M90 92 Q90 135 90 180"/>
      <path d="M110 92 Q118 130 110 165 Q118 180 110 198"/>
      <path d="M130 90 Q138 120 130 150 Q138 170 130 195"/>
    </g>
    {/* dome */}
    <path d="M20 75 Q22 25 90 22 Q158 25 160 75 Q145 92 90 92 Q35 92 20 75 Z" fill="url(#jf-b)" stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round"/>
    {/* dome highlight */}
    <ellipse cx="68" cy="38" rx="28" ry="9" fill="white" opacity="0.55"/>
    {/* scallop edge */}
    <g stroke={OUTLINE} strokeWidth="2" fill="rgba(212,144,192,0.5)" strokeLinejoin="round">
      <path d="M30 80 Q40 92 50 80"/>
      <path d="M70 84 Q80 95 90 84"/>
      <path d="M110 84 Q120 95 130 84"/>
      <path d="M150 80 Q140 92 130 80"/>
    </g>
    {/* face */}
    <KawaiiEyes cx={90} cy={58} spacing={28} eyeSize={8}/>
    <Blush cx={68} cy={75}/>
    <Blush cx={112} cy={75}/>
    <Smile cx={90} cy={78} w={5}/>
  </svg>
);

const Hammerhead = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 220 140">
    <defs>
      <linearGradient id="hh-b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#9aaabc"/><stop offset="100%" stopColor="#5a6a80"/></linearGradient>
    </defs>
    <ellipse cx="110" cy="128" rx="80" ry="5" fill="#000" opacity="0.12"/>
    {/* tail */}
    <path d="M25 70 Q5 45 8 30 Q18 50 28 70 Q18 88 8 110 Q5 95 25 70 Z" fill="url(#hh-b)" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round"/>
    {/* body — chunky and rounded */}
    <path d="M28 55 Q22 80 28 95 L130 95 Q140 80 130 55 L28 55 Z" fill="url(#hh-b)" stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round"/>
    {/* belly */}
    <path d="M35 85 Q90 95 130 85 Q90 95 35 85 Z" fill="#c8d0dc"/>
    {/* dorsal fin */}
    <path d="M75 55 L90 32 L110 55 Z" fill="url(#hh-b)" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round"/>
    {/* belly fin */}
    <path d="M105 90 Q118 110 95 110 Q88 100 100 92 Z" fill="url(#hh-b)" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round"/>
    {/* hammer head — wide T-shape */}
    <path d="M130 38 Q130 32 152 28 Q195 24 205 45 Q205 65 188 70 L168 75 Q145 75 130 75 Q120 65 120 55 Q120 45 130 38 Z" fill="url(#hh-b)" stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round"/>
    {/* eyes on hammer ends — big and adorable */}
    <circle cx="142" cy="40" r="9" fill="white" stroke={OUTLINE} strokeWidth="2.5"/>
    <circle cx="200" cy="48" r="9" fill="white" stroke={OUTLINE} strokeWidth="2.5"/>
    <circle cx="143" cy="42" r="5.5" fill="#2a1810"/>
    <circle cx="201" cy="50" r="5.5" fill="#2a1810"/>
    <circle cx="141" cy="40" r="2.2" fill="white"/>
    <circle cx="199" cy="48" r="2.2" fill="white"/>
    {/* tiny smile on body, not hammer */}
    <Smile cx={75} cy={82} w={5} color="#2a3548"/>
    <Blush cx={55} cy={78} color="#ff7a8a" r={4}/>
  </svg>
);

const WhaleShark = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 240 140">
    <defs>
      <linearGradient id="ws-b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#7898c2"/><stop offset="100%" stopColor="#3a5478"/></linearGradient>
    </defs>
    <ellipse cx="125" cy="130" rx="85" ry="5" fill="#000" opacity="0.12"/>
    {/* tail */}
    <path d="M28 70 Q10 35 5 18 Q18 50 25 70 Q18 92 5 122 Q10 105 28 70 Z" fill="url(#ws-b)" stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round"/>
    {/* big rounded body */}
    <ellipse cx="135" cy="70" rx="105" ry="48" fill="url(#ws-b)" stroke={OUTLINE} strokeWidth="3"/>
    {/* belly */}
    <ellipse cx="135" cy="98" rx="80" ry="14" fill="#d8e2ee" opacity="0.85"/>
    {/* top fin */}
    <path d="M120 25 L138 5 L158 25 Z" fill="url(#ws-b)" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round"/>
    {/* spot pattern */}
    <g fill="white" opacity="0.85">
      <circle cx="95" cy="55" r="3"/><circle cx="115" cy="48" r="2.5"/>
      <circle cx="135" cy="55" r="3.2"/><circle cx="155" cy="50" r="2.8"/>
      <circle cx="175" cy="58" r="3"/><circle cx="105" cy="75" r="2.5"/>
      <circle cx="130" cy="78" r="2.8"/><circle cx="155" cy="75" r="2.5"/>
      <circle cx="180" cy="80" r="2.6"/>
    </g>
    {/* face — at far right */}
    <KawaiiEyes cx={215} cy={68} spacing={0} eyeSize={6}/>
    {/* tiny smile */}
    <Smile cx={222} cy={82} w={5} color="#2a3548"/>
    <Blush cx={207} cy={82} color="#ff8a9a" r={4}/>
  </svg>
);

const OrcaWhale = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 240 130">
    <defs>
      <linearGradient id="ow-b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#3a3a3a"/><stop offset="100%" stopColor="#0a0a0a"/></linearGradient>
    </defs>
    <ellipse cx="125" cy="120" rx="80" ry="5" fill="#000" opacity="0.12"/>
    {/* tail */}
    <path d="M28 65 Q8 35 5 22 Q18 45 25 65 Q18 88 5 110 Q8 95 28 65 Z" fill="url(#ow-b)" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round"/>
    {/* body */}
    <ellipse cx="135" cy="65" rx="100" ry="38" fill="url(#ow-b)" stroke={OUTLINE} strokeWidth="3"/>
    {/* white belly */}
    <path d="M70 80 Q135 100 200 80 Q190 95 135 95 Q80 95 70 80 Z" fill="white" stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round"/>
    {/* white eye patch */}
    <ellipse cx="200" cy="55" rx="16" ry="9" fill="white" stroke={OUTLINE} strokeWidth="2"/>
    {/* dorsal fin */}
    <path d="M118 30 Q135 8 148 18 Q150 30 142 38 Q128 38 118 35 Z" fill="url(#ow-b)" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round"/>
    {/* eye */}
    <circle cx="202" cy="56" r="3.5" fill="#2a1810"/>
    <circle cx="201" cy="55" r="1.2" fill="white"/>
    <Smile cx={215} cy={73} w={5} color="#2a1810"/>
    <Blush cx={193} cy={70} color="#ff8a9a" r={3.5}/>
  </svg>
);

const GiantSquid = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <defs>
      <linearGradient id="sq-b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#e8706a"/><stop offset="100%" stopColor="#a02828"/></linearGradient>
    </defs>
    <ellipse cx="100" cy="192" rx="60" ry="4" fill="#000" opacity="0.12"/>
    {/* body — bullet shape */}
    <path d="M100 15 Q70 18 70 95 Q70 108 100 112 Q130 108 130 95 Q130 18 100 15 Z" fill="url(#sq-b)" stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round"/>
    {/* fins on top */}
    <path d="M70 38 Q50 42 55 72 Q66 76 75 65 Z" fill="url(#sq-b)" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="M130 38 Q150 42 145 72 Q134 76 125 65 Z" fill="url(#sq-b)" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round"/>
    {/* spots */}
    <g fill="#7a1010" opacity="0.5">
      <circle cx="88" cy="40" r="2.5"/><circle cx="112" cy="40" r="2.5"/>
      <circle cx="95" cy="60" r="2"/><circle cx="105" cy="60" r="2"/>
    </g>
    {/* tentacles */}
    <g fill="url(#sq-b)" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round">
      <path d="M78 110 Q68 135 64 158 Q72 162 76 145 Q82 125 86 115 Z"/>
      <path d="M92 110 Q86 138 84 168 Q92 170 92 148 Q95 128 98 115 Z"/>
      <path d="M108 110 Q114 138 116 168 Q108 170 108 148 Q105 128 102 115 Z"/>
      <path d="M122 110 Q132 135 136 158 Q128 162 124 145 Q118 125 114 115 Z"/>
      <path d="M70 108 Q42 138 32 175 Q40 180 45 168 Q60 138 80 115 Z" strokeWidth="2.5"/>
      <path d="M130 108 Q158 138 168 175 Q160 180 155 168 Q140 138 120 115 Z" strokeWidth="2.5"/>
    </g>
    {/* big sparkle eyes (squid have HUGE eyes) */}
    <circle cx="83" cy="78" r="11" fill="white" stroke={OUTLINE} strokeWidth="2.5"/>
    <circle cx="117" cy="78" r="11" fill="white" stroke={OUTLINE} strokeWidth="2.5"/>
    <circle cx="84" cy="80" r="7" fill="#2a1810"/>
    <circle cx="118" cy="80" r="7" fill="#2a1810"/>
    <circle cx="82" cy="77" r="3" fill="white"/>
    <circle cx="116" cy="77" r="3" fill="white"/>
    <circle cx="86" cy="83" r="1.4" fill="white"/>
    <circle cx="120" cy="83" r="1.4" fill="white"/>
    <Blush cx={68} cy={90} color="#ff7a8a"/>
    <Blush cx={132} cy={90} color="#ff7a8a"/>
    <Smile cx={100} cy={102} w={5}/>
  </svg>
);

const Anglerfish = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 200 160">
    <defs>
      <radialGradient id="af-b" cx="40%" cy="50%"><stop offset="0%" stopColor="#4a3548"/><stop offset="100%" stopColor="#1a1018"/></radialGradient>
      <radialGradient id="af-g" cx="50%" cy="50%"><stop offset="0%" stopColor="#fff6c0"/><stop offset="100%" stopColor="rgba(255,200,80,0)"/></radialGradient>
    </defs>
    <ellipse cx="100" cy="150" rx="60" ry="5" fill="#000" opacity="0.12"/>
    {/* tail */}
    <path d="M30 80 Q12 60 8 48 Q18 70 25 80 Q18 92 8 112 Q12 100 30 80 Z" fill="url(#af-b)" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round"/>
    {/* body — round and chubby */}
    <ellipse cx="105" cy="88" rx="62" ry="48" fill="url(#af-b)" stroke={OUTLINE} strokeWidth="3"/>
    {/* lure */}
    <path d="M95 42 Q85 22 75 14" stroke={OUTLINE} strokeWidth="3" fill="none" strokeLinecap="round"/>
    <circle cx="75" cy="14" r="13" fill="url(#af-g)" opacity="0.6"/>
    <circle cx="75" cy="14" r="7" fill="#fff8d0" stroke={OUTLINE} strokeWidth="2"/>
    <circle cx="73" cy="12" r="2.5" fill="white"/>
    {/* mouth — wide with little teeth */}
    <path d="M85 100 Q105 92 145 102 Q140 112 105 110 Q88 108 85 100 Z" fill="#3a0a18" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round"/>
    <g fill="white" stroke={OUTLINE} strokeWidth="0.5">
      <path d="M92 100 L94 106 L96 100 Z"/>
      <path d="M100 100 L102 107 L104 100 Z"/>
      <path d="M120 100 L122 107 L124 100 Z"/>
      <path d="M128 100 L130 107 L132 100 Z"/>
      <path d="M96 108 L98 102 L100 108 Z"/>
      <path d="M118 108 L120 102 L122 108 Z"/>
    </g>
    {/* big eye */}
    <circle cx="115" cy="78" r="13" fill="white" stroke={OUTLINE} strokeWidth="3"/>
    <circle cx="116" cy="80" r="8" fill="#2a1810"/>
    <circle cx="114" cy="77" r="3.2" fill="white"/>
    <circle cx="118" cy="84" r="1.5" fill="white"/>
    {/* tiny chub blush — playful contrast */}
    <Blush cx={150} cy={92} color="#a08fc7" r={4}/>
    <Blush cx={85} cy={85} color="#a08fc7" r={3}/>
    {/* bioluminescent dots on body */}
    <circle cx="95" cy="105" r="1.5" fill="#a8e6cf" opacity="0.7"/>
    <circle cx="140" cy="80" r="1.2" fill="#a8e6cf" opacity="0.7"/>
    <circle cx="125" cy="115" r="1.4" fill="#a8e6cf" opacity="0.7"/>
  </svg>
);

const Dolphin = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 220 130">
    <defs>
      <linearGradient id="dl-b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#a8c0d4"/><stop offset="100%" stopColor="#5a7896"/></linearGradient>
    </defs>
    <ellipse cx="110" cy="122" rx="80" ry="5" fill="#000" opacity="0.12"/>
    {/* tail */}
    <path d="M28 60 Q8 38 5 25 Q18 48 25 62 Q18 78 5 98 Q8 88 28 65 Z" fill="url(#dl-b)" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round"/>
    {/* body — rounded and chubby */}
    <path d="M30 60 Q45 32 130 32 Q180 35 200 60 Q205 68 198 75 L180 78 Q160 80 130 82 Q60 82 30 70 Z" fill="url(#dl-b)" stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round"/>
    {/* belly */}
    <path d="M55 75 Q130 92 195 75 Q130 88 55 75 Z" fill="#f4e8d0" opacity="0.9"/>
    {/* beak — rounded */}
    <path d="M198 60 Q218 58 218 68 Q215 73 200 72 Z" fill="url(#dl-b)" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round"/>
    {/* dorsal fin */}
    <path d="M85 32 Q98 12 110 32 Z" fill="url(#dl-b)" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round"/>
    {/* belly fin */}
    <path d="M108 78 Q128 95 95 100 Q90 85 100 78 Z" fill="url(#dl-b)" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round"/>
    {/* face */}
    <circle cx="188" cy="55" r="6" fill="white" stroke={OUTLINE} strokeWidth="2.5"/>
    <circle cx="188" cy="55" r="3.5" fill="#2a1810"/>
    <circle cx="186" cy="53" r="1.5" fill="white"/>
    <Smile cx={210} cy={68} w={4} color="#2a1810"/>
    <Blush cx={195} cy={70} color="#ff8a9a" r={3.5}/>
  </svg>
);

const SwordFish = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 240 120">
    <defs>
      <linearGradient id="sw-b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#6a8aac"/><stop offset="100%" stopColor="#28405a"/></linearGradient>
    </defs>
    <ellipse cx="120" cy="112" rx="80" ry="5" fill="#000" opacity="0.12"/>
    {/* tail */}
    <path d="M28 58 Q8 32 5 18 Q18 42 25 58 Q18 72 5 92 Q8 80 28 60 Z" fill="url(#sw-b)" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round"/>
    {/* body */}
    <ellipse cx="115" cy="60" rx="85" ry="25" fill="url(#sw-b)" stroke={OUTLINE} strokeWidth="3"/>
    {/* belly */}
    <ellipse cx="115" cy="72" rx="70" ry="10" fill="#a8b8cc" opacity="0.6"/>
    {/* top fin */}
    <path d="M75 42 Q92 22 108 42 Z" fill="url(#sw-b)" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round"/>
    {/* bottom fin */}
    <path d="M118 80 Q138 100 105 100 Q100 88 110 80 Z" fill="url(#sw-b)" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round"/>
    {/* sword */}
    <path d="M198 58 L238 55 L238 65 L198 62 Z" fill="#d4c098" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round"/>
    {/* eye */}
    <circle cx="188" cy="54" r="6" fill="white" stroke={OUTLINE} strokeWidth="2.5"/>
    <circle cx="188" cy="54" r="3.5" fill="#2a1810"/>
    <circle cx="186" cy="52" r="1.5" fill="white"/>
    <Blush cx={175} cy={68} color="#ff8a9a" r={4}/>
    <Smile cx={195} cy={70} w={4} color="#2a1810"/>
  </svg>
);


// ═══════════════════════════════════════════════════════════
// CREATURE REGISTRY
// ═══════════════════════════════════════════════════════════
const CREATURE_COMPONENTS = {
  clownfish: Clownfish, seahorse: Seahorse, pufferfish: Pufferfish,
  turtle: SeaTurtle, octopus: Octopus, crab: Crab,
  stingray: Stingray, dolphin: Dolphin, swordfish: SwordFish,
  jellyfish: Jellyfish, manta: MantaRay, hammerhead: Hammerhead,
  whaleshark: WhaleShark, orca: OrcaWhale,
  squid: GiantSquid, anglerfish: Anglerfish,
};
const renderCreature = (id, size = 100) => {
  const Comp = CREATURE_COMPONENTS[id];
  return Comp ? <Comp size={size} /> : null;
};

// ═══════════════════════════════════════════════════════════
// THE JOURNEY — 8 zones descending into the ocean
// ═══════════════════════════════════════════════════════════
const JOURNEY = [
  {
    id: 1, name: "Sunlit Shallows", depth: "0–30m",
    bg: ["#7ec8e3", "#5aafd0"], textColor: "#0a3a5a",
    desc: "Where sunlight dances on the surface and coral begins to bloom.",
    creatures: [
      { id: "clownfish", name: "Goldfish", rarity: "Common", fact: "One of the first fish domesticated by humans over 1,000 years ago in China. Can live for over 40 years." },
      { id: "seahorse", name: "Seahorse", rarity: "Common", fact: "The only known animal where males carry the babies and give birth." },
    ]
  },
  {
    id: 2, name: "Coral Gardens", depth: "10–40m",
    bg: ["#5aafd0", "#3a8fc4"], textColor: "#ffffff",
    desc: "A vivid riot of color teeming with reef life.",
    creatures: [
      { id: "pufferfish", name: "Pufferfish", rarity: "Common", fact: "Inflates to twice its size when threatened. Carries tetrodotoxin 1200× more lethal than cyanide." },
      { id: "turtle", name: "Green Sea Turtle", rarity: "Uncommon", fact: "Lives up to 80 years and navigates back to its birth beach using Earth's magnetic field." },
    ]
  },
  {
    id: 3, name: "Kelp Forest", depth: "20–60m",
    bg: ["#3a8fc4", "#2a6a9a"], textColor: "#ffffff",
    desc: "Giant green spires sway in slow, ancient rhythm.",
    creatures: [
      { id: "octopus", name: "Giant Pacific Octopus", rarity: "Uncommon", fact: "Has nine brains, three hearts, and can solve complex puzzles in seconds." },
      { id: "crab", name: "Sheep Crab", rarity: "Common", fact: "Decorates its shell with algae and sponges as living camouflage." },
    ]
  },
  {
    id: 4, name: "The Open Blue", depth: "50–150m",
    bg: ["#2a6a9a", "#1a4a7a"], textColor: "#ffffff",
    desc: "Endless cobalt. Currents carry travelers across oceans.",
    creatures: [
      { id: "dolphin", name: "Bottlenose Dolphin", rarity: "Uncommon", fact: "Recognizes itself in mirrors and uses signature whistles like names for one another." },
      { id: "swordfish", name: "Swordfish", rarity: "Rare", fact: "Hunts at 60 mph using its sword to slash through schools of fish." },
    ]
  },
  {
    id: 5, name: "Manta Highway", depth: "100–300m",
    bg: ["#1a4a7a", "#143a60"], textColor: "#ffffff",
    desc: "Where giants glide on invisible rivers in the deep.",
    creatures: [
      { id: "stingray", name: "Southern Stingray", rarity: "Uncommon", fact: "Glides on wing-like fins, growing up to 6 feet across, with electroreceptors that detect heartbeats in the sand." },
      { id: "manta", name: "Manta Ray", rarity: "Rare", fact: "Has the largest brain-to-body ratio of any fish, and is one of the few non-mammals to recognize itself in mirrors." },
    ]
  },
  {
    id: 6, name: "Twilight Zone", depth: "200–1000m",
    bg: ["#143a60", "#0e2540"], textColor: "#ffffff",
    desc: "Sunlight fades to nothing. Strange shapes emerge from the dark.",
    creatures: [
      { id: "jellyfish", name: "Atolla Jellyfish", rarity: "Rare", fact: "Bioluminescent burglar alarm: when attacked, it flashes pinwheels of light to summon larger predators to scare off its attacker." },
      { id: "hammerhead", name: "Hammerhead Shark", rarity: "Rare", fact: "360-degree vision and electroreceptors detect prey buried beneath the sand." },
    ]
  },
  {
    id: 7, name: "The Deep Drift", depth: "1000–4000m",
    bg: ["#0e2540", "#0a1a30"], textColor: "#ffffff",
    desc: "Cold ancient currents. Apex travelers cross the dark.",
    creatures: [
      { id: "whaleshark", name: "Whale Shark", rarity: "Legendary", fact: "The largest fish in the sea — up to 60 feet long — filter-feeds plankton with a five-foot wide mouth." },
      { id: "orca", name: "Orca", rarity: "Legendary", fact: "The ocean's apex predator. Lives in matrilineal pods that pass down hunting techniques across generations." },
    ]
  },
  {
    id: 8, name: "The Abyss", depth: "4000m+",
    bg: ["#0a1a30", "#040814"], textColor: "#a8e6cf",
    desc: "Eternal darkness. Light here is no longer a gift, but a weapon and a lure.",
    creatures: [
      { id: "squid", name: "Giant Squid", rarity: "Legendary", fact: "Eyes the size of dinner plates — the largest in the animal kingdom. Almost never seen alive." },
      { id: "anglerfish", name: "Black Sea Devil", rarity: "Mythic", fact: "Lures prey with a bioluminescent bulb. Males permanently fuse to females, becoming a parasitic appendage." },
    ]
  },
];

const ALL_CREATURES = JOURNEY.flatMap(s => s.creatures.map(c => ({ ...c, stageId: s.id, stageName: s.name })));
const TOTAL_CREATURES = ALL_CREATURES.length;

const RARITY_COLORS = {
  Common: "#7ec8e3", Uncommon: "#5ed3a3", Rare: "#a08fc7",
  Legendary: "#f4c763", Mythic: "#ff7a8a"
};

// ═══════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════
const Card = ({ children, style, glow, glowColor = C.aqua, onClick, dark }) => (
  <div onClick={onClick} style={{
    padding: 20, background: dark ? C.cardDark : C.cardBg, borderRadius: 20,
    backdropFilter: dark ? "blur(10px)" : "none",
    boxShadow: glow ? `0 6px 24px ${glowColor}55, inset 0 0 0 1px ${glowColor}66` : "0 4px 16px rgba(0,30,60,0.08)",
    cursor: onClick ? "pointer" : "default", transition: "transform 0.2s, box-shadow 0.2s", ...style
  }}>{children}</div>
);

const ProgressRing = ({ progress, size = 80, stroke = 10, color = C.aqua, trackColor = "rgba(20,40,70,0.12)", children }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [anim, setAnim] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnim(Math.min(progress, 1)), 50); return () => clearTimeout(t); }, [progress]);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - anim)}
          style={{ transition: "stroke-dashoffset 1s ease-out" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>{children}</div>
    </div>
  );
};

const Btn = ({ children, onClick, color = C.aqua, textColor = C.deepNavy, disabled, style }) => (
  <button onClick={disabled ? undefined : onClick} style={{
    ...font(18, 600), color: textColor, background: color, border: "none",
    borderRadius: 16, padding: "16px 32px", width: "100%", cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1, transition: "transform 0.15s, opacity 0.2s", ...style
  }}
    onMouseDown={e => !disabled && (e.currentTarget.style.transform = "scale(0.97)")}
    onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
  >{children}</button>
);

const SectionHeader = ({ title, subtitle, icon, light }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
    {icon && <span style={{ fontSize: 22 }}>{icon}</span>}
    <div>
      <div style={{ ...displayFont(22), color: light ? "#fff" : C.deepNavy }}>{title}</div>
      {subtitle && <div style={{ ...font(14, 500), color: light ? "rgba(255,255,255,0.7)" : C.slate }}>{subtitle}</div>}
    </div>
  </div>
);

const StatPill = ({ label, value, color }) => (
  <div style={{ flex: 1, textAlign: "center", padding: "10px 8px", background: color + "1a", borderRadius: 12 }}>
    <div style={{ ...mono(18), color }}>{value}</div>
    <div style={{ ...font(11, 500), color: C.slate, marginTop: 2 }}>{label}</div>
  </div>
);

const SkillBar = ({ name, score, color, max = 10 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <div style={{ ...font(14, 500), color: C.slate, width: 90 }}>{name}</div>
    <div style={{ flex: 1, height: 10, background: C.deepNavy + "10", borderRadius: 5, overflow: "hidden" }}>
      <div style={{ width: `${(score / max) * 100}%`, height: "100%", background: color, borderRadius: 5, transition: "width 0.8s ease-out" }} />
    </div>
    <div style={{ ...mono(14), color: C.deepNavy, width: 24, textAlign: "right" }}>{score}</div>
  </div>
);

// Animated ocean bubbles background
const Bubbles = ({ count = 12, opacity = 0.4 }) => {
  const bubbles = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i, left: Math.random() * 100, size: Math.random() * 12 + 4,
    duration: Math.random() * 8 + 6, delay: Math.random() * 8,
  })), [count]);
  return (
    <>
      <style>{`@keyframes bubRise{0%{transform:translateY(110vh) translateX(0);opacity:0}10%{opacity:${opacity}}90%{opacity:${opacity}}100%{transform:translateY(-20vh) translateX(20px);opacity:0}}`}</style>
      {bubbles.map(b => (
        <div key={b.id} style={{
          position: "absolute", left: `${b.left}%`, width: b.size, height: b.size,
          borderRadius: "50%", background: "rgba(255,255,255,0.4)",
          border: "1px solid rgba(255,255,255,0.6)",
          animation: `bubRise ${b.duration}s linear ${b.delay}s infinite`, pointerEvents: "none",
        }} />
      ))}
    </>
  );
};

const Caustics = () => (
  <div style={{
    position: "absolute", inset: 0, pointerEvents: "none",
    background: "radial-gradient(ellipse at 30% 0%, rgba(255,255,255,0.15), transparent 50%), radial-gradient(ellipse at 70% 0%, rgba(255,255,255,0.1), transparent 60%)",
  }} />
);

// Floating creature silhouette decoration
const SwimmingCreature = ({ creature, top, side = "left", duration = 30, delay = 0, scale = 1, flip = false }) => (
  <>
    <style>{`@keyframes swim-${creature}-${side}{from{transform:translateX(${side === "left" ? "-30vw" : "130vw"}) scale(${scale}) scaleX(${flip ? -1 : 1})}to{transform:translateX(${side === "left" ? "130vw" : "-30vw"}) scale(${scale}) scaleX(${flip ? -1 : 1})}}`}</style>
    <div style={{
      position: "absolute", top, left: 0, opacity: 0.18, pointerEvents: "none",
      animation: `swim-${creature}-${side} ${duration}s linear ${delay}s infinite`,
    }}>{renderCreature(creature, 80)}</div>
  </>
);

// ═══════════════════════════════════════════════════════════
// GAME REGISTRY
// ═══════════════════════════════════════════════════════════
// Games are grounded in validated executive function paradigms:
//  - Stroop Showdown: response inhibition (Stroop, 1935)
//  - Reef Crossing: planning + working memory (river-crossing paradigm)
//  - Rule Shift: cognitive flexibility / set-shifting (WCST, Berg 1948)
//  - Dual N-Back: working memory updating (Kirchner 1958; Jaeggi 2008)
//  - Pattern Recall: visuospatial working memory (Corsi block-tapping)
//  - Focus Grid: selective attention (visual search)
//  - Number Flow: fluid reasoning
//  - Word Maze: verbal fluency
const GAMES = [
  { id: "pattern", name: "Pattern Recall", icon: "🧩", color: C.aqua, skill: "Working Memory", desc: "Memorize and repeat tile sequences", difficulty: "Medium" },
  { id: "number", name: "Number Flow", icon: "🔢", color: C.gold, skill: "Fluid Reasoning", desc: "Spot patterns and solve under pressure", difficulty: "Medium" },
  { id: "focus", name: "Focus Grid", icon: "🎯", color: "#a08fc7", skill: "Attention", desc: "Find targets in a visual field", difficulty: "Easy" },
  { id: "stroop", name: "Stroop Showdown", icon: "🎨", color: C.seagrass, skill: "Inhibition", desc: "Override the automatic response — tap the ink color, not the word", difficulty: "Hard" },
  { id: "wordmaze", name: "Word Maze", icon: "🔤", color: C.coral, skill: "Verbal Fluency", desc: "Build word chains from connections", difficulty: "Medium" },
  { id: "bridge", name: "Reef Crossing", icon: "🛥️", color: "#e4925a", skill: "Planning", desc: "Ferry creatures across the trench — plan ahead so nothing gets eaten", difficulty: "Hard" },
  { id: "dualn", name: "Dual N-Back", icon: "🔁", color: C.shallow, skill: "Working Memory", desc: "Track two streams simultaneously", difficulty: "Hard" },
  { id: "ruleshift", name: "Rule Shift", icon: "🔀", color: "#e8c75c", skill: "Flexibility", desc: "Discover the hidden rule — then adapt when it changes", difficulty: "Hard" },
];

// Skills tracked, aligned with Diamond (2013) core executive function components
// and the higher-order functions built from them.
const SKILLS = [
  { name: "Inhibition", color: C.seagrass },
  { name: "Working Memory", color: C.aqua },
  { name: "Flexibility", color: "#e8c75c" },
  { name: "Attention", color: "#a08fc7" },
  { name: "Planning", color: "#e4925a" },
  { name: "Fluid Reasoning", color: C.gold },
  { name: "Verbal Fluency", color: C.coral },
];

// ═══════════════════════════════════════════════════════════
// PROFILE BUILDERS
// New diver starts at stage 1, all stages locked beyond.
// ═══════════════════════════════════════════════════════════
const TITLES_BY_STAGE = ["Surface Diver", "Reef Wanderer", "Kelp Drifter", "Open Sea Voyager", "Manta Companion", "Twilight Explorer", "Deep Diver", "Abyss Walker"];

const makeProfile = (name = "Alex") => ({
  firstName: name, totalXP: 0, currentLevel: 1,
  currentStreak: 0, longestStreak: 0,
  avatarTitle: TITLES_BY_STAGE[0],
  skillScores: { "Inhibition": 5, "Working Memory": 5, "Flexibility": 5, "Attention": 5, "Planning": 5, "Fluid Reasoning": 5, "Verbal Fluency": 5 },
  gameHistory: GAMES.map(g => ({ id: g.id, bestScore: 0, timesPlayed: 0, lastScore: 0 })),
  weekScores: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => ({ day: d, score: 0 })),
  currentStage: 1,
  stagesCompleted: [],
  collectedCreatures: [],
  achievements: [
    { id: 1, name: "First Dive", icon: "🌊", earned: false, desc: "Complete your first daily workout" },
    { id: 2, name: "Reef Explorer", icon: "🐠", earned: false, desc: "Reach the Coral Gardens" },
    { id: 3, name: "Collector", icon: "💎", earned: false, desc: "Collect 5 sea creatures" },
    { id: 4, name: "Deep Diver", icon: "🌑", earned: false, desc: "Reach the Twilight Zone" },
    { id: 5, name: "Apex Predator", icon: "🦈", earned: false, desc: "Discover an orca" },
    { id: 6, name: "Abyss Walker", icon: "👁", earned: false, desc: "Reach the deepest zone" },
  ],
});

const makeDemoProfile = (name = "Alex") => ({
  ...makeProfile(name),
  totalXP: 1850, currentLevel: 4,
  currentStreak: 8, longestStreak: 12,
  avatarTitle: TITLES_BY_STAGE[3],
  skillScores: { "Inhibition": 7, "Working Memory": 8, "Flexibility": 6, "Attention": 8, "Planning": 5, "Fluid Reasoning": 6, "Verbal Fluency": 7 },
  gameHistory: GAMES.map(g => ({
    id: g.id, bestScore: Math.floor(Math.random() * 100 + 80),
    timesPlayed: Math.floor(Math.random() * 10 + 3),
    lastScore: Math.floor(Math.random() * 80 + 60),
  })),
  weekScores: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => ({
    day: d, score: i === 5 ? 0 : Math.floor(Math.random() * 300 + 200)
  })),
  currentStage: 4,
  stagesCompleted: [1, 2, 3],
  collectedCreatures: ["clownfish", "seahorse", "pufferfish", "turtle", "octopus", "crab"],
  achievements: [
    { id: 1, name: "First Dive", icon: "🌊", earned: true, desc: "Complete your first daily workout" },
    { id: 2, name: "Reef Explorer", icon: "🐠", earned: true, desc: "Reach the Coral Gardens" },
    { id: 3, name: "Collector", icon: "💎", earned: true, desc: "Collect 5 sea creatures" },
    { id: 4, name: "Deep Diver", icon: "🌑", earned: false, desc: "Reach the Twilight Zone" },
    { id: 5, name: "Apex Predator", icon: "🦈", earned: false, desc: "Discover an orca" },
    { id: 6, name: "Abyss Walker", icon: "👁", earned: false, desc: "Reach the deepest zone" },
  ],
});

// ═══════════════════════════════════════════════════════════
// ONBOARDING
// ═══════════════════════════════════════════════════════════
const OnboardingView = ({ onComplete }) => {
  const [page, setPage] = useState(0);
  const [name, setName] = useState("");
  const [animIn, setAnimIn] = useState(false);
  useEffect(() => { setTimeout(() => setAnimIn(true), 100); }, []);

  const pages = [
    <div key={0} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: 32, textAlign: "center" }}>
      <div style={{ position: "relative", marginBottom: 24 }}>
        <div style={{ width: 220, height: 220, borderRadius: "50%", background: `${C.aqua}1a`, position: "absolute", top: "50%", left: "50%", transform: `translate(-50%,-50%) scale(${animIn ? 1.1 : 0.3})`, transition: "transform 1s cubic-bezier(0.34,1.56,0.64,1)" }} />
        <div style={{ width: 180, height: 180, borderRadius: "50%", background: `${C.aqua}33`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${animIn ? 1 : 0.5})`, transition: "transform 0.8s cubic-bezier(0.34,1.56,0.64,1)" }}>
          <div style={{ filter: `opacity(${animIn ? 1 : 0})`, transition: "filter 0.5s" }}><Clownfish size={140} /></div>
        </div>
      </div>
      <div style={{ ...displayFont(42), color: "#fff", opacity: animIn ? 1 : 0, transition: "opacity 0.6s 0.2s" }}>SharpMind</div>
      <div style={{ ...font(15, 700), color: C.aqua, marginTop: 6, opacity: animIn ? 1 : 0, transition: "opacity 0.6s 0.3s", letterSpacing: 3, textTransform: "uppercase" }}>Ocean Journey</div>
      <p style={{ ...font(17), color: "rgba(255,255,255,0.78)", marginTop: 18, maxWidth: 340, opacity: animIn ? 1 : 0, transition: "opacity 0.6s 0.4s" }}>
        Train the brain's management system. {GAMES.length} games grounded in neuroscience. Complete daily dives to descend deeper and discover {TOTAL_CREATURES} exotic sea creatures.
      </p>
      <div style={{ flex: 1 }} />
      <Btn onClick={() => setPage(1)} style={{ opacity: animIn ? 1 : 0, transition: "opacity 0.6s 0.5s" }}>Begin the Journey 🌊</Btn>
    </div>,
    <div key={1} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: 32, textAlign: "center" }}>
      <div style={{ marginBottom: 18 }}><SeaTurtle size={130} /></div>
      <div style={{ ...displayFont(28), color: "#fff", marginBottom: 24 }}>What should we call you, diver?</div>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Your first name"
        style={{ ...font(20, 600), color: "#fff", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 14, padding: "14px 20px", textAlign: "center", width: "80%", outline: "none" }} />
      <p style={{ ...font(14, 500), color: "rgba(255,255,255,0.5)", marginTop: 12, maxWidth: 300 }}>We'll track your progress across all seven executive function skills.</p>
      <div style={{ flex: 1 }} />
      <Btn onClick={() => setPage(2)} disabled={!name.trim()}>Continue</Btn>
    </div>,
    <div key={2} style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%", padding: 24, overflowY: "auto" }}>
      <div style={{ ...displayFont(26), color: "#fff", marginBottom: 6 }}>Your Journey Awaits</div>
      <div style={{ ...font(15), color: "rgba(255,255,255,0.65)", marginBottom: 16, textAlign: "center" }}>8 ocean zones · {TOTAL_CREATURES} creatures to collect</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
        {JOURNEY.slice(0, 8).map((s, i) => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 14px", background: "rgba(255,255,255,0.06)", borderRadius: 14, border: `1px solid ${i === 0 ? C.aqua + "60" : "rgba(255,255,255,0.05)"}` }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${s.bg[0]}, ${s.bg[1]})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, ...mono(14), color: "#fff" }}>{s.id}</div>
            <div style={{ flex: 1 }}>
              <div style={{ ...font(15, 600), color: "#fff" }}>{s.name}</div>
              <div style={{ ...font(12, 500), color: "rgba(255,255,255,0.5)" }}>{s.depth} · {s.creatures.length} creature{s.creatures.length !== 1 ? "s" : ""}</div>
            </div>
            {i === 0 ? <span style={{ ...font(11, 700), color: C.aqua }}>START</span> : <span style={{ fontSize: 14, opacity: 0.4 }}>🔒</span>}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, minHeight: 16 }} />
      <Btn onClick={() => onComplete(makeProfile(name))}>Dive In 🌊</Btn>
    </div>,
  ];

  return (
    <div style={{ height: "100%", background: `linear-gradient(180deg, ${C.midnight} 0%, ${C.deepNavy} 60%, ${C.abyss} 100%)`, position: "relative", overflow: "hidden" }}>
      <Bubbles count={14} opacity={0.35} />
      <Caustics />
      <div style={{ display: "flex", justifyContent: "center", gap: 8, paddingTop: 20, position: "relative", zIndex: 2 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: i === page ? 28 : 8, height: 8, borderRadius: 4, background: i === page ? C.aqua : "rgba(255,255,255,0.25)", transition: "all 0.3s" }} />
        ))}
      </div>
      <div style={{ height: "calc(100% - 48px)", position: "relative", zIndex: 2 }}>{pages[page]}</div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// GAMES
// All games target validated executive function paradigms.
// ═══════════════════════════════════════════════════════════
const GameChrome = ({ name, icon, color, round, totalRounds, score, timeLeft, maxTime, children, subtitle }) => (
  <div style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
    <div style={{ ...displayFont(22), color: "#fff", marginBottom: 2 }}>{icon} {name}</div>
    {subtitle && <div style={{ ...font(14, 500), color: `${color}cc`, marginBottom: 8, textAlign: "center" }}>{subtitle}</div>}
    <div style={{ display: "flex", gap: 16, width: "100%", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
      <span style={{ ...mono(13), color: "rgba(255,255,255,0.7)" }}>R{round}/{totalRounds}</span>
      {maxTime > 0 && (
        <div style={{ flex: 1, maxWidth: 120, height: 6, background: "rgba(255,255,255,0.12)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ width: `${(timeLeft / maxTime) * 100}%`, height: "100%", background: timeLeft > maxTime * 0.3 ? color : C.coral, borderRadius: 3, transition: "width 0.3s linear" }} />
        </div>
      )}
      <span style={{ ...mono(13), color: C.gold }}>★ {score}</span>
    </div>
    <div style={{ flex: 1, width: "100%", overflow: "auto" }}>{children}</div>
  </div>
);

// ───────────────────────────────────────────────────────────
// PATTERN RECALL — Corsi block-tapping paradigm.
// Visuospatial working memory.
// ───────────────────────────────────────────────────────────
const PatternRecallGame = ({ onComplete }) => {
  const [phase, setPhase] = useState("countdown");
  const [countdown, setCountdown] = useState(3);
  const [sequence, setSequence] = useState([]);
  const [showIdx, setShowIdx] = useState(-1);
  const [playerInput, setPlayerInput] = useState([]);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [seqLen, setSeqLen] = useState(3);
  const [result, setResult] = useState(null);
  const timerRef = useRef(null);

  const startRound = useCallback(() => {
    const seq = Array.from({ length: seqLen }, () => Math.floor(Math.random() * 9));
    setSequence(seq); setPlayerInput([]); setResult(null); setPhase("watching"); setShowIdx(0);
    let i = 0;
    const showInt = setInterval(() => {
      i++;
      if (i >= seq.length) { clearInterval(showInt); setTimeout(() => { setShowIdx(-1); setPhase("recalling"); }, 500); }
      else setShowIdx(i);
    }, 700);
  }, [seqLen]);

  useEffect(() => {
    if (phase === "countdown") {
      timerRef.current = setInterval(() => {
        setCountdown(c => { if (c <= 1) { clearInterval(timerRef.current); startRound(); return 3; } return c - 1; });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase, startRound]);

  const handleTap = (idx) => {
    if (phase !== "recalling") return;
    const next = [...playerInput, idx];
    setPlayerInput(next);
    if (next.length === sequence.length) {
      const correct = next.every((v, i) => v === sequence[i]);
      const pts = correct ? seqLen * 20 + round * 5 : 0;
      setResult(correct); setScore(s => s + pts); setPhase("feedback");
      setTimeout(() => {
        if (round < 5) { setRound(r => r + 1); if (correct) setSeqLen(l => Math.min(l + 1, 7)); startRound(); }
        else onComplete(score + pts);
      }, 1200);
    }
  };

  if (phase === "countdown") return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", flexDirection: "column" }}>
      <div style={{ ...displayFont(72), color: C.gold }}>{countdown}</div>
      <div style={{ ...font(16, 500), color: "rgba(255,255,255,0.5)", marginTop: 12 }}>Get ready...</div>
    </div>
  );

  return (
    <GameChrome name="Pattern Recall" icon="🧩" color={C.aqua} round={round} totalRounds={5} score={score} timeLeft={0} maxTime={0}
      subtitle={phase === "watching" ? "Watch the pattern" : phase === "recalling" ? "Tap the tiles in order" : result ? "Nailed it!" : "Almost!"}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, width: "min(100%, 280px)", margin: "0 auto" }}>
        {Array.from({ length: 9 }, (_, i) => {
          const isLit = phase === "watching" && showIdx >= 0 && sequence[showIdx] === i;
          const isTapped = playerInput.includes(i);
          return (
            <div key={i} onClick={() => handleTap(i)} style={{
              aspectRatio: "1", borderRadius: 14, cursor: phase === "recalling" ? "pointer" : "default",
              background: isLit ? C.aqua : isTapped ? `${C.aqua}80` : "rgba(255,255,255,0.08)",
              border: `2px solid ${isLit ? C.aqua : "rgba(255,255,255,0.1)"}`,
              transform: isLit ? "scale(1.08)" : "scale(1)", transition: "all 0.2s",
              boxShadow: isLit ? `0 0 20px ${C.aqua}66` : "none"
            }} />
          );
        })}
      </div>
      {phase === "recalling" && (
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 16 }}>
          {Array.from({ length: seqLen }, (_, i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: i < playerInput.length ? C.aqua : "rgba(255,255,255,0.2)" }} />
          ))}
        </div>
      )}
      {result !== null && <div style={{ ...font(16, 600), color: result ? C.success : C.coral, textAlign: "center", marginTop: 12 }}>{result ? `✓ +${seqLen * 20 + round * 5}` : "✗ Keep going!"}</div>}
    </GameChrome>
  );
};

// ───────────────────────────────────────────────────────────
// NUMBER FLOW — fluid reasoning under time pressure.
// ───────────────────────────────────────────────────────────
const NumberFlowGame = ({ onComplete }) => {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const timerRef = useRef(null);
  const [problems] = useState(() => Array.from({ length: 8 }, (_, i) => {
    if (i % 2 === 0) {
      const start = Math.floor(Math.random() * 8) + 2, step = Math.floor(Math.random() * 4) + 2;
      const seq = Array.from({ length: 4 }, (_, j) => start + step * j), answer = start + step * 4;
      const ch = new Set([answer]); while (ch.size < 4) { const o = Math.floor(Math.random() * 5) + 1; ch.add(Math.random() > 0.5 ? answer + o : Math.max(1, answer - o)); }
      return { type: "seq", seq, answer, choices: [...ch].sort(() => Math.random() - 0.5) };
    } else {
      const a = Math.floor(Math.random() * 40) + 10, b = Math.floor(Math.random() * 20) + 5, answer = a + b;
      const ch = new Set([answer]); while (ch.size < 4) { const o = Math.floor(Math.random() * 8) + 1; ch.add(Math.random() > 0.5 ? answer + o : Math.max(1, answer - o)); }
      return { type: "eq", equation: `${a} + ${b} = ?`, answer, choices: [...ch].sort(() => Math.random() - 0.5) };
    }
  }));

  useEffect(() => {
    setTimeLeft(10); setSelected(null); clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); return 0; } return t - 1; }), 1000);
    return () => clearInterval(timerRef.current);
  }, [round]);

  const pick = (c) => {
    if (selected !== null) return; clearInterval(timerRef.current); setSelected(c);
    const pts = c === problems[round].answer ? 10 + timeLeft * 2 : 0;
    setScore(s => s + pts);
    setTimeout(() => { if (round < 7) setRound(r => r + 1); else onComplete(score + pts); }, 1000);
  };

  const p = problems[round];
  return (
    <GameChrome name="Number Flow" icon="🔢" color={C.gold} round={round + 1} totalRounds={8} score={score} timeLeft={timeLeft} maxTime={10} subtitle="Find the pattern or solve it">
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        {p.type === "seq" ? (
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {p.seq.map((n, i) => <div key={i} style={{ ...mono(24), color: "#fff", padding: "8px 12px", background: "rgba(255,255,255,0.08)", borderRadius: 10, minWidth: 44, textAlign: "center" }}>{n}</div>)}
            <div style={{ ...displayFont(26), color: C.gold, padding: "8px 12px", background: `${C.gold}26`, borderRadius: 10, border: `2px solid ${C.gold}4d`, minWidth: 44 }}>?</div>
          </div>
        ) : <div style={{ ...displayFont(30), color: "#fff" }}>{p.equation}</div>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxWidth: 300, margin: "0 auto" }}>
        {p.choices.map(c => {
          const isA = selected !== null && c === p.answer, isW = selected === c && c !== p.answer;
          return <div key={c} onClick={() => pick(c)} style={{ ...mono(22), textAlign: "center", padding: 16, borderRadius: 14, cursor: selected ? "default" : "pointer", color: isA ? C.deepNavy : "#fff", background: isA ? C.success : isW ? `${C.coral}4d` : "rgba(255,255,255,0.08)", border: `2px solid ${isA ? C.success : "transparent"}`, transition: "all 0.3s" }}>{c}</div>;
        })}
      </div>
    </GameChrome>
  );
};

// ───────────────────────────────────────────────────────────
// FOCUS GRID — selective attention / visual search.
// ───────────────────────────────────────────────────────────
const FocusGridGame = ({ onComplete }) => {
  const symSets = [{ target: "★", dist: ["●","▲","■","◆"] }, { target: "♥", dist: ["♠","♣","◆","●"] }, { target: "☾", dist: ["☀","☁","★","✦"] }];
  const [round, setRound] = useState(0);
  const [grid, setGrid] = useState([]);
  const [target, setTarget] = useState("");
  const [found, setFound] = useState(0);
  const [total, setTotal] = useState(3);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(80);
  const [roundDone, setRoundDone] = useState(false);
  const timerRef = useRef(null);

  const buildRound = useCallback((r) => {
    const sym = symSets[r % symSets.length]; const numT = Math.min(3 + Math.floor(r / 2), 6);
    setTarget(sym.target); setTotal(numT); setFound(0); setRoundDone(false); setTimeLeft(80);
    const pos = new Set(); while (pos.size < numT) pos.add(Math.floor(Math.random() * 25));
    setGrid(Array.from({ length: 25 }, (_, i) => ({ id: i, symbol: pos.has(i) ? sym.target : sym.dist[Math.floor(Math.random() * sym.dist.length)], isTarget: pos.has(i), tapped: false })));
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); setRoundDone(true); return 0; } return t - 1; }), 100);
  }, []);

  useEffect(() => { buildRound(0); return () => clearInterval(timerRef.current); }, [buildRound]);
  useEffect(() => { if (roundDone) { clearInterval(timerRef.current); setTimeout(() => { if (round + 1 < 6) { setRound(r => r + 1); buildRound(round + 1); } else onComplete(score); }, 1200); } }, [roundDone]);

  const tap = (cell) => {
    if (cell.tapped || roundDone) return;
    setGrid(g => g.map(c => c.id === cell.id ? { ...c, tapped: true } : c));
    if (cell.isTarget) { const nf = found + 1; setFound(nf); setScore(s => s + 15 + Math.floor(timeLeft / 10)); if (nf === total) setRoundDone(true); }
    else setScore(s => Math.max(0, s - 5));
  };

  return (
    <GameChrome name="Focus Grid" icon="🎯" color="#a08fc7" round={round + 1} totalRounds={6} score={score} timeLeft={timeLeft / 10} maxTime={8} subtitle={`Find all ${target} symbols`}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 16px", background: "rgba(255,255,255,0.06)", borderRadius: 12, marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ ...font(14, 600), color: "rgba(255,255,255,0.6)" }}>Find:</span><span style={{ fontSize: 26, color: C.gold }}>{target}</span></div>
        <span style={{ ...mono(16), color: "#a08fc7" }}>{found}/{total}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, maxWidth: 320, margin: "0 auto" }}>
        {grid.map(cell => (
          <div key={cell.id} onClick={() => tap(cell)} style={{
            aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, cursor: cell.tapped || roundDone ? "default" : "pointer", fontSize: 20,
            color: cell.tapped && cell.isTarget ? C.success : cell.tapped ? C.coral : roundDone && cell.isTarget && !cell.tapped ? C.gold : "rgba(255,255,255,0.7)",
            background: cell.tapped && cell.isTarget ? `${C.success}33` : cell.tapped ? `${C.coral}26` : "rgba(255,255,255,0.06)", transition: "all 0.2s"
          }}>{cell.symbol}</div>
        ))}
      </div>
    </GameChrome>
  );
};

// ───────────────────────────────────────────────────────────
// STROOP SHOWDOWN — response inhibition (Stroop, 1935).
// Tap the INK COLOR of the word, ignoring what the word says.
// Trains the prefrontal cortex to override prepotent reading
// responses. This is the gold-standard inhibition paradigm.
// ───────────────────────────────────────────────────────────
const StroopGame = ({ onComplete }) => {
  const COLORS = [
    { name: "RED",    hex: "#ff6b6b" },
    { name: "BLUE",   hex: "#5a9ee0" },
    { name: "GREEN",  hex: "#5ed3a3" },
    { name: "YELLOW", hex: "#f4c763" },
  ];
  const TOTAL = 18;
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [trials] = useState(() => Array.from({ length: TOTAL }, (_, i) => {
    // Mix congruent and incongruent (~70% incongruent for training value)
    const wordIdx = Math.floor(Math.random() * COLORS.length);
    let inkIdx;
    if (i < 3 || Math.random() < 0.3) inkIdx = wordIdx; // some congruent
    else { do { inkIdx = Math.floor(Math.random() * COLORS.length); } while (inkIdx === wordIdx); }
    return { wordIdx, inkIdx };
  }));
  const [reactionStart, setReactionStart] = useState(Date.now());
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [locked, setLocked] = useState(false);

  useEffect(() => { setReactionStart(Date.now()); setFeedback(null); setLocked(false); }, [round]);

  if (round >= TOTAL) return null;
  const trial = trials[round];
  const isCongruent = trial.wordIdx === trial.inkIdx;

  const pick = (i) => {
    if (locked) return;
    setLocked(true);
    const rt = Date.now() - reactionStart;
    const correct = i === trial.inkIdx;
    let pts = 0;
    if (correct) {
      // Speed bonus (faster than 2s = full bonus); incongruent worth more
      const speedBonus = Math.max(0, Math.round(20 - rt / 100));
      pts = 10 + speedBonus + (isCongruent ? 0 : 8);
    } else {
      pts = -5;
    }
    setScore(s => Math.max(0, s + pts));
    setFeedback(correct ? "correct" : "wrong");
    setTimeout(() => {
      if (round + 1 >= TOTAL) onComplete(score + pts);
      else setRound(r => r + 1);
    }, 600);
  };

  return (
    <GameChrome name="Stroop Showdown" icon="🎨" color={C.seagrass} round={round + 1} totalRounds={TOTAL} score={score} timeLeft={0} maxTime={0}
      subtitle="Tap the INK COLOR — ignore what the word says">
      <div style={{
        padding: "44px 24px", borderRadius: 20, marginBottom: 24,
        background: feedback === "correct" ? `${C.success}1a` : feedback === "wrong" ? `${C.coral}1a` : "rgba(255,255,255,0.06)",
        border: `2px solid ${feedback === "correct" ? C.success : feedback === "wrong" ? C.coral : "rgba(255,255,255,0.1)"}`,
        textAlign: "center", transition: "all 0.15s",
      }}>
        <div style={{
          fontFamily: "'Outfit', system-ui, sans-serif",
          fontSize: 56, fontWeight: 800, letterSpacing: 2,
          color: COLORS[trial.inkIdx].hex,
          textShadow: "0 2px 8px rgba(0,0,0,0.25)",
        }}>
          {COLORS[trial.wordIdx].name}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {COLORS.map((c, i) => (
          <div key={c.name} onClick={() => pick(i)} style={{
            padding: "18px 12px", borderRadius: 14, textAlign: "center",
            cursor: locked ? "default" : "pointer",
            background: `${c.hex}22`,
            border: `2px solid ${c.hex}88`,
            ...font(17, 700), color: "#fff",
            transition: "transform 0.1s, background 0.2s",
          }}
            onMouseDown={e => !locked && (e.currentTarget.style.transform = "scale(0.96)")}
            onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: c.hex, margin: "0 auto 6px" }} />
            {c.name}
          </div>
        ))}
      </div>
      {feedback && (
        <div style={{ ...font(14, 600), color: feedback === "correct" ? C.success : C.coral, textAlign: "center", marginTop: 14 }}>
          {feedback === "correct" ? (isCongruent ? "✓" : "✓ Inhibited!") : `✗ The ink was ${COLORS[trial.inkIdx].name}`}
        </div>
      )}
      <div style={{ ...font(11, 500), color: "rgba(255,255,255,0.35)", textAlign: "center", marginTop: 18, lineHeight: 1.4 }}>
        Inhibiting an automatic response trains the prefrontal cortex.<br/>
        Incongruent trials are worth more points.
      </div>
    </GameChrome>
  );
};

// ───────────────────────────────────────────────────────────
// WORD MAZE — verbal fluency / lexical connections.
// ───────────────────────────────────────────────────────────
const WordMazeGame = ({ onComplete }) => {
  const chains = [
    { start: "FIRE", end: "WATER", words: ["FIRE","FLAME","HEAT","STEAM","WATER"], decoys: ["SMOKE","COLD","BURN"] },
    { start: "MIND", end: "BODY", words: ["MIND","BRAIN","HEAD","NECK","BODY"], decoys: ["THOUGHT","SPINE","SKULL"] },
    { start: "SEED", end: "TREE", words: ["SEED","SPROUT","STEM","BRANCH","TREE"], decoys: ["ROOT","LEAF","BARK"] },
    { start: "IDEA", end: "PROFIT", words: ["IDEA","PLAN","ACTION","RESULT","PROFIT"], decoys: ["DREAM","HOPE","LOSS"] },
    { start: "DAWN", end: "NIGHT", words: ["DAWN","MORNING","NOON","EVENING","NIGHT"], decoys: ["SUNSET","DUSK","MIDDAY"] },
  ];
  const [round, setRound] = useState(0);
  const [chain, setChain] = useState([]);
  const [available, setAvailable] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);

  const setupRound = useCallback((r) => {
    const c = chains[r]; setChain([c.words[0]]);
    setAvailable([...c.words.slice(1), ...c.decoys].sort(() => Math.random() - 0.5));
    setDone(false); setTimeLeft(15); clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); setDone(true); return 0; } return t - 1; }), 1000);
  }, []);

  useEffect(() => { setupRound(0); return () => clearInterval(timerRef.current); }, [setupRound]);

  const pickWord = (w) => {
    if (done) return;
    const c = chains[round];
    if (w === c.words[chain.length]) {
      const nc = [...chain, w]; setChain(nc); setAvailable(a => a.filter(x => x !== w));
      const pts = 15 + timeLeft * 2; setScore(s => s + pts);
      if (nc.length === c.words.length) { clearInterval(timerRef.current); setDone(true); setTimeout(() => { if (round + 1 < 5) { setRound(r => r + 1); setupRound(round + 1); } else onComplete(score + pts); }, 1200); }
    } else { setScore(s => Math.max(0, s - 10)); }
  };

  const c = chains[round];
  return (
    <GameChrome name="Word Maze" icon="🔤" color={C.coral} round={round + 1} totalRounds={5} score={score} timeLeft={timeLeft} maxTime={15} subtitle={`Build: ${c.start} → ${c.end}`}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", padding: 12, background: "rgba(255,255,255,0.06)", borderRadius: 14, marginBottom: 14, minHeight: 60, alignItems: "center" }}>
        {chain.map((w, i) => (
          <div key={i} style={{ ...font(14, 700), color: C.success, padding: "8px 14px", background: `${C.success}26`, borderRadius: 10, border: `1.5px solid ${C.success}66` }}>{w}</div>
        ))}
        {chain.length < c.words.length && <div style={{ ...font(14, 600), color: C.gold, opacity: 0.7 }}>→ ?</div>}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
        {available.map(w => (
          <div key={w} onClick={() => pickWord(w)} style={{ ...font(14, 600), color: "#fff", padding: "10px 18px", background: "rgba(255,255,255,0.1)", borderRadius: 12, cursor: "pointer", border: "1.5px solid rgba(255,255,255,0.15)", transition: "all 0.2s" }}>{w}</div>
        ))}
      </div>
      {done && <div style={{ textAlign: "center", marginTop: 16, ...font(16, 600), color: C.success }}>Chain complete!</div>}
    </GameChrome>
  );
};

// ───────────────────────────────────────────────────────────
// REEF CROSSING — river-crossing planning paradigm.
// Ferry sea creatures across a deep trench in a shuttle that
// holds only 2 at a time (you + 1 creature). Some creatures
// will eat others if left alone together without you watching.
//
// This is the classic "Missionaries and Cannibals" / "Fox,
// Goose, Grain" planning puzzle. It exercises:
//   - Planning: think 3+ moves ahead
//   - Working memory: track current state + rules
//   - Inhibition: suppress the obvious-but-wrong move
//   - Flexibility: backtrack when stuck (you sometimes have
//     to bring a creature BACK to make progress)
// ───────────────────────────────────────────────────────────
const ReefCrossingGame = ({ onComplete }) => {
  // Each puzzle: creatures with their visuals, and predator->prey rules.
  // "eats" = if both are on a bank without YOU, the first eats the second.
  const PUZZLES = [
    {
      name: "The Trench",
      creatures: [
        { id: "shark", label: "Shark", component: Hammerhead, scale: 0.55 },
        { id: "fish",  label: "Fish",  component: Clownfish,  scale: 0.65 },
        { id: "kelp",  label: "Kelp",  emoji: "🌿" },
      ],
      // Predator -> prey constraints
      eats: [["shark", "fish"], ["fish", "kelp"]],
      optimal: 7,
      hint: "Classic puzzle — only the fish can't be left alone with either neighbor.",
    },
    {
      name: "The Drift",
      creatures: [
        { id: "orca",     label: "Orca",     component: OrcaWhale, scale: 0.5 },
        { id: "seal",     label: "Seal",     component: SeaTurtle, scale: 0.55 }, // proxy visual
        { id: "squid",    label: "Squid",    component: GiantSquid, scale: 0.5 },
        { id: "fish",     label: "Fish",     component: Clownfish, scale: 0.6 },
      ],
      eats: [["orca", "seal"], ["seal", "squid"], ["squid", "fish"]],
      optimal: 9,
      hint: "A longer chain — three predator-prey pairs.",
    },
  ];

  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const puzzle = PUZZLES[puzzleIdx];
  const [leftBank, setLeftBank] = useState(puzzle.creatures.map(c => c.id));
  const [rightBank, setRightBank] = useState([]);
  const [shuttle, setShuttle] = useState([]); // up to 1 passenger (+ you)
  const [shuttleSide, setShuttleSide] = useState("left");
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState("playing"); // 'playing' | 'eaten' | 'solved'
  const [eatenMsg, setEatenMsg] = useState("");
  const [hintOpen, setHintOpen] = useState(false);

  // Reset state when puzzle changes
  useEffect(() => {
    setLeftBank(puzzle.creatures.map(c => c.id));
    setRightBank([]);
    setShuttle([]);
    setShuttleSide("left");
    setMoves(0); setPhase("playing"); setEatenMsg("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzleIdx]);

  const getCreature = (id) => puzzle.creatures.find(c => c.id === id);
  const renderCreatureIcon = (id, size = 56) => {
    const c = getCreature(id);
    if (!c) return null;
    if (c.emoji) return <span style={{ fontSize: size * 0.75 }}>{c.emoji}</span>;
    const Comp = c.component;
    return <Comp size={size} />;
  };

  // Check whether a bank (without you) has any predator+prey pair
  const checkSafety = (bank) => {
    for (const [pred, prey] of puzzle.eats) {
      if (bank.includes(pred) && bank.includes(prey)) {
        return { safe: false, pred, prey };
      }
    }
    return { safe: true };
  };

  // Player taps a creature on the active bank — load into shuttle
  const tapCreatureOnBank = (id, side) => {
    if (phase !== "playing") return;
    if (side !== shuttleSide) return; // shuttle isn't here
    if (shuttle.length >= 1) return;   // shuttle full
    if (side === "left") setLeftBank(b => b.filter(x => x !== id));
    else setRightBank(b => b.filter(x => x !== id));
    setShuttle([id]);
  };

  // Player taps the passenger in the shuttle — unload to current bank
  const unloadShuttle = (id) => {
    if (phase !== "playing") return;
    setShuttle(s => s.filter(x => x !== id));
    if (shuttleSide === "left") setLeftBank(b => [...b, id]);
    else setRightBank(b => [...b, id]);
  };

  // Cross the trench
  const cross = () => {
    if (phase !== "playing") return;
    const newSide = shuttleSide === "left" ? "right" : "left";
    setShuttleSide(newSide);
    setMoves(m => m + 1);

    // After crossing, the bank YOU JUST LEFT is unsupervised.
    // The shuttle still has its passengers; the "left behind" bank
    // is the one you're leaving (i.e. the previous shuttleSide).
    const leftBehind = shuttleSide === "left" ? leftBank : rightBank;
    const safety = checkSafety(leftBehind);
    if (!safety.safe) {
      const predName = getCreature(safety.pred).label;
      const preyName = getCreature(safety.prey).label;
      setEatenMsg(`The ${predName} ate the ${preyName}!`);
      setPhase("eaten");
    }
    // Win detection runs in the useEffect below.
  };

  // Win detection (clean recompute): every time state changes, check
  useEffect(() => {
    if (phase !== "playing") return;
    if (
      shuttleSide === "right" &&
      shuttle.length === 0 &&
      leftBank.length === 0 &&
      rightBank.length === puzzle.creatures.length
    ) {
      triggerWin(moves);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftBank, rightBank, shuttle, shuttleSide]);

  const triggerWin = (movesUsed) => {
    const eff = Math.max(0.35, puzzle.optimal / Math.max(movesUsed, puzzle.optimal));
    const pts = Math.round((60 + puzzle.optimal * 10) * eff);
    setScore(s => s + pts);
    setPhase("solved");
    setTimeout(() => {
      if (puzzleIdx + 1 >= PUZZLES.length) onComplete(score + pts);
      else setPuzzleIdx(p => p + 1);
    }, 1900);
  };

  const reset = () => {
    if (phase === "solved") return;
    setLeftBank(puzzle.creatures.map(c => c.id));
    setRightBank([]); setShuttle([]); setShuttleSide("left");
    setMoves(0); setPhase("playing"); setEatenMsg("");
  };

  const subtitle = phase === "eaten" ? eatenMsg
    : phase === "solved" ? `Solved in ${moves} moves!`
    : `Get them all across — shuttle holds 1 + you`;

  return (
    <GameChrome name="Reef Crossing" icon="🛥️" color="#e4925a"
      round={puzzleIdx + 1} totalRounds={PUZZLES.length}
      score={score} timeLeft={0} maxTime={0} subtitle={subtitle}>

      {/* Optimal target + reset */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, padding: "0 2px" }}>
        <div style={{ ...font(12, 600), color: "rgba(255,255,255,0.65)" }}>
          Moves: <span style={{ ...mono(14), color: moves <= puzzle.optimal ? C.success : moves <= puzzle.optimal + 2 ? C.gold : C.coral }}>{moves}</span>
          <span style={{ ...font(11), color: "rgba(255,255,255,0.35)" }}> · optimal {puzzle.optimal}</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <div onClick={() => setHintOpen(o => !o)}
            style={{ ...font(11, 600), color: C.aqua, padding: "4px 10px", background: `${C.aqua}1a`, borderRadius: 8, cursor: "pointer" }}>
            {hintOpen ? "Hide rules" : "Show rules"}
          </div>
          <div onClick={reset}
            style={{ ...font(11, 600), color: C.coral, padding: "4px 10px", background: `${C.coral}1a`, borderRadius: 8, cursor: "pointer" }}>↺ Reset</div>
        </div>
      </div>

      {hintOpen && (
        <div style={{ padding: 10, background: "rgba(255,255,255,0.05)", borderRadius: 10, marginBottom: 10, ...font(12), color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>
          {puzzle.hint}<br/>
          <span style={{ color: "rgba(255,255,255,0.6)" }}>If you leave a bank, these can't be alone together:</span>
          <div style={{ marginTop: 4, display: "flex", flexWrap: "wrap", gap: 6 }}>
            {puzzle.eats.map(([p, q], i) => (
              <span key={i} style={{ ...font(11, 600), color: C.coral, padding: "2px 8px", background: `${C.coral}1a`, borderRadius: 8 }}>
                {getCreature(p).label} → {getCreature(q).label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* The scene */}
      <div style={{
        position: "relative",
        background: `linear-gradient(180deg, ${C.ocean}, ${C.midnight})`,
        borderRadius: 16, padding: "16px 10px 10px", minHeight: 260,
        border: "1px solid rgba(255,255,255,0.08)",
      }}>
        {/* Banks layout: LEFT bank — trench — RIGHT bank in a row */}
        <div style={{ display: "flex", alignItems: "stretch", gap: 8 }}>
          {/* LEFT bank */}
          <div style={{
            flex: 1, padding: 10, borderRadius: 12,
            background: shuttleSide === "left" ? `${C.gold}1a` : "rgba(255,255,255,0.04)",
            border: `1.5px dashed ${shuttleSide === "left" ? C.gold + "88" : "rgba(255,255,255,0.15)"}`,
            minHeight: 200, display: "flex", flexDirection: "column",
          }}>
            <div style={{ ...font(10, 700), color: "rgba(255,255,255,0.6)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, textAlign: "center" }}>
              This Side
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, alignItems: "center", justifyContent: "center" }}>
              {leftBank.map(id => {
                const c = getCreature(id);
                return (
                  <div key={id} onClick={() => tapCreatureOnBank(id, "left")} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "4px 8px", background: "rgba(255,255,255,0.08)",
                    borderRadius: 8, cursor: shuttleSide === "left" && shuttle.length === 0 && phase === "playing" ? "pointer" : "default",
                    opacity: shuttleSide === "left" && shuttle.length === 0 && phase === "playing" ? 1 : 0.7,
                    transition: "transform 0.15s, opacity 0.2s",
                  }}
                    onMouseDown={e => shuttleSide === "left" && shuttle.length === 0 && phase === "playing" && (e.currentTarget.style.transform = "scale(0.95)")}
                    onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    {renderCreatureIcon(id, 36)}
                    <span style={{ ...font(11, 600), color: "#fff" }}>{c.label}</span>
                  </div>
                );
              })}
              {leftBank.length === 0 && <div style={{ ...font(11), color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>empty</div>}
            </div>
          </div>

          {/* TRENCH + shuttle */}
          <div style={{
            width: 90, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "8px 0", position: "relative",
          }}>
            <div style={{ ...font(10, 700), color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase" }}>Trench</div>
            {/* Shuttle */}
            <div style={{
              width: 70, padding: "10px 6px", borderRadius: 12,
              background: phase === "eaten" ? `${C.coral}33` : `${C.aqua}33`,
              border: `2px solid ${phase === "eaten" ? C.coral : C.aqua}`,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              transform: `translateX(${shuttleSide === "right" ? "0" : "0"})`,
              transition: "transform 0.4s",
              boxShadow: `0 0 16px ${phase === "eaten" ? C.coral : C.aqua}66`,
            }}>
              <div style={{ ...font(11, 700), color: "#fff", marginBottom: 2 }}>🤿 You</div>
              {shuttle.length > 0 ? (
                <div onClick={() => unloadShuttle(shuttle[0])} style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  cursor: phase === "playing" ? "pointer" : "default",
                  padding: 4, background: "rgba(255,255,255,0.15)", borderRadius: 8,
                }}>
                  {renderCreatureIcon(shuttle[0], 36)}
                  <span style={{ ...font(10, 600), color: "#fff" }}>{getCreature(shuttle[0]).label}</span>
                </div>
              ) : (
                <div style={{ ...font(10), color: "rgba(255,255,255,0.5)", fontStyle: "italic", padding: "8px 0" }}>empty</div>
              )}
            </div>
            <div style={{ ...font(9, 600), color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: 1 }}>
              {shuttleSide === "left" ? "← here" : "here →"}
            </div>
          </div>

          {/* RIGHT bank */}
          <div style={{
            flex: 1, padding: 10, borderRadius: 12,
            background: shuttleSide === "right" ? `${C.gold}1a` : "rgba(255,255,255,0.04)",
            border: `1.5px dashed ${shuttleSide === "right" ? C.gold + "88" : "rgba(255,255,255,0.15)"}`,
            minHeight: 200, display: "flex", flexDirection: "column",
          }}>
            <div style={{ ...font(10, 700), color: "rgba(255,255,255,0.6)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, textAlign: "center" }}>
              Goal Side
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, alignItems: "center", justifyContent: "center" }}>
              {rightBank.map(id => {
                const c = getCreature(id);
                return (
                  <div key={id} onClick={() => tapCreatureOnBank(id, "right")} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "4px 8px", background: "rgba(255,255,255,0.08)",
                    borderRadius: 8, cursor: shuttleSide === "right" && shuttle.length === 0 && phase === "playing" ? "pointer" : "default",
                    opacity: shuttleSide === "right" && shuttle.length === 0 && phase === "playing" ? 1 : 0.7,
                    transition: "transform 0.15s, opacity 0.2s",
                  }}
                    onMouseDown={e => shuttleSide === "right" && shuttle.length === 0 && phase === "playing" && (e.currentTarget.style.transform = "scale(0.95)")}
                    onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    {renderCreatureIcon(id, 36)}
                    <span style={{ ...font(11, 600), color: "#fff" }}>{c.label}</span>
                  </div>
                );
              })}
              {rightBank.length === 0 && <div style={{ ...font(11), color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>empty</div>}
            </div>
          </div>
        </div>

        {/* Cross button */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
          <div onClick={cross} style={{
            ...font(14, 700), color: phase === "playing" ? C.deepNavy : "rgba(255,255,255,0.5)",
            padding: "10px 28px", borderRadius: 12,
            background: phase === "playing" ? C.aqua : "rgba(255,255,255,0.1)",
            cursor: phase === "playing" ? "pointer" : "default",
            boxShadow: phase === "playing" ? `0 0 12px ${C.aqua}66` : "none",
            transition: "all 0.2s",
          }}
            onMouseDown={e => phase === "playing" && (e.currentTarget.style.transform = "scale(0.96)")}
            onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            {shuttleSide === "left" ? "Cross → " : "← Cross"} {shuttle.length > 0 ? `(with ${getCreature(shuttle[0]).label})` : "(alone)"}
          </div>
        </div>
      </div>

      {/* Outcome banner */}
      {phase === "eaten" && (
        <div style={{ marginTop: 12, padding: 12, background: `${C.coral}1a`, borderRadius: 12, border: `1px solid ${C.coral}66`, textAlign: "center" }}>
          <div style={{ ...font(14, 700), color: C.coral, marginBottom: 6 }}>✗ {eatenMsg}</div>
          <div style={{ ...font(12, 500), color: "rgba(255,255,255,0.7)", marginBottom: 8 }}>Plan further ahead — sometimes you need to bring someone BACK.</div>
          <div onClick={reset} style={{ display: "inline-block", ...font(13, 700), color: "#fff", padding: "6px 16px", background: C.coral, borderRadius: 8, cursor: "pointer" }}>Try Again</div>
        </div>
      )}
      {phase === "solved" && (
        <div style={{ marginTop: 12, padding: 12, background: `${C.success}1a`, borderRadius: 12, border: `1px solid ${C.success}66`, textAlign: "center" }}>
          <div style={{ ...font(15, 700), color: C.success }}>✓ Everyone across safely!</div>
          {moves <= puzzle.optimal && <div style={{ ...font(12, 600), color: C.gold, marginTop: 4 }}>★ Optimal solution!</div>}
        </div>
      )}

      <div style={{ ...font(11, 500), color: "rgba(255,255,255,0.35)", textAlign: "center", marginTop: 14, lineHeight: 1.5 }}>
        Tap a creature on the bank to load into your shuttle. Then tap "Cross."<br/>
        The shuttle needs you to move — leave nothing dangerous alone.
      </div>
    </GameChrome>
  );
};

// ───────────────────────────────────────────────────────────
// DUAL N-BACK — working memory updating (Jaeggi 2008).
// ───────────────────────────────────────────────────────────
const DualNBackGame = ({ onComplete }) => {
  const colors = [C.aqua, C.coral, C.gold, "#a08fc7", C.seagrass, C.shallow];
  const nBack = 2;
  const totalTrials = 20;
  const [trial, setTrial] = useState(0);
  const [currentPos, setCurrentPos] = useState(-1);
  const [currentColor, setCurrentColor] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState("show");
  const [posMatch, setPosMatch] = useState(false);
  const [colorMatch, setColorMatch] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [responded, setResponded] = useState(false);
  const seqRef = useRef([]);

  const showTrial = useCallback((t, seq) => {
    if (t >= totalTrials) { onComplete(score); return; }
    setTrial(t); setCurrentPos(seq[t].pos); setCurrentColor(seq[t].col);
    setPhase("show"); setPosMatch(false); setColorMatch(false); setResponded(false); setFeedback(null);
    setTimeout(() => setPhase("respond"), 1500);
  }, [score, onComplete]);

  useEffect(() => {
    const seq = [];
    for (let i = 0; i < totalTrials; i++) {
      let pos = Math.floor(Math.random() * 9), col = Math.floor(Math.random() * colors.length);
      if (i >= nBack && Math.random() < 0.3) pos = seq[i - nBack].pos;
      if (i >= nBack && Math.random() < 0.3) col = seq[i - nBack].col;
      seq.push({ pos, col });
    }
    seqRef.current = seq; showTrial(0, seq);
    // eslint-disable-next-line
  }, []);

  const submit = useCallback(() => {
    if (responded) return;
    setResponded(true);
    const seq = seqRef.current; const t = trial;
    const aPM = t >= nBack && seq[t].pos === seq[t - nBack].pos;
    const aCM = t >= nBack && seq[t].col === seq[t - nBack].col;
    const pC = posMatch === aPM, cC = colorMatch === aCM;
    const pts = (pC ? 10 : 0) + (cC ? 10 : 0);
    setScore(s => s + pts); setFeedback({ posCorrect: pC, colCorrect: cC, pts });
    setTimeout(() => showTrial(t + 1, seq), 1200);
  }, [responded, trial, posMatch, colorMatch, showTrial]);

  useEffect(() => {
    if (phase === "respond" && !responded) { const t = setTimeout(() => submit(), 3000); return () => clearTimeout(t); }
  }, [phase, responded, submit]);

  return (
    <GameChrome name="Dual N-Back" icon="🔁" color={C.shallow} round={trial + 1} totalRounds={totalTrials} score={score} timeLeft={0} maxTime={0} subtitle={`Match position OR color from ${nBack} steps ago`}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, width: "min(100%, 240px)", margin: "0 auto 16px" }}>
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} style={{ aspectRatio: "1", borderRadius: 12, background: i === currentPos && phase === "show" ? colors[currentColor] : "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", transition: "all 0.3s", boxShadow: i === currentPos && phase === "show" ? `0 0 20px ${colors[currentColor]}66` : "none" }} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 12 }}>
        <div onClick={() => !responded && setPosMatch(p => !p)} style={{ padding: "12px 16px", borderRadius: 12, cursor: responded ? "default" : "pointer", background: posMatch ? `${C.shallow}66` : "rgba(255,255,255,0.06)", border: `2px solid ${posMatch ? C.shallow : "rgba(255,255,255,0.1)"}`, ...font(13, 600), color: posMatch ? "#fff" : "rgba(255,255,255,0.6)" }}>📍 Position</div>
        <div onClick={() => !responded && setColorMatch(c => !c)} style={{ padding: "12px 16px", borderRadius: 12, cursor: responded ? "default" : "pointer", background: colorMatch ? `${C.coral}66` : "rgba(255,255,255,0.06)", border: `2px solid ${colorMatch ? C.coral : "rgba(255,255,255,0.1)"}`, ...font(13, 600), color: colorMatch ? "#fff" : "rgba(255,255,255,0.6)" }}>🎨 Color</div>
      </div>
      {phase === "respond" && !responded && <Btn onClick={submit} style={{ maxWidth: 200, margin: "0 auto", padding: "10px 24px" }}>Confirm</Btn>}
      {feedback && (
        <div style={{ textAlign: "center", marginTop: 8, display: "flex", gap: 12, justifyContent: "center" }}>
          <span style={{ ...font(14, 600), color: feedback.posCorrect ? C.success : C.coral }}>Pos: {feedback.posCorrect ? "✓" : "✗"}</span>
          <span style={{ ...font(14, 600), color: feedback.colCorrect ? C.success : C.coral }}>Color: {feedback.colCorrect ? "✓" : "✗"}</span>
          <span style={{ ...mono(14), color: C.gold }}>+{feedback.pts}</span>
        </div>
      )}
      <div style={{ ...font(12, 500), color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: 12 }}>Toggle matches, then confirm</div>
    </GameChrome>
  );
};

// ───────────────────────────────────────────────────────────
// RULE SHIFT — cognitive flexibility / set-shifting.
// Inspired by the Wisconsin Card Sorting Test (Berg, 1948).
// Cards vary on three dimensions: COLOR, SHAPE, COUNT.
// You sort by a hidden rule. Get feedback after each card.
// After several correct, the rule silently changes — you must
// detect this and adapt. The classic flexibility paradigm.
// ───────────────────────────────────────────────────────────
const RuleShiftGame = ({ onComplete }) => {
  const COLORS = [
    { name: "red", hex: "#ff6b6b" },
    { name: "blue", hex: "#5a9ee0" },
    { name: "green", hex: "#5ed3a3" },
    { name: "gold", hex: "#f4c763" },
  ];
  const SHAPES = ["circle", "triangle", "square", "star"];
  const RULES = ["color", "shape", "count"];
  const TOTAL = 20;

  const buildCard = () => ({
    color: Math.floor(Math.random() * 4),
    shape: Math.floor(Math.random() * 4),
    count: Math.floor(Math.random() * 4) + 1,
  });

  // Generate "category" reference cards covering all dimensions
  const refCards = useMemo(() => [
    { color: 0, shape: 0, count: 1 }, // red, circle, 1
    { color: 1, shape: 1, count: 2 }, // blue, triangle, 2
    { color: 2, shape: 2, count: 3 }, // green, square, 3
    { color: 3, shape: 3, count: 4 }, // gold, star, 4
  ], []);

  const [trial, setTrial] = useState(0);
  const [score, setScore] = useState(0);
  const [card, setCard] = useState(buildCard);
  const [currentRule, setCurrentRule] = useState(() => RULES[Math.floor(Math.random() * 3)]);
  const [streak, setStreak] = useState(0); // consecutive correct under current rule
  const [feedback, setFeedback] = useState(null);
  const [locked, setLocked] = useState(false);
  const [ruleChanged, setRuleChanged] = useState(false);

  const correctRefIdx = (c, rule) => {
    if (rule === "color") return c.color;
    if (rule === "shape") return c.shape;
    return c.count - 1;
  };

  const tap = (idx) => {
    if (locked) return;
    setLocked(true);
    const correctIdx = correctRefIdx(card, currentRule);
    const correct = idx === correctIdx;
    let pts = correct ? 12 : -4;
    if (correct && ruleChanged) { pts += 8; setRuleChanged(false); } // bonus for catching the shift
    setScore(s => Math.max(0, s + pts));
    setFeedback(correct ? "correct" : "wrong");
    const newStreak = correct ? streak + 1 : 0;
    setStreak(newStreak);
    setTimeout(() => {
      // After 4-6 in a row, silently shift the rule
      if (newStreak >= 4 + Math.floor(Math.random() * 3)) {
        const others = RULES.filter(r => r !== currentRule);
        setCurrentRule(others[Math.floor(Math.random() * others.length)]);
        setStreak(0); setRuleChanged(true);
      }
      if (trial + 1 >= TOTAL) { onComplete(score + pts); return; }
      setTrial(t => t + 1); setCard(buildCard()); setFeedback(null); setLocked(false);
    }, 700);
  };

  // SVG shape renderer
  const renderShape = (shapeIdx, color, size) => {
    const c = COLORS[color].hex;
    if (shapeIdx === 0) return <circle cx={size/2} cy={size/2} r={size/2 - 2} fill={c} />;
    if (shapeIdx === 1) return <polygon points={`${size/2},2 ${size-2},${size-3} 2,${size-3}`} fill={c} />;
    if (shapeIdx === 2) return <rect x="2" y="2" width={size-4} height={size-4} rx="2" fill={c} />;
    // star
    const cx = size/2, cy = size/2, r1 = size/2 - 2, r2 = r1 * 0.45;
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const a = (Math.PI / 5) * i - Math.PI / 2;
      const r = i % 2 === 0 ? r1 : r2;
      pts.push(`${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`);
    }
    return <polygon points={pts.join(" ")} fill={c} />;
  };

  const renderCard = (c, big = false) => {
    const sz = big ? 36 : 22;
    const shapes = Array.from({ length: c.count });
    return (
      <div style={{
        background: "rgba(255,255,255,0.95)", borderRadius: 12,
        padding: big ? 12 : 8, width: big ? 132 : 72, height: big ? 132 : 72,
        display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center",
        gap: big ? 4 : 2, border: "2px solid rgba(255,255,255,0.3)",
      }}>
        {shapes.map((_, i) => (
          <svg key={i} width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`}>{renderShape(c.shape, c.color, sz)}</svg>
        ))}
      </div>
    );
  };

  return (
    <GameChrome name="Rule Shift" icon="🔀" color="#e8c75c" round={trial + 1} totalRounds={TOTAL} score={score} timeLeft={0} maxTime={0}
      subtitle="Sort by the hidden rule — it will change">
      {/* Reference cards */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 18 }}>
        {refCards.map((rc, i) => (
          <div key={i} onClick={() => tap(i)} style={{
            cursor: locked ? "default" : "pointer",
            opacity: feedback && correctRefIdx(card, currentRule) === i ? 1 : feedback ? 0.4 : 1,
            transform: feedback === "correct" && correctRefIdx(card, currentRule) === i ? "scale(1.08)" : "scale(1)",
            transition: "all 0.25s",
          }}
            onMouseDown={e => !locked && (e.currentTarget.style.transform = "scale(0.94)")}
            onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            {renderCard(rc)}
          </div>
        ))}
      </div>
      <div style={{ ...font(12, 600), color: "rgba(255,255,255,0.5)", textAlign: "center", marginBottom: 8 }}>
        Match this card to one above:
      </div>
      {/* Active card */}
      <div style={{
        display: "flex", justifyContent: "center", marginBottom: 14,
        opacity: feedback ? 0.6 : 1, transition: "opacity 0.2s",
      }}>{renderCard(card, true)}</div>
      {feedback && (
        <div style={{ ...font(15, 600), color: feedback === "correct" ? C.success : C.coral, textAlign: "center" }}>
          {feedback === "correct" ? `✓ Correct${ruleChanged ? " — rule change caught!" : ""}` : "✗ Try a different dimension"}
        </div>
      )}
      <div style={{ ...font(11, 500), color: "rgba(255,255,255,0.35)", textAlign: "center", marginTop: 16, lineHeight: 1.5 }}>
        Color, shape, or count — only one rule is right.<br/>
        When you stop getting "correct," the rule has shifted.
      </div>
    </GameChrome>
  );
};

const GAME_COMPONENTS = {
  pattern: PatternRecallGame,
  number: NumberFlowGame,
  focus: FocusGridGame,
  stroop: StroopGame,
  wordmaze: WordMazeGame,
  bridge: ReefCrossingGame,
  dualn: DualNBackGame,
  ruleshift: RuleShiftGame,
};

// ═══════════════════════════════════════════════════════════
// CREATURE UNLOCK CELEBRATION
// Shown when a daily dive is completed and a new creature is revealed.
// ═══════════════════════════════════════════════════════════
const CreatureUnlockView = ({ creature, stage, onClose, isLast = false }) => {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 200); }, []);
  const rarityColor = RARITY_COLORS[creature.rarity] || C.aqua;

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: `linear-gradient(180deg, ${stage.bg[0]}, ${stage.bg[1]})`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 24, textAlign: "center", overflow: "hidden", zIndex: 100,
    }}>
      <Bubbles count={20} opacity={0.4} />
      <Caustics />
      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ ...font(13, 700), color: "rgba(255,255,255,0.85)", letterSpacing: 3, textTransform: "uppercase", opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(-10px)", transition: "all 0.5s" }}>
          ✨ New Discovery ✨
        </div>
        <div style={{
          marginTop: 24, padding: 24, borderRadius: 28,
          background: "rgba(255,255,255,0.15)",
          border: `3px solid ${rarityColor}`,
          boxShadow: `0 0 60px ${rarityColor}88, inset 0 0 30px rgba(255,255,255,0.1)`,
          opacity: show ? 1 : 0,
          transform: show ? "scale(1)" : "scale(0.3)",
          transition: "all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}>
          {renderCreature(creature.id, 180)}
        </div>
        <div style={{
          ...displayFont(30), color: "#fff", marginTop: 20,
          opacity: show ? 1 : 0, transition: "opacity 0.6s 0.4s",
          textShadow: "0 2px 8px rgba(0,0,0,0.3)"
        }}>{creature.name}</div>
        <div style={{
          marginTop: 6, padding: "4px 14px", borderRadius: 20,
          background: rarityColor, color: "#fff",
          ...font(13, 700), letterSpacing: 1, textTransform: "uppercase",
          opacity: show ? 1 : 0, transition: "opacity 0.6s 0.5s",
        }}>{creature.rarity}</div>
        <p style={{
          ...font(15), color: "rgba(255,255,255,0.9)", maxWidth: 320,
          marginTop: 16, lineHeight: 1.5,
          opacity: show ? 1 : 0, transition: "opacity 0.6s 0.6s",
        }}>{creature.fact}</p>
        <div style={{ marginTop: 28, width: "100%", maxWidth: 300, opacity: show ? 1 : 0, transition: "opacity 0.6s 0.7s" }}>
          <Btn onClick={onClose} color="#fff" textColor={C.deepNavy}>
            {isLast ? "Continue Journey →" : "Next Discovery →"}
          </Btn>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// DAILY DIVE (workout) — completing this unlocks the next stage
// ═══════════════════════════════════════════════════════════
const DailyDiveView = ({ onClose, onDiveComplete, stage }) => {
  const [phase, setPhase] = useState("intro");
  const [gameIdx, setGameIdx] = useState(0);
  const [scores, setScores] = useState([]);
  const [todayGames] = useState(() => [...GAMES].sort(() => Math.random() - 0.5).slice(0, 4));
  const [unlockIdx, setUnlockIdx] = useState(0);

  const handleGameDone = (s) => {
    const ns = [...scores, s]; setScores(ns);
    if (gameIdx < todayGames.length - 1) setGameIdx(gameIdx + 1);
    else setPhase("summary");
  };
  const totalScore = scores.reduce((a, b) => a + b, 0);
  const xp = Math.floor(totalScore * 0.4) + 50;

  // Intro screen — show what you're diving for
  if (phase === "intro") return (
    <div style={{ height: "100%", background: `linear-gradient(180deg, ${stage.bg[0]}, ${stage.bg[1]})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center", position: "relative", overflow: "hidden" }}>
      <Bubbles count={12} opacity={0.3} />
      <Caustics />
      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", maxHeight: "100%", overflow: "auto", padding: "20px 0" }}>
        <div style={{ ...font(11, 700), color: stage.textColor, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6, opacity: 0.85 }}>Stage {stage.id} · {stage.depth}</div>
        <div style={{ ...displayFont(30), color: stage.textColor, marginBottom: 8 }}>{stage.name}</div>
        <div style={{ ...font(15), color: stage.textColor, opacity: 0.82, maxWidth: 320, marginBottom: 20, lineHeight: 1.5 }}>{stage.desc}</div>
        {stage.creatures.length > 0 && (
          <div style={{ padding: "12px 20px", background: "rgba(0,0,0,0.2)", borderRadius: 14, marginBottom: 18, backdropFilter: "blur(6px)" }}>
            <div style={{ ...font(12, 700), color: "#fff", opacity: 0.85, marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>Complete the dive to unlock</div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              {stage.creatures.map((c, i) => (
                <div key={c.id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: 12,
                    background: "rgba(255,255,255,0.08)",
                    border: "2px dashed rgba(255,255,255,0.35)",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
                  }}>
                    <div style={{ fontSize: 22 }}>🔒</div>
                    <div style={{ ...displayFont(16), color: "rgba(255,255,255,0.7)" }}>?</div>
                  </div>
                  <div style={{ ...font(10, 700), color: "#fff", opacity: 0.7, marginTop: 4, letterSpacing: 1 }}>UNKNOWN</div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div style={{ ...font(14, 600), color: "#fff", opacity: 0.85, marginBottom: 12 }}>{todayGames.length} games · ~8 minutes</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 280, marginBottom: 20 }}>
          {todayGames.map((g, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 14px", background: "rgba(255,255,255,0.18)", borderRadius: 12 }}>
              <span style={{ fontSize: 20 }}>{g.icon}</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ ...font(14, 600), color: "#fff" }}>{g.name}</div>
                <div style={{ ...font(11, 500), color: "rgba(255,255,255,0.7)" }}>{g.skill}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ width: "100%", maxWidth: 280 }}>
          <Btn onClick={() => setPhase("playing")} color="#fff" textColor={C.deepNavy}>Begin Dive 🤿</Btn>
          <div onClick={onClose} style={{ ...font(14, 500), color: "rgba(255,255,255,0.8)", marginTop: 14, cursor: "pointer", padding: 8 }}>Maybe Later</div>
        </div>
      </div>
    </div>
  );

  // Game playing
  if (phase === "playing") {
    const Comp = GAME_COMPONENTS[todayGames[gameIdx].id];
    return (
      <div style={{ height: "100%", background: C.deepNavy, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", gap: 4, padding: "12px 20px" }}>
          {todayGames.map((_, i) => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < gameIdx ? C.success : i === gameIdx ? C.aqua : "rgba(255,255,255,0.15)" }} />)}
        </div>
        <div style={{ ...mono(13), color: "rgba(255,255,255,0.5)", textAlign: "center", marginBottom: 4 }}>Game {gameIdx + 1}/{todayGames.length}</div>
        <div style={{ flex: 1, overflow: "auto" }}><Comp key={gameIdx} onComplete={handleGameDone} /></div>
      </div>
    );
  }

  // Summary
  if (phase === "summary") return (
    <div style={{ height: "100%", background: `linear-gradient(180deg, ${stage.bg[0]}, ${stage.bg[1]})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, position: "relative", overflow: "hidden" }}>
      <Bubbles count={16} opacity={0.4} />
      <Caustics />
      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ ...displayFont(32), color: "#fff", marginBottom: 8, textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>Dive Complete! 🌊</div>
        <div style={{ ...font(15), color: "rgba(255,255,255,0.85)", marginBottom: 24 }}>You've passed through {stage.name}</div>
        <div style={{ display: "flex", gap: 24, marginBottom: 24, padding: "16px 24px", background: "rgba(0,0,0,0.2)", borderRadius: 16, backdropFilter: "blur(6px)" }}>
          <div style={{ textAlign: "center" }}><div style={{ ...displayFont(28), color: C.gold }}>{totalScore}</div><div style={{ ...font(11, 600), color: "rgba(255,255,255,0.7)" }}>Total Score</div></div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.2)" }} />
          <div style={{ textAlign: "center" }}><div style={{ ...displayFont(28), color: C.aqua }}>+{xp}</div><div style={{ ...font(11, 600), color: "rgba(255,255,255,0.7)" }}>XP Earned</div></div>
        </div>
        <div style={{ width: "100%", maxWidth: 300, marginBottom: 20 }}>
          {todayGames.map((g, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
              <span style={{ ...font(15), color: "rgba(255,255,255,0.95)" }}>{g.icon} {g.name}</span>
              <span style={{ ...mono(15), color: "#fff" }}>{scores[i] || 0}</span>
            </div>
          ))}
        </div>
        <div style={{ width: "100%", maxWidth: 280 }}>
          <Btn onClick={() => {
            // If there are creatures to reveal, go to unlock phase
            if (stage.creatures.length > 0) { setUnlockIdx(0); setPhase("unlock"); }
            else { onDiveComplete({ xp, score: totalScore, creatures: [] }); }
          }} color="#fff" textColor={C.deepNavy}>
            {stage.creatures.length > 0 ? `Reveal Discoveries 🐠` : `Continue Journey →`}
          </Btn>
        </div>
      </div>
    </div>
  );

  // Unlock — reveal creatures one by one
  if (phase === "unlock") {
    const creature = stage.creatures[unlockIdx];
    const isLast = unlockIdx >= stage.creatures.length - 1;
    return (
      <CreatureUnlockView
        key={unlockIdx}
        creature={creature}
        stage={stage}
        isLast={isLast}
        onClose={() => {
          if (isLast) {
            onDiveComplete({ xp, score: totalScore, creatures: stage.creatures.map(c => c.id) });
          } else {
            setUnlockIdx(i => i + 1);
          }
        }}
      />
    );
  }

  return null;
};

// ═══════════════════════════════════════════════════════════
// JOURNEY TAB — vertical scroll of ocean stages
// ═══════════════════════════════════════════════════════════
const JourneyTab = ({ profile, onStartDive }) => {
  const currentStage = JOURNEY.find(s => s.id === profile.currentStage) || JOURNEY[0];

  return (
    <div style={{ position: "relative" }}>
      {/* Top hero — current stage */}
      <div style={{
        position: "relative", padding: "24px 20px 28px",
        background: `linear-gradient(180deg, ${currentStage.bg[0]}, ${currentStage.bg[1]})`,
        overflow: "hidden",
      }}>
        <Bubbles count={8} opacity={0.3} />
        <Caustics />
        {/* Show swimming silhouettes ONLY of already-collected creatures to avoid spoiling */}
        {profile.collectedCreatures[0] && (
          <SwimmingCreature creature={profile.collectedCreatures[0]} top={20} side="left" duration={22} scale={0.6} flip={false} />
        )}
        {profile.collectedCreatures[1] && (
          <SwimmingCreature creature={profile.collectedCreatures[1]} top={120} side="right" duration={28} delay={4} scale={0.5} flip={true} />
        )}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ ...font(11, 700), color: currentStage.textColor, letterSpacing: 2, textTransform: "uppercase", opacity: 0.85 }}>
            Current Depth · {currentStage.depth}
          </div>
          <div style={{ ...displayFont(34), color: currentStage.textColor, marginTop: 4, textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
            {currentStage.name}
          </div>
          <div style={{ ...font(14), color: currentStage.textColor, opacity: 0.85, marginTop: 6, maxWidth: 320, lineHeight: 1.45 }}>
            {currentStage.desc}
          </div>
          {!currentStage.isFinal && (
            <div style={{ marginTop: 20, padding: 16, background: "rgba(0,0,0,0.25)", borderRadius: 16, backdropFilter: "blur(6px)" }}>
              <div style={{ ...font(13, 700), color: "#fff", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, opacity: 0.85 }}>
                Today's Dive
              </div>
              <div style={{ ...font(14), color: "rgba(255,255,255,0.9)", marginBottom: 12 }}>
                Complete 4 cognitive games to descend deeper and unlock {currentStage.creatures.length} sea creature{currentStage.creatures.length !== 1 ? "s" : ""}.
              </div>
              <Btn onClick={onStartDive} color="#fff" textColor={C.deepNavy}>Begin Dive 🤿</Btn>
            </div>
          )}
          {currentStage.isFinal && (
            <div style={{ marginTop: 20, padding: 16, background: "rgba(0,0,0,0.3)", borderRadius: 16 }}>
              <div style={{ ...font(14, 600), color: C.bioGlow, textAlign: "center" }}>
                🌑 You've reached the deepest reach. The journey is complete.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stage timeline */}
      <div style={{ padding: "24px 20px 100px", position: "relative" }}>
        <SectionHeader title="Your Descent" subtitle={`Stage ${profile.currentStage} of ${JOURNEY.length}`} icon="🗺️" />
        <div style={{ position: "relative", marginTop: 20 }}>
          {/* Vertical connector line */}
          <div style={{ position: "absolute", left: 27, top: 30, bottom: 30, width: 3, background: `linear-gradient(to bottom, ${C.shallow}, ${C.ocean}, ${C.abyss})`, borderRadius: 2, opacity: 0.4 }} />
          {JOURNEY.map((stage, idx) => {
            const isCompleted = profile.stagesCompleted.includes(stage.id);
            const isCurrent = stage.id === profile.currentStage;
            const isLocked = !isCompleted && !isCurrent;
            return (
              <div key={stage.id} style={{ position: "relative", marginBottom: 16, paddingLeft: 64 }}>
                {/* Node */}
                <div style={{
                  position: "absolute", left: 8, top: 14, width: 40, height: 40, borderRadius: "50%",
                  background: isCompleted ? `linear-gradient(135deg, ${C.success}, ${C.seagrass})`
                    : isCurrent ? `linear-gradient(135deg, ${stage.bg[0]}, ${stage.bg[1]})`
                    : `linear-gradient(135deg, ${C.slate}88, ${C.deepNavy}88)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: isCurrent ? `3px solid ${C.gold}` : "3px solid #fff",
                  boxShadow: isCurrent ? `0 0 20px ${C.gold}aa, 0 4px 12px rgba(0,0,0,0.15)` : "0 4px 12px rgba(0,0,0,0.15)",
                  zIndex: 2,
                }}>
                  {isCompleted ? <span style={{ fontSize: 18, color: "#fff" }}>✓</span>
                    : isCurrent ? <span style={{ ...mono(15), color: "#fff" }}>{stage.id}</span>
                    : <span style={{ fontSize: 16, opacity: 0.7 }}>🔒</span>}
                </div>
                <Card style={{
                  padding: 14, opacity: isLocked ? 0.55 : 1,
                  background: isCurrent ? `linear-gradient(135deg, ${stage.bg[0]}1a, ${stage.bg[1]}1a)` : C.cardBg,
                  border: isCurrent ? `1.5px solid ${stage.bg[0]}66` : "none",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <div style={{ ...font(16, 700), color: C.deepNavy }}>{stage.name}</div>
                        {isCurrent && <span style={{ ...font(10, 700), color: C.gold, padding: "2px 8px", background: `${C.gold}1f`, borderRadius: 10, letterSpacing: 1 }}>NOW</span>}
                      </div>
                      <div style={{ ...font(12, 500), color: C.slate, marginBottom: 6 }}>{stage.depth}</div>
                      <div style={{ ...font(13), color: C.slate, lineHeight: 1.4, opacity: 0.85 }}>{stage.desc}</div>
                    </div>
                    {/* Creature previews */}
                    {stage.creatures.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
                        {stage.creatures.map(c => {
                          const collected = profile.collectedCreatures.includes(c.id);
                          return (
                            <div key={c.id} style={{
                              width: 44, height: 44, borderRadius: 10,
                              background: collected ? `${RARITY_COLORS[c.rarity]}22` : "rgba(20,40,70,0.06)",
                              border: collected ? `1.5px solid ${RARITY_COLORS[c.rarity]}66` : `1.5px dashed rgba(20,40,70,0.18)`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              {collected ? renderCreature(c.id, 38) : (
                                <span style={{ ...displayFont(20), color: C.slate, opacity: 0.5 }}>?</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// COLLECTION TAB — grid of all creatures, collected & locked
// ═══════════════════════════════════════════════════════════
const CollectionTab = ({ profile }) => {
  const [selected, setSelected] = useState(null);
  const collected = profile.collectedCreatures || [];
  const completion = collected.length / TOTAL_CREATURES;

  return (
    <div style={{ padding: 20, paddingBottom: 100 }}>
      <SectionHeader title="Collection" subtitle="Creatures discovered on your journey" icon="🐚" />

      <Card glow glowColor={C.aqua} style={{ marginTop: 12, marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <ProgressRing progress={completion} size={84} stroke={10} color={C.aqua}>
            <div style={{ ...displayFont(22), color: C.deepNavy }}>{collected.length}</div>
            <div style={{ ...font(10, 600), color: C.slate }}>/ {TOTAL_CREATURES}</div>
          </ProgressRing>
          <div style={{ flex: 1 }}>
            <div style={{ ...font(15, 600), color: C.deepNavy }}>Field Journal</div>
            <div style={{ ...font(13), color: C.slate, marginTop: 4 }}>
              {collected.length === 0 ? "Begin your descent to discover your first creature."
                : collected.length === TOTAL_CREATURES ? "You've discovered every creature in the ocean!"
                : `${TOTAL_CREATURES - collected.length} more await in the depths.`}
            </div>
          </div>
        </div>
      </Card>

      {/* Rarity legend */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        {Object.entries(RARITY_COLORS).map(([r, c]) => (
          <div key={r} style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 10px", background: `${c}1f`, borderRadius: 10, border: `1px solid ${c}44` }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
            <span style={{ ...font(11, 600), color: c }}>{r}</span>
          </div>
        ))}
      </div>

      {/* Grouped by stage */}
      {JOURNEY.filter(s => s.creatures.length > 0).map(stage => (
        <Card key={stage.id} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${stage.bg[0]}, ${stage.bg[1]})`, display: "flex", alignItems: "center", justifyContent: "center", ...mono(12), color: "#fff" }}>{stage.id}</div>
            <div>
              <div style={{ ...font(15, 700), color: C.deepNavy }}>{stage.name}</div>
              <div style={{ ...font(11, 500), color: C.slate }}>{stage.depth}</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {stage.creatures.map(c => {
              const isCollected = collected.includes(c.id);
              const rColor = RARITY_COLORS[c.rarity];
              return (
                <div key={c.id} onClick={() => isCollected && setSelected(c)} style={{
                  padding: 12, borderRadius: 14, cursor: isCollected ? "pointer" : "default",
                  background: isCollected ? `${rColor}10` : "rgba(20,40,70,0.04)",
                  border: `1.5px solid ${isCollected ? rColor + "55" : "rgba(20,40,70,0.08)"}`,
                  textAlign: "center", transition: "transform 0.2s",
                }}
                  onMouseDown={e => isCollected && (e.currentTarget.style.transform = "scale(0.96)")}
                  onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <div style={{
                    height: 80, display: "flex", alignItems: "center", justifyContent: "center",
                    background: isCollected ? "transparent" : "rgba(20,40,70,0.04)",
                    border: isCollected ? "none" : "2px dashed rgba(20,40,70,0.15)",
                    borderRadius: 12,
                  }}>
                    {isCollected ? renderCreature(c.id, 80) : (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{ fontSize: 28, opacity: 0.3 }}>🔒</div>
                        <div style={{ ...displayFont(22), color: C.slate, opacity: 0.5 }}>?</div>
                      </div>
                    )}
                  </div>
                  <div style={{ ...font(13, 700), color: isCollected ? C.deepNavy : C.slate, marginTop: 6 }}>
                    {isCollected ? c.name : "???"}
                  </div>
                  <div style={{
                    display: "inline-block", marginTop: 4, padding: "2px 8px",
                    borderRadius: 10, background: isCollected ? rColor : C.slate,
                    color: "#fff", ...font(10, 700), letterSpacing: 0.5, textTransform: "uppercase"
                  }}>
                    {isCollected ? c.rarity : "Locked"}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ))}

      {/* Detail modal */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{
          position: "fixed", inset: 0, background: "rgba(10,20,40,0.75)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 200,
          backdropFilter: "blur(8px)",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: C.cardBg, borderRadius: 22, padding: 24, maxWidth: 360, width: "100%",
            border: `2px solid ${RARITY_COLORS[selected.rarity]}`,
            boxShadow: `0 12px 48px rgba(0,0,0,0.4), 0 0 30px ${RARITY_COLORS[selected.rarity]}55`,
          }}>
            <div style={{ display: "flex", justifyContent: "center", padding: 16, background: `${RARITY_COLORS[selected.rarity]}1a`, borderRadius: 16, marginBottom: 14 }}>
              {renderCreature(selected.id, 150)}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ ...displayFont(22), color: C.deepNavy, flex: 1 }}>{selected.name}</div>
              <div style={{ padding: "3px 10px", borderRadius: 10, background: RARITY_COLORS[selected.rarity], color: "#fff", ...font(11, 700), letterSpacing: 1, textTransform: "uppercase" }}>{selected.rarity}</div>
            </div>
            <div style={{ ...font(13, 500), color: C.slate, marginBottom: 12 }}>From the {selected.stageName}</div>
            <p style={{ ...font(14), color: C.deepNavy, lineHeight: 1.55 }}>{selected.fact}</p>
            <div style={{ marginTop: 16 }}>
              <Btn onClick={() => setSelected(null)} color={C.deepNavy} textColor="#fff">Close</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// GAMES LIBRARY TAB
// ═══════════════════════════════════════════════════════════
const GamesTab = ({ profile, onPlayGame }) => {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? GAMES : GAMES.filter(g => g.skill === filter);
  return (
    <div style={{ padding: 20, paddingBottom: 100 }}>
      <SectionHeader title="Game Library" subtitle="Practice individual games" icon="🎮" />
      <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "12px 0", marginBottom: 8 }}>
        {["all", ...SKILLS.map(s => s.name)].map(f => (
          <div key={f} onClick={() => setFilter(f)} style={{
            ...font(13, filter === f ? 700 : 500), color: filter === f ? C.deepNavy : C.slate,
            padding: "6px 14px", borderRadius: 20, cursor: "pointer", flexShrink: 0,
            background: filter === f ? `${C.aqua}33` : `${C.slate}14`,
            border: `1px solid ${filter === f ? C.aqua : "transparent"}`
          }}>{f === "all" ? "All Games" : f}</div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(g => {
          const h = profile.gameHistory.find(x => x.id === g.id);
          return (
            <Card key={g.id} onClick={() => onPlayGame(g.id)} style={{ padding: 16, cursor: "pointer" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: `${g.color}1f`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>{g.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ ...font(17, 700), color: C.deepNavy }}>{g.name}</div>
                    <span style={{ ...font(11, 700), color: g.color, padding: "3px 10px", background: `${g.color}1a`, borderRadius: 10 }}>{g.difficulty}</span>
                  </div>
                  <div style={{ ...font(14, 500), color: C.slate, marginTop: 2 }}>{g.desc}</div>
                  {h && h.timesPlayed > 0 && (
                    <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                      <span style={{ ...font(12, 600), color: g.color }}>{g.skill}</span>
                      <span style={{ ...font(12, 500), color: C.slate }}>Best: <span style={{ ...mono(12), color: C.deepNavy }}>{h.bestScore}</span></span>
                      <span style={{ ...font(12, 500), color: C.slate }}>×{h.timesPlayed}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// PROGRESS TAB
// ═══════════════════════════════════════════════════════════
const ProgressTab = ({ profile }) => {
  const totalGames = profile.gameHistory.reduce((a, h) => a + h.timesPlayed, 0);
  const avgBest = totalGames > 0 ? Math.round(profile.gameHistory.reduce((a, h) => a + h.bestScore, 0) / profile.gameHistory.length) : 0;

  return (
    <div style={{ padding: 20, paddingBottom: 100 }}>
      <SectionHeader title="Progress" subtitle="Your cognitive growth" icon="📈" />
      <Card style={{ marginBottom: 16, marginTop: 8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[["Stages", `${profile.stagesCompleted.length}/${JOURNEY.length}`, C.aqua],
            ["Creatures", `${profile.collectedCreatures.length}/${TOTAL_CREATURES}`, C.coral],
            ["Total XP", profile.totalXP, C.gold]].map(([l, v, c]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ ...mono(20), color: c }}>{v}</div>
              <div style={{ ...font(11, 500), color: C.slate, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <SectionHeader title="Cognitive Skills" icon="🧠" />
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
          {SKILLS.map(s => <SkillBar key={s.name} name={s.name} score={profile.skillScores[s.name] || 5} color={s.color} />)}
        </div>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <SectionHeader title="This Week" subtitle="Daily scores" icon="📊" />
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120, marginTop: 12, paddingBottom: 20 }}>
          {profile.weekScores.map((d, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
              <div style={{ width: "65%", borderRadius: "6px 6px 0 0", minHeight: 4, height: `${Math.max(d.score / 600 * 100, 3)}%`, background: `linear-gradient(to bottom, ${C.aqua}, ${C.ocean})`, transition: "height 0.8s" }} />
              <div style={{ ...font(10, 500), color: C.slate, marginTop: 6 }}>{d.day}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <SectionHeader title="Game Performance" icon="🎯" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
          {GAMES.map(g => {
            const h = profile.gameHistory.find(x => x.id === g.id); if (!h) return null;
            return (
              <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: `1px solid ${C.slate}14` }}>
                <span style={{ fontSize: 20 }}>{g.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ ...font(15, 600), color: C.deepNavy }}>{g.name}</div>
                  <div style={{ display: "flex", gap: 12, marginTop: 2 }}>
                    <span style={{ ...font(12, 500), color: C.slate }}>Best: <span style={{ ...mono(12), color: g.color }}>{h.bestScore}</span></span>
                    <span style={{ ...font(12, 500), color: C.slate }}>×{h.timesPlayed}</span>
                  </div>
                </div>
                <div style={{ width: 60, height: 8, background: `${g.color}1a`, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${Math.min(h.bestScore / 300 * 100, 100)}%`, height: "100%", background: g.color, borderRadius: 4 }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <SectionHeader title="Achievements" subtitle={`${profile.achievements.filter(a => a.earned).length}/${profile.achievements.length} earned`} icon="🏆" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
          {profile.achievements.map(a => (
            <div key={a.id} style={{ padding: 12, borderRadius: 14, textAlign: "center", background: a.earned ? `${C.gold}14` : `${C.slate}0d`, border: `1px solid ${a.earned ? `${C.gold}55` : `${C.slate}1a`}`, opacity: a.earned ? 1 : 0.6 }}>
              <div style={{ fontSize: 28, filter: a.earned ? "none" : "grayscale(100%)" }}>{a.icon}</div>
              <div style={{ ...font(13, 600), color: a.earned ? C.deepNavy : C.slate, marginTop: 4 }}>{a.name}</div>
              <div style={{ ...font(11, 500), color: C.slate, marginTop: 2, lineHeight: 1.3 }}>{a.desc}</div>
              {a.earned && <div style={{ ...font(11, 700), color: C.success, marginTop: 4 }}>✓ Earned</div>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState("journey");
  const [showDive, setShowDive] = useState(false);
  const [activeGame, setActiveGame] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(true);

  const handleOnboardingComplete = (p) => { setProfile(p); setShowOnboarding(false); };
  const handleSkipToDemo = () => { setProfile(makeDemoProfile()); setShowOnboarding(false); };
  const playGame = (id) => setActiveGame(id);
  const handleGameDone = (score) => {
    setProfile(p => ({
      ...p,
      totalXP: p.totalXP + Math.floor(score * 0.3) + 20,
      gameHistory: p.gameHistory.map(h =>
        h.id === activeGame ? { ...h, lastScore: score, bestScore: Math.max(h.bestScore, score), timesPlayed: h.timesPlayed + 1 } : h
      ),
    }));
    setActiveGame(null);
  };

  // Called when a daily dive is fully complete (after creature reveal)
  const handleDiveComplete = ({ xp, score, creatures }) => {
    setProfile(p => {
      const stage = JOURNEY.find(s => s.id === p.currentStage);
      const isLast = p.currentStage >= JOURNEY.length;
      const newCollected = [...new Set([...p.collectedCreatures, ...creatures])];
      const newCompleted = [...new Set([...p.stagesCompleted, p.currentStage])];
      const nextStage = isLast ? p.currentStage : p.currentStage + 1;
      const newAchievements = p.achievements.map(a => {
        if (a.earned) return a;
        if (a.id === 1) return { ...a, earned: true };
        if (a.id === 2 && nextStage >= 2) return { ...a, earned: true };
        if (a.id === 3 && newCollected.length >= 5) return { ...a, earned: true };
        if (a.id === 4 && nextStage >= 6) return { ...a, earned: true };
        if (a.id === 5 && newCollected.includes("orca")) return { ...a, earned: true };
        if (a.id === 6 && nextStage >= 8) return { ...a, earned: true };
        return a;
      });
      // Update today's score in week chart (today = day-of-week)
      const todayIdx = (new Date().getDay() + 6) % 7; // Mon=0
      const newWeek = p.weekScores.map((w, i) => i === todayIdx ? { ...w, score: (w.score || 0) + score } : w);
      return {
        ...p, totalXP: p.totalXP + xp,
        currentStreak: p.currentStreak + 1,
        longestStreak: Math.max(p.longestStreak, p.currentStreak + 1),
        currentStage: nextStage,
        stagesCompleted: newCompleted,
        collectedCreatures: newCollected,
        avatarTitle: TITLES_BY_STAGE[Math.min(nextStage - 1, TITLES_BY_STAGE.length - 1)],
        achievements: newAchievements,
        weekScores: newWeek,
      };
    });
    setShowDive(false);
  };

  // Onboarding
  if (showOnboarding && !profile) return (
    <div style={{ width: "100%", maxWidth: 430, margin: "0 auto", height: "100vh", background: C.deepNavy, position: "relative", overflow: "hidden", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <FontLoader />
      <OnboardingView onComplete={handleOnboardingComplete} />
      <div onClick={handleSkipToDemo} style={{ position: "absolute", bottom: 16, right: 16, ...font(13, 500), color: "rgba(255,255,255,0.4)", cursor: "pointer", zIndex: 10, padding: "6px 12px", background: "rgba(255,255,255,0.08)", borderRadius: 8 }}>Skip to Demo →</div>
    </div>
  );
  if (!profile) return null;

  // Game playing standalone
  if (activeGame) {
    const Comp = GAME_COMPONENTS[activeGame];
    return (
      <div style={{ width: "100%", maxWidth: 430, margin: "0 auto", height: "100vh", background: C.deepNavy, overflow: "auto", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <FontLoader />
        <div style={{ display: "flex", alignItems: "center", padding: "12px 20px" }}>
          <div onClick={() => setActiveGame(null)} style={{ ...font(14, 600), color: "rgba(255,255,255,0.6)", cursor: "pointer", padding: "6px 12px", background: "rgba(255,255,255,0.08)", borderRadius: 8 }}>← Back</div>
        </div>
        <Comp onComplete={handleGameDone} />
      </div>
    );
  }

  // Daily dive
  if (showDive) {
    const stage = JOURNEY.find(s => s.id === profile.currentStage);
    return (
      <div style={{ width: "100%", maxWidth: 430, margin: "0 auto", height: "100vh", background: C.deepNavy, overflow: "hidden", fontFamily: "'DM Sans', system-ui, sans-serif", position: "relative" }}>
        <FontLoader />
        <DailyDiveView stage={stage} onClose={() => setShowDive(false)} onDiveComplete={handleDiveComplete} />
      </div>
    );
  }

  const tabs = [
    { id: "journey", icon: "🌊", label: "Journey" },
    { id: "collection", icon: "🐚", label: "Collection" },
    { id: "dive", icon: "🤿", label: "", special: true },
    { id: "games", icon: "🎮", label: "Games" },
    { id: "progress", icon: "📈", label: "Progress" },
  ];

  return (
    <div style={{ width: "100%", maxWidth: 430, margin: "0 auto", height: "100vh", display: "flex", flexDirection: "column", background: C.bg, position: "relative", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <FontLoader />
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", background: C.bg, borderBottom: `1px solid ${C.slate}14` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22 }}>🌊</span>
          <div>
            <div style={{ ...font(16, 700), color: C.deepNavy, lineHeight: 1 }}>SharpMind</div>
            <div style={{ ...font(10, 600), color: C.aqua, letterSpacing: 1, textTransform: "uppercase" }}>Ocean Journey</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 14 }}>🔥</span>
            <span style={{ ...mono(13), color: C.coral }}>{profile.currentStreak}d</span>
          </div>
          <span style={{ ...mono(13), color: C.gold }}>{profile.totalXP} XP</span>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", background: `linear-gradient(180deg, ${C.bg} 0%, ${C.foam} 100%)` }}>
        {tab === "journey" && <JourneyTab profile={profile} onStartDive={() => setShowDive(true)} />}
        {tab === "collection" && <CollectionTab profile={profile} />}
        {tab === "games" && <GamesTab profile={profile} onPlayGame={playGame} />}
        {tab === "progress" && <ProgressTab profile={profile} />}
      </div>

      {/* Bottom nav */}
      <div style={{ display: "flex", alignItems: "center", padding: "8px 8px 12px", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px) saturate(180%)", WebkitBackdropFilter: "blur(16px) saturate(180%)", borderTop: `1px solid ${C.slate}14` }}>
        {tabs.map(t => {
          if (t.special) return (
            <div key={t.id} style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <div onClick={() => setShowDive(true)} style={{
                width: 64, height: 64, borderRadius: "50%", cursor: "pointer",
                background: `linear-gradient(135deg, ${C.aqua}, ${C.ocean})`,
                boxShadow: `0 4px 16px ${C.aqua}88`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, marginTop: -26,
                border: `3px solid ${C.bg}`,
              }}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.92)")}
                onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              >🤿</div>
            </div>
          );
          return (
            <div key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, textAlign: "center", cursor: "pointer", padding: "4px 0" }}>
              <div style={{ fontSize: 20, opacity: tab === t.id ? 1 : 0.5 }}>{t.icon}</div>
              <div style={{ ...font(10, tab === t.id ? 700 : 500), color: tab === t.id ? C.aqua : C.slate, marginTop: 2 }}>{t.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
