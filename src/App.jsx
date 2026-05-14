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
// REALISTIC SEA CREATURE SVGs
// Each rendered with gradients, shading, and anatomical detail.
// ═══════════════════════════════════════════════════════════

const Clownfish = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 200 140">
    <defs>
      <radialGradient id="cf-b" cx="50%" cy="35%"><stop offset="0%" stopColor="#ffb074"/><stop offset="55%" stopColor="#ff7a2e"/><stop offset="100%" stopColor="#b84a08"/></radialGradient>
      <radialGradient id="cf-belly" cx="50%" cy="80%"><stop offset="0%" stopColor="#fff5e8"/><stop offset="100%" stopColor="#ffd9a8"/></radialGradient>
    </defs>
    <path d="M30 70 Q10 50 5 35 Q8 55 15 70 Q8 85 5 105 Q10 90 30 70 Z" fill="url(#cf-b)" stroke="#1a1208" strokeWidth="1.5"/>
    <ellipse cx="100" cy="70" rx="75" ry="42" fill="url(#cf-b)" stroke="#1a1208" strokeWidth="2"/>
    <ellipse cx="100" cy="92" rx="55" ry="18" fill="url(#cf-belly)" opacity="0.55"/>
    <path d="M60 35 Q55 70 62 105 L75 105 Q70 70 75 35 Z" fill="white" stroke="#1a1208" strokeWidth="2"/>
    <path d="M115 32 Q110 70 117 108 L132 108 Q127 70 132 32 Z" fill="white" stroke="#1a1208" strokeWidth="2"/>
    <path d="M155 50 Q152 70 156 92 L168 88 Q163 70 168 52 Z" fill="white" stroke="#1a1208" strokeWidth="2"/>
    <path d="M80 30 Q100 18 130 30 Q125 35 100 32 Q90 33 80 30 Z" fill="url(#cf-b)" stroke="#1a1208" strokeWidth="1.5"/>
    <path d="M95 85 Q88 105 100 110 Q110 102 105 88 Z" fill="#ff9050" stroke="#1a1208" strokeWidth="1.5"/>
    <circle cx="160" cy="62" r="8" fill="white" stroke="#1a1208" strokeWidth="2"/>
    <circle cx="161" cy="63" r="5" fill="#1a1208"/>
    <circle cx="163" cy="60" r="1.8" fill="white"/>
    <path d="M172 75 Q178 78 175 82" stroke="#1a1208" strokeWidth="1.5" fill="none"/>
  </svg>
);

const Seahorse = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 140 180">
    <defs>
      <radialGradient id="sh-b" cx="50%" cy="40%"><stop offset="0%" stopColor="#ffd97a"/><stop offset="55%" stopColor="#e89c2a"/><stop offset="100%" stopColor="#a85e0a"/></radialGradient>
    </defs>
    <path d="M70 130 Q50 145 55 165 Q70 170 75 155 Q65 155 65 145" fill="none" stroke="url(#sh-b)" strokeWidth="14" strokeLinecap="round"/>
    <path d="M75 35 Q95 50 90 75 Q75 100 65 115 Q60 125 70 130" fill="none" stroke="url(#sh-b)" strokeWidth="22" strokeLinecap="round"/>
    <g stroke="#7a3f08" strokeWidth="1.3" fill="none" opacity="0.65">
      <path d="M82 50 Q95 52 100 60"/><path d="M88 70 Q78 72 70 78"/>
      <path d="M82 88 Q92 92 95 100"/><path d="M72 105 Q62 108 60 115"/>
    </g>
    <ellipse cx="70" cy="28" rx="18" ry="14" fill="url(#sh-b)" stroke="#1a1208" strokeWidth="1.5" transform="rotate(-15 70 28)"/>
    <path d="M55 22 Q35 22 28 30 Q35 32 50 30 Z" fill="url(#sh-b)" stroke="#1a1208" strokeWidth="1.5"/>
    <path d="M78 18 L82 8 L86 18 L90 10 L92 20" stroke="#1a1208" strokeWidth="1.5" fill="#e89c2a"/>
    <path d="M90 60 Q110 55 115 75 Q105 75 92 72 Z" fill="#ffd97a" stroke="#1a1208" strokeWidth="1.2" opacity="0.85"/>
    <g stroke="#1a1208" strokeWidth="0.8" opacity="0.4"><line x1="95" y1="62" x2="108" y2="62"/><line x1="93" y1="68" x2="110" y2="68"/></g>
    <circle cx="68" cy="26" r="4" fill="white" stroke="#1a1208" strokeWidth="1.2"/>
    <circle cx="68" cy="27" r="2.5" fill="#1a1208"/>
    <circle cx="69" cy="25" r="0.8" fill="white"/>
    <circle cx="85" cy="60" r="1.8" fill="#a85e0a" opacity="0.6"/>
    <circle cx="75" cy="85" r="1.5" fill="#a85e0a" opacity="0.6"/>
    <circle cx="82" cy="105" r="1.5" fill="#a85e0a" opacity="0.6"/>
  </svg>
);

const Pufferfish = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 160 160">
    <defs>
      <radialGradient id="pf-b" cx="40%" cy="40%"><stop offset="0%" stopColor="#ffe09a"/><stop offset="55%" stopColor="#d8a052"/><stop offset="100%" stopColor="#7a5018"/></radialGradient>
      <radialGradient id="pf-belly" cx="50%" cy="80%"><stop offset="0%" stopColor="#fff8e0"/><stop offset="100%" stopColor="#e8d090"/></radialGradient>
    </defs>
    <path d="M130 75 Q150 60 155 50 Q152 75 148 80 Q152 90 155 105 Q150 90 130 80 Z" fill="url(#pf-b)" stroke="#1a1208" strokeWidth="1.5"/>
    <circle cx="80" cy="80" r="60" fill="url(#pf-b)" stroke="#1a1208" strokeWidth="2"/>
    <ellipse cx="80" cy="105" rx="45" ry="20" fill="url(#pf-belly)" opacity="0.8"/>
    <g fill="url(#pf-b)" stroke="#1a1208" strokeWidth="1">
      <path d="M35 50 L25 42 L38 47 Z"/><path d="M30 65 L18 62 L32 67 Z"/>
      <path d="M30 85 L16 88 L32 88 Z"/><path d="M35 105 L22 112 L38 108 Z"/>
      <path d="M50 125 L45 138 L55 128 Z"/><path d="M70 132 L68 145 L75 134 Z"/>
      <path d="M95 128 L100 142 L100 130 Z"/><path d="M115 115 L125 122 L118 110 Z"/>
      <path d="M122 95 L138 95 L122 90 Z"/><path d="M120 75 L135 70 L120 72 Z"/>
      <path d="M55 35 L50 22 L60 32 Z"/><path d="M75 28 L75 15 L80 28 Z"/>
      <path d="M95 30 L105 18 L100 32 Z"/>
    </g>
    <g fill="#5a3008" opacity="0.7">
      <circle cx="65" cy="60" r="2"/><circle cx="85" cy="55" r="2.2"/>
      <circle cx="100" cy="65" r="1.8"/><circle cx="70" cy="80" r="2"/>
      <circle cx="95" cy="85" r="2.5"/><circle cx="75" cy="100" r="1.8"/>
      <circle cx="100" cy="100" r="2"/><circle cx="55" cy="95" r="1.5"/>
    </g>
    <circle cx="62" cy="72" r="10" fill="white" stroke="#1a1208" strokeWidth="1.5"/>
    <circle cx="98" cy="72" r="10" fill="white" stroke="#1a1208" strokeWidth="1.5"/>
    <circle cx="64" cy="74" r="6" fill="#1a1208"/>
    <circle cx="100" cy="74" r="6" fill="#1a1208"/>
    <circle cx="66" cy="72" r="2" fill="white"/>
    <circle cx="102" cy="72" r="2" fill="white"/>
    <ellipse cx="80" cy="100" rx="9" ry="6" fill="#c4502a" stroke="#1a1208" strokeWidth="1.5"/>
    <path d="M73 100 Q80 95 87 100" stroke="#1a1208" strokeWidth="1.2" fill="none"/>
  </svg>
);

const SeaTurtle = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 200 160">
    <defs>
      <radialGradient id="tt-s" cx="50%" cy="40%"><stop offset="0%" stopColor="#7da570"/><stop offset="60%" stopColor="#4a7341"/><stop offset="100%" stopColor="#2a4823"/></radialGradient>
      <radialGradient id="tt-k" cx="50%" cy="50%"><stop offset="0%" stopColor="#a8b890"/><stop offset="100%" stopColor="#5a7048"/></radialGradient>
    </defs>
    <ellipse cx="40" cy="115" rx="22" ry="10" fill="url(#tt-k)" stroke="#1a1208" strokeWidth="1.5" transform="rotate(-20 40 115)"/>
    <ellipse cx="160" cy="115" rx="22" ry="10" fill="url(#tt-k)" stroke="#1a1208" strokeWidth="1.5" transform="rotate(20 160 115)"/>
    <path d="M25 70 Q5 60 0 75 Q8 95 35 90 Q45 80 25 70 Z" fill="url(#tt-k)" stroke="#1a1208" strokeWidth="1.5"/>
    <path d="M175 70 Q195 60 200 75 Q192 95 165 90 Q155 80 175 70 Z" fill="url(#tt-k)" stroke="#1a1208" strokeWidth="1.5"/>
    <ellipse cx="100" cy="32" rx="22" ry="20" fill="url(#tt-k)" stroke="#1a1208" strokeWidth="2"/>
    <ellipse cx="100" cy="85" rx="65" ry="48" fill="url(#tt-s)" stroke="#1a1208" strokeWidth="2"/>
    <g stroke="#2a4823" strokeWidth="1.4" fill="none" opacity="0.85">
      <path d="M100 50 L80 65 L80 90 L100 105 L120 90 L120 65 Z" fill="#5a8a4a" opacity="0.45"/>
      <path d="M60 75 L50 90 L70 110 L80 90 Z" fill="#5a8a4a" opacity="0.4"/>
      <path d="M140 75 L150 90 L130 110 L120 90 Z" fill="#5a8a4a" opacity="0.4"/>
      <path d="M80 110 L100 130 L120 110" fill="#3a6831" opacity="0.5"/>
      <path d="M100 50 L100 105"/><path d="M80 65 L60 75"/><path d="M120 65 L140 75"/>
    </g>
    <ellipse cx="100" cy="60" rx="55" ry="12" fill="white" opacity="0.15"/>
    <circle cx="92" cy="28" r="3.5" fill="white" stroke="#1a1208" strokeWidth="1"/>
    <circle cx="92" cy="28" r="2" fill="#1a1208"/>
    <circle cx="108" cy="28" r="3.5" fill="white" stroke="#1a1208" strokeWidth="1"/>
    <circle cx="108" cy="28" r="2" fill="#1a1208"/>
    <circle cx="97" cy="40" r="0.8" fill="#1a1208"/>
    <circle cx="103" cy="40" r="0.8" fill="#1a1208"/>
  </svg>
);

const Octopus = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 200 180">
    <defs>
      <radialGradient id="oc-b" cx="50%" cy="35%"><stop offset="0%" stopColor="#ff9eb1"/><stop offset="60%" stopColor="#c4516a"/><stop offset="100%" stopColor="#7a2a3f"/></radialGradient>
    </defs>
    <path d="M60 90 Q30 110 25 140 Q35 155 45 145 Q50 130 55 115" fill="url(#oc-b)" stroke="#1a1208" strokeWidth="2"/>
    <path d="M75 100 Q50 130 55 165 Q70 175 75 160 Q78 140 80 120" fill="url(#oc-b)" stroke="#1a1208" strokeWidth="2"/>
    <path d="M95 105 Q85 140 95 170 Q105 172 105 155 Q102 130 100 115" fill="url(#oc-b)" stroke="#1a1208" strokeWidth="2"/>
    <path d="M115 105 Q125 140 130 170 Q140 168 138 150 Q130 125 122 110" fill="url(#oc-b)" stroke="#1a1208" strokeWidth="2"/>
    <path d="M130 100 Q155 130 165 160 Q175 155 170 138 Q155 115 140 105" fill="url(#oc-b)" stroke="#1a1208" strokeWidth="2"/>
    <path d="M140 90 Q170 110 178 138 Q188 135 182 118 Q168 100 150 92" fill="url(#oc-b)" stroke="#1a1208" strokeWidth="2"/>
    <g fill="#ffc8d6" stroke="#7a2a3f" strokeWidth="0.7">
      <circle cx="35" cy="135" r="2.4"/><circle cx="42" cy="148" r="2.4"/>
      <circle cx="60" cy="150" r="2.4"/><circle cx="68" cy="165" r="2.4"/>
      <circle cx="95" cy="160" r="2.4"/><circle cx="100" cy="170" r="2.4"/>
      <circle cx="125" cy="160" r="2.4"/><circle cx="135" cy="155" r="2.4"/>
      <circle cx="160" cy="150" r="2.4"/><circle cx="170" cy="135" r="2.4"/>
    </g>
    <ellipse cx="100" cy="65" rx="55" ry="50" fill="url(#oc-b)" stroke="#1a1208" strokeWidth="2"/>
    <ellipse cx="85" cy="40" rx="6" ry="4" fill="#ff7a90" opacity="0.6"/>
    <ellipse cx="115" cy="40" rx="6" ry="4" fill="#ff7a90" opacity="0.6"/>
    <ellipse cx="100" cy="55" rx="5" ry="3" fill="#ff7a90" opacity="0.5"/>
    <ellipse cx="82" cy="65" rx="11" ry="9" fill="white" stroke="#1a1208" strokeWidth="2"/>
    <ellipse cx="118" cy="65" rx="11" ry="9" fill="white" stroke="#1a1208" strokeWidth="2"/>
    <ellipse cx="83" cy="67" rx="6" ry="5" fill="#1a1208"/>
    <ellipse cx="119" cy="67" rx="6" ry="5" fill="#1a1208"/>
    <rect x="80" y="63" width="3" height="6" fill="#1a1208"/>
    <rect x="116" y="63" width="3" height="6" fill="#1a1208"/>
    <circle cx="86" cy="64" r="1.5" fill="white"/>
    <circle cx="122" cy="64" r="1.5" fill="white"/>
  </svg>
);

const Crab = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 200 160">
    <defs><radialGradient id="cr-b" cx="50%" cy="40%"><stop offset="0%" stopColor="#ff8a6a"/><stop offset="55%" stopColor="#d24020"/><stop offset="100%" stopColor="#7a1808"/></radialGradient></defs>
    <g fill="url(#cr-b)" stroke="#1a1208" strokeWidth="1.5">
      <path d="M50 90 Q25 95 15 115 Q25 120 35 115 Q45 105 50 95 Z"/>
      <path d="M45 75 Q18 70 5 85 Q12 95 25 90 Q38 85 50 80 Z"/>
      <path d="M50 60 Q22 50 12 35 Q22 30 35 38 Q45 50 55 65 Z"/>
      <path d="M150 90 Q175 95 185 115 Q175 120 165 115 Q155 105 150 95 Z"/>
      <path d="M155 75 Q182 70 195 85 Q188 95 175 90 Q162 85 150 80 Z"/>
      <path d="M150 60 Q178 50 188 35 Q178 30 165 38 Q155 50 145 65 Z"/>
    </g>
    <path d="M45 85 Q25 78 8 65 Q0 70 5 80 Q18 90 35 95 Z" fill="url(#cr-b)" stroke="#1a1208" strokeWidth="1.5"/>
    <path d="M8 65 Q0 55 10 50 Q22 55 25 65 Q18 70 8 65 Z" fill="url(#cr-b)" stroke="#1a1208" strokeWidth="2"/>
    <path d="M10 50 Q18 58 25 62 Q22 50 15 45 Z" fill="url(#cr-b)" stroke="#1a1208" strokeWidth="1.5"/>
    <path d="M155 85 Q175 78 192 65 Q200 70 195 80 Q182 90 165 95 Z" fill="url(#cr-b)" stroke="#1a1208" strokeWidth="1.5"/>
    <path d="M192 65 Q200 55 190 50 Q178 55 175 65 Q182 70 192 65 Z" fill="url(#cr-b)" stroke="#1a1208" strokeWidth="2"/>
    <path d="M190 50 Q182 58 175 62 Q178 50 185 45 Z" fill="url(#cr-b)" stroke="#1a1208" strokeWidth="1.5"/>
    <ellipse cx="100" cy="80" rx="55" ry="38" fill="url(#cr-b)" stroke="#1a1208" strokeWidth="2"/>
    <path d="M60 75 Q100 65 140 75" stroke="#7a1808" strokeWidth="1.4" fill="none" opacity="0.7"/>
    <path d="M70 90 Q100 95 130 90" stroke="#7a1808" strokeWidth="1.4" fill="none" opacity="0.7"/>
    <circle cx="80" cy="68" r="3" fill="#ff5a3a" opacity="0.7"/>
    <circle cx="100" cy="62" r="3" fill="#ff5a3a" opacity="0.7"/>
    <circle cx="120" cy="68" r="3" fill="#ff5a3a" opacity="0.7"/>
    <line x1="88" y1="55" x2="86" y2="42" stroke="#1a1208" strokeWidth="2"/>
    <line x1="112" y1="55" x2="114" y2="42" stroke="#1a1208" strokeWidth="2"/>
    <circle cx="86" cy="40" r="4.5" fill="#1a1208"/>
    <circle cx="114" cy="40" r="4.5" fill="#1a1208"/>
    <circle cx="87" cy="39" r="1.5" fill="white"/>
    <circle cx="115" cy="39" r="1.5" fill="white"/>
    <path d="M92 100 Q100 105 108 100" stroke="#1a1208" strokeWidth="1.5" fill="none"/>
  </svg>
);

const Stingray = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 200 180">
    <defs><radialGradient id="sr-b" cx="50%" cy="35%"><stop offset="0%" stopColor="#c8a878"/><stop offset="60%" stopColor="#8a6838"/><stop offset="100%" stopColor="#4a3818"/></radialGradient></defs>
    <path d="M100 130 Q105 150 115 165 Q125 175 130 175" stroke="#5a4020" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
    <circle cx="118" cy="170" r="2.5" fill="#3a2810"/>
    <path d="M120 168 L128 175 L122 172 Z" fill="#1a1008"/>
    <path d="M100 25 Q30 40 25 100 Q35 135 100 130 Q165 135 175 100 Q170 40 100 25 Z" fill="url(#sr-b)" stroke="#1a1208" strokeWidth="2"/>
    <g fill="#4a3018" opacity="0.7">
      <circle cx="70" cy="70" r="4"/><circle cx="100" cy="65" r="5"/><circle cx="130" cy="70" r="4"/>
      <circle cx="55" cy="95" r="3.5"/><circle cx="80" cy="100" r="4"/><circle cx="120" cy="100" r="4"/>
      <circle cx="145" cy="95" r="3.5"/><circle cx="100" cy="110" r="3"/>
      <circle cx="85" cy="85" r="2.5"/><circle cx="115" cy="85" r="2.5"/>
    </g>
    <g fill="#e8d098" opacity="0.5">
      <circle cx="60" cy="80" r="2"/><circle cx="90" cy="85" r="1.5"/>
      <circle cx="140" cy="80" r="2"/><circle cx="110" cy="95" r="1.5"/>
    </g>
    <ellipse cx="100" cy="50" rx="50" ry="10" fill="#e8c890" opacity="0.4"/>
    <ellipse cx="85" cy="52" rx="4" ry="3" fill="#1a1208"/>
    <ellipse cx="115" cy="52" rx="4" ry="3" fill="#1a1208"/>
    <circle cx="86" cy="51" r="1" fill="white"/>
    <circle cx="116" cy="51" r="1" fill="white"/>
    <ellipse cx="88" cy="60" rx="3" ry="1.5" fill="#3a2810"/>
    <ellipse cx="112" cy="60" rx="3" ry="1.5" fill="#3a2810"/>
  </svg>
);

const MantaRay = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 220 140">
    <defs>
      <linearGradient id="mr-b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#2a3a55"/><stop offset="50%" stopColor="#1a2640"/><stop offset="100%" stopColor="#0a1428"/></linearGradient>
      <linearGradient id="mr-y" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#d8e0ea"/><stop offset="100%" stopColor="#9aa8bc"/></linearGradient>
    </defs>
    <path d="M110 95 Q115 110 118 130 Q110 132 108 110 Z" fill="url(#mr-b)" stroke="#0a1428" strokeWidth="1.5"/>
    <path d="M110 30 Q50 25 15 60 Q5 70 20 78 Q60 75 90 80 Q110 85 130 80 Q160 75 200 78 Q215 70 205 60 Q170 25 110 30 Z" fill="url(#mr-b)" stroke="#0a1428" strokeWidth="2"/>
    <ellipse cx="110" cy="75" rx="35" ry="8" fill="url(#mr-y)" opacity="0.3"/>
    <g fill="white" opacity="0.75">
      <circle cx="70" cy="55" r="2.5"/><circle cx="90" cy="50" r="2"/>
      <circle cx="130" cy="50" r="2"/><circle cx="150" cy="55" r="2.5"/>
      <circle cx="105" cy="45" r="1.8"/><circle cx="115" cy="45" r="1.8"/>
      <circle cx="50" cy="65" r="1.8"/><circle cx="170" cy="65" r="1.8"/>
    </g>
    <path d="M95 40 Q88 30 92 22 Q98 32 100 42 Z" fill="url(#mr-b)" stroke="#0a1428" strokeWidth="1.5"/>
    <path d="M125 40 Q132 30 128 22 Q122 32 120 42 Z" fill="url(#mr-b)" stroke="#0a1428" strokeWidth="1.5"/>
    <ellipse cx="110" cy="43" rx="8" ry="2" fill="#0a1428"/>
    <circle cx="98" cy="42" r="2" fill="#1a1208"/>
    <circle cx="122" cy="42" r="2" fill="#1a1208"/>
    <path d="M30 60 Q60 50 90 55" stroke="white" strokeWidth="1" fill="none" opacity="0.3"/>
    <path d="M130 55 Q160 50 190 60" stroke="white" strokeWidth="1" fill="none" opacity="0.3"/>
  </svg>
);

const Jellyfish = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 180 200">
    <defs>
      <radialGradient id="jf-b" cx="50%" cy="40%"><stop offset="0%" stopColor="rgba(255,180,220,0.95)"/><stop offset="50%" stopColor="rgba(220,130,200,0.85)"/><stop offset="100%" stopColor="rgba(140,80,160,0.6)"/></radialGradient>
      <radialGradient id="jf-g" cx="50%" cy="50%"><stop offset="0%" stopColor="rgba(255,200,230,0.5)"/><stop offset="100%" stopColor="rgba(255,200,230,0)"/></radialGradient>
    </defs>
    <ellipse cx="90" cy="65" rx="85" ry="60" fill="url(#jf-g)"/>
    <g stroke="rgba(220,130,200,0.7)" strokeWidth="2.5" fill="none" strokeLinecap="round">
      <path d="M50 85 Q45 130 55 165 Q48 180 52 195"/>
      <path d="M65 90 Q60 140 68 175 Q62 190 68 198"/>
      <path d="M80 92 Q78 145 82 185"/>
      <path d="M95 92 Q98 145 92 195"/>
      <path d="M110 90 Q115 140 108 190"/>
      <path d="M125 88 Q130 135 122 175 Q128 190 124 198"/>
      <path d="M138 85 Q145 130 135 165 Q142 180 138 195"/>
    </g>
    <g fill="rgba(255,150,200,0.6)" stroke="rgba(220,100,180,0.8)" strokeWidth="1">
      <path d="M75 75 Q70 100 78 130 Q82 125 80 100 Q82 80 75 75 Z"/>
      <path d="M90 75 Q88 105 92 135 Q96 130 94 100 Q96 80 90 75 Z"/>
      <path d="M105 75 Q110 100 102 130 Q98 125 100 100 Q98 80 105 75 Z"/>
    </g>
    <path d="M20 70 Q25 20 90 15 Q155 20 160 70 Q155 90 90 90 Q25 90 20 70 Z" fill="url(#jf-b)" stroke="rgba(140,60,140,0.7)" strokeWidth="1.5"/>
    <g stroke="rgba(255,200,230,0.6)" strokeWidth="1" fill="none">
      <ellipse cx="90" cy="60" rx="55" ry="20"/>
      <ellipse cx="90" cy="55" rx="40" ry="14"/>
    </g>
    <ellipse cx="70" cy="35" rx="30" ry="10" fill="rgba(255,240,250,0.5)"/>
    <circle cx="80" cy="60" r="5" fill="rgba(200,100,170,0.5)"/>
    <circle cx="100" cy="60" r="5" fill="rgba(200,100,170,0.5)"/>
    <circle cx="90" cy="68" r="4" fill="rgba(200,100,170,0.5)"/>
  </svg>
);

const Hammerhead = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 220 120">
    <defs>
      <linearGradient id="hh-b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#7a8a9a"/><stop offset="50%" stopColor="#4a5a70"/><stop offset="100%" stopColor="#2a3548"/></linearGradient>
      <linearGradient id="hh-y" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#c8d0dc"/><stop offset="100%" stopColor="#9aa4b4"/></linearGradient>
    </defs>
    <path d="M25 60 Q5 35 0 20 Q8 45 15 60 Q8 75 0 100 Q5 85 25 60 Z" fill="url(#hh-b)" stroke="#1a1208" strokeWidth="1.5"/>
    <path d="M25 50 Q25 70 25 70 L145 75 Q150 60 145 45 L25 50 Z" fill="url(#hh-b)" stroke="#1a1208" strokeWidth="2"/>
    <path d="M30 68 Q90 78 142 70 Q90 80 30 68 Z" fill="url(#hh-y)"/>
    <path d="M80 47 L95 25 L110 47 Z" fill="url(#hh-b)" stroke="#1a1208" strokeWidth="1.5"/>
    <path d="M50 50 L58 38 L65 50 Z" fill="url(#hh-b)" stroke="#1a1208" strokeWidth="1.5"/>
    <path d="M115 65 Q130 90 100 95 Q95 78 105 68 Z" fill="url(#hh-b)" stroke="#1a1208" strokeWidth="1.5"/>
    <path d="M145 30 Q145 25 165 22 Q200 18 210 35 Q210 55 195 60 L175 65 Q165 65 150 65 Q145 60 145 50 Z" fill="url(#hh-b)" stroke="#1a1208" strokeWidth="2"/>
    <path d="M165 22 Q185 12 200 18 Q205 22 200 25 Q180 25 165 25 Z" fill="url(#hh-b)" stroke="#1a1208" strokeWidth="1.5"/>
    <circle cx="203" cy="40" r="4" fill="white" stroke="#1a1208" strokeWidth="1.5"/>
    <circle cx="204" cy="41" r="2.5" fill="#1a1208"/>
    <circle cx="205" cy="40" r="0.8" fill="white"/>
    <path d="M155 50 Q158 55 155 60" stroke="#1a1208" strokeWidth="1.2" fill="none"/>
    <path d="M160 50 Q163 55 160 60" stroke="#1a1208" strokeWidth="1.2" fill="none"/>
    <path d="M165 50 Q168 55 165 60" stroke="#1a1208" strokeWidth="1.2" fill="none"/>
  </svg>
);

const WhaleShark = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 240 130">
    <defs>
      <linearGradient id="ws-b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#5878a5"/><stop offset="55%" stopColor="#3a5478"/><stop offset="100%" stopColor="#1a2c45"/></linearGradient>
      <linearGradient id="ws-y" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#d0dae6"/><stop offset="100%" stopColor="#a8b4c2"/></linearGradient>
    </defs>
    <path d="M30 65 Q12 30 5 15 Q15 45 22 65 Q15 85 5 115 Q12 100 30 65 Z" fill="url(#ws-b)" stroke="#1a1208" strokeWidth="1.5"/>
    <ellipse cx="135" cy="65" rx="105" ry="42" fill="url(#ws-b)" stroke="#1a1208" strokeWidth="2"/>
    <ellipse cx="135" cy="90" rx="85" ry="18" fill="url(#ws-y)" opacity="0.85"/>
    <path d="M115 25 L135 5 L155 25 Z" fill="url(#ws-b)" stroke="#1a1208" strokeWidth="1.5"/>
    <path d="M70 32 L78 22 L85 32 Z" fill="url(#ws-b)" stroke="#1a1208" strokeWidth="1.5"/>
    <path d="M165 85 Q195 110 155 115 Q145 95 155 85 Z" fill="url(#ws-b)" stroke="#1a1208" strokeWidth="1.5"/>
    <g fill="white" opacity="0.9">
      <circle cx="80" cy="55" r="3"/><circle cx="95" cy="45" r="2.5"/><circle cx="110" cy="58" r="3.5"/>
      <circle cx="125" cy="48" r="2.8"/><circle cx="140" cy="55" r="3.2"/><circle cx="155" cy="42" r="2.5"/>
      <circle cx="170" cy="58" r="3"/><circle cx="185" cy="48" r="2.8"/><circle cx="200" cy="60" r="2.5"/>
      <circle cx="100" cy="70" r="2.5"/><circle cx="120" cy="72" r="2.8"/><circle cx="145" cy="72" r="2.5"/>
      <circle cx="170" cy="72" r="3"/><circle cx="65" cy="48" r="2"/><circle cx="50" cy="58" r="2.2"/>
    </g>
    <g stroke="white" strokeWidth="1.2" opacity="0.6">
      <line x1="70" y1="40" x2="70" y2="80"/><line x1="100" y1="35" x2="100" y2="85"/>
      <line x1="135" y1="32" x2="135" y2="88"/><line x1="170" y1="35" x2="170" y2="85"/>
      <line x1="200" y1="42" x2="200" y2="80"/>
    </g>
    <path d="M215 65 Q240 60 240 70 Q240 72 215 72 Z" fill="#1a1208"/>
    <circle cx="225" cy="55" r="2.5" fill="white" stroke="#1a1208" strokeWidth="1"/>
    <circle cx="225" cy="55" r="1.5" fill="#1a1208"/>
    <g stroke="#1a1208" strokeWidth="1" fill="none">
      <path d="M200 50 Q202 60 200 75"/><path d="M207 50 Q209 60 207 75"/><path d="M213 50 Q215 60 213 75"/>
    </g>
  </svg>
);

const OrcaWhale = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 240 120">
    <defs><linearGradient id="ow-b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#1a1a1a"/><stop offset="50%" stopColor="#080808"/><stop offset="100%" stopColor="#000000"/></linearGradient></defs>
    <path d="M25 60 Q5 35 0 25 Q15 45 22 60 Q15 75 0 95 Q5 85 25 60 Z" fill="url(#ow-b)" stroke="#000" strokeWidth="1.5"/>
    <ellipse cx="130" cy="60" rx="105" ry="35" fill="url(#ow-b)" stroke="#000" strokeWidth="1.5"/>
    <path d="M60 75 Q130 95 200 75 Q195 88 130 92 Q65 88 60 75 Z" fill="white"/>
    <ellipse cx="195" cy="50" rx="14" ry="8" fill="white"/>
    <path d="M100 45 Q130 40 155 50 Q145 55 130 53 Q110 52 100 45 Z" fill="white" opacity="0.95"/>
    <path d="M110 30 Q125 5 140 12 Q142 25 138 32 Q125 35 110 35 Z" fill="url(#ow-b)" stroke="#000" strokeWidth="1.5"/>
    <path d="M165 75 Q195 100 158 105 Q148 85 158 75 Z" fill="url(#ow-b)" stroke="#000" strokeWidth="1.5"/>
    <circle cx="200" cy="52" r="2" fill="#000"/>
    <circle cx="201" cy="51" r="0.6" fill="white"/>
    <path d="M215 65 Q230 67 235 65" stroke="#000" strokeWidth="1.5" fill="none"/>
  </svg>
);

const GiantSquid = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <defs><linearGradient id="sq-b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#d4504a"/><stop offset="50%" stopColor="#8a2018"/><stop offset="100%" stopColor="#3a0805"/></linearGradient></defs>
    <path d="M100 15 Q70 20 70 90 Q70 105 100 110 Q130 105 130 90 Q130 20 100 15 Z" fill="url(#sq-b)" stroke="#1a1208" strokeWidth="2"/>
    <path d="M70 35 Q50 40 55 70 Q65 75 75 65 Z" fill="url(#sq-b)" stroke="#1a1208" strokeWidth="1.5"/>
    <path d="M130 35 Q150 40 145 70 Q135 75 125 65 Z" fill="url(#sq-b)" stroke="#1a1208" strokeWidth="1.5"/>
    <g fill="#5a1010" opacity="0.7">
      <circle cx="85" cy="35" r="2"/><circle cx="100" cy="30" r="2.2"/><circle cx="115" cy="35" r="2"/>
      <circle cx="90" cy="55" r="2.5"/><circle cx="108" cy="55" r="2.5"/><circle cx="100" cy="70" r="2"/>
      <circle cx="82" cy="80" r="1.8"/><circle cx="118" cy="80" r="1.8"/>
    </g>
    <circle cx="85" cy="95" r="9" fill="white" stroke="#1a1208" strokeWidth="1.5"/>
    <circle cx="115" cy="95" r="9" fill="white" stroke="#1a1208" strokeWidth="1.5"/>
    <circle cx="86" cy="97" r="5.5" fill="#1a1208"/>
    <circle cx="116" cy="97" r="5.5" fill="#1a1208"/>
    <ellipse cx="86" cy="95" rx="2" ry="3" fill="#5a8aa0" opacity="0.6"/>
    <ellipse cx="116" cy="95" rx="2" ry="3" fill="#5a8aa0" opacity="0.6"/>
    <circle cx="88" cy="94" r="1.5" fill="white"/>
    <circle cx="118" cy="94" r="1.5" fill="white"/>
    <g fill="url(#sq-b)" stroke="#1a1208" strokeWidth="1.5">
      <path d="M78 110 Q65 130 60 155 Q70 158 75 140 Q80 125 85 115 Z"/>
      <path d="M90 110 Q82 135 80 165 Q88 168 90 145 Q92 125 95 115 Z"/>
      <path d="M100 110 Q100 145 102 175 Q108 175 105 145 Q105 125 105 115 Z"/>
      <path d="M110 110 Q118 135 120 165 Q112 168 110 145 Q108 125 105 115 Z"/>
      <path d="M122 110 Q135 130 140 155 Q130 158 125 140 Q120 125 115 115 Z"/>
      <path d="M70 108 Q40 140 30 180 Q38 185 42 170" strokeWidth="2"/>
      <path d="M130 108 Q160 140 170 180 Q162 185 158 170" strokeWidth="2"/>
    </g>
    <ellipse cx="35" cy="180" rx="6" ry="10" fill="url(#sq-b)" stroke="#1a1208" strokeWidth="1.5" transform="rotate(-15 35 180)"/>
    <ellipse cx="165" cy="180" rx="6" ry="10" fill="url(#sq-b)" stroke="#1a1208" strokeWidth="1.5" transform="rotate(15 165 180)"/>
    <ellipse cx="100" cy="108" rx="8" ry="4" fill="#5a1010"/>
  </svg>
);

const Anglerfish = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 200 160">
    <defs>
      <radialGradient id="af-b" cx="30%" cy="50%"><stop offset="0%" stopColor="#3a2a35"/><stop offset="60%" stopColor="#1a1018"/><stop offset="100%" stopColor="#080408"/></radialGradient>
      <radialGradient id="af-g" cx="50%" cy="50%"><stop offset="0%" stopColor="#fff6c0"/><stop offset="40%" stopColor="#ffd060"/><stop offset="100%" stopColor="rgba(255,200,80,0)"/></radialGradient>
    </defs>
    <path d="M30 80 Q10 60 5 45 Q12 70 18 80 Q12 95 5 115 Q10 100 30 80 Z" fill="url(#af-b)" stroke="#000" strokeWidth="1.5"/>
    <ellipse cx="105" cy="85" rx="68" ry="50" fill="url(#af-b)" stroke="#000" strokeWidth="2"/>
    <ellipse cx="105" cy="115" rx="50" ry="12" fill="#0a050a"/>
    <line x1="100" y1="38" x2="85" y2="20" stroke="#2a2025" strokeWidth="2.5"/>
    <circle cx="78" cy="15" r="14" fill="url(#af-g)" opacity="0.7"/>
    <circle cx="78" cy="15" r="7" fill="#fff8d0" stroke="#a88030" strokeWidth="1"/>
    <circle cx="76" cy="13" r="2" fill="white"/>
    <path d="M145 95 Q175 85 175 105 Q170 110 155 108 Q145 105 145 95 Z" fill="#1a0510" stroke="#000" strokeWidth="2"/>
    <g fill="white" stroke="#000" strokeWidth="0.5">
      <path d="M148 96 L150 102 L152 96 Z"/><path d="M154 96 L156 103 L158 96 Z"/>
      <path d="M160 95 L162 104 L164 96 Z"/><path d="M166 96 L168 103 L170 96 Z"/>
      <path d="M150 108 L152 102 L154 108 Z"/><path d="M157 109 L159 102 L161 108 Z"/>
      <path d="M163 108 L165 102 L167 108 Z"/>
    </g>
    <circle cx="135" cy="75" r="8" fill="#1a1010"/>
    <circle cx="135" cy="75" r="6" fill="#f4d060" opacity="0.9"/>
    <circle cx="135" cy="75" r="3" fill="#1a1010"/>
    <circle cx="136" cy="74" r="1" fill="white"/>
    <g stroke="#000" strokeWidth="1.5" fill="none">
      <path d="M90 40 L95 30"/><path d="M105 38 L108 28"/><path d="M120 42 L122 32"/>
    </g>
    <path d="M130 50 Q145 35 155 50 Q150 55 135 55 Z" fill="url(#af-b)" stroke="#000" strokeWidth="1.5"/>
    <circle cx="90" cy="95" r="1.5" fill="#a8e6cf" opacity="0.6"/>
    <circle cx="110" cy="105" r="1.2" fill="#a8e6cf" opacity="0.6"/>
    <circle cx="75" cy="80" r="1.3" fill="#a8e6cf" opacity="0.6"/>
  </svg>
);

const Dolphin = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 220 130">
    <defs>
      <linearGradient id="dl-b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#9ab4c8"/><stop offset="50%" stopColor="#5a7896"/><stop offset="100%" stopColor="#2a4262"/></linearGradient>
      <linearGradient id="dl-y" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#f0e8d8"/><stop offset="100%" stopColor="#c8c0a8"/></linearGradient>
    </defs>
    <path d="M25 60 Q5 40 0 30 Q12 50 18 65 Q10 80 0 95 Q8 85 25 65 Z" fill="url(#dl-b)" stroke="#1a1208" strokeWidth="1.5"/>
    <path d="M30 65 Q50 38 130 38 Q180 40 200 60 Q205 65 200 70 L185 72 Q165 75 130 78 Q60 82 30 70 Z" fill="url(#dl-b)" stroke="#1a1208" strokeWidth="2"/>
    <path d="M50 72 Q120 90 195 70 Q120 95 50 72 Z" fill="url(#dl-y)" opacity="0.9"/>
    <path d="M200 60 Q215 55 220 62 Q218 68 205 68 Z" fill="url(#dl-b)" stroke="#1a1208" strokeWidth="1.5"/>
    <ellipse cx="212" cy="64" rx="3" ry="2" fill="#1a1208"/>
    <path d="M85 38 Q95 18 105 38 Z" fill="url(#dl-b)" stroke="#1a1208" strokeWidth="1.5"/>
    <path d="M105 72 Q130 95 90 100 Q85 80 95 72 Z" fill="url(#dl-b)" stroke="#1a1208" strokeWidth="1.5"/>
    <circle cx="190" cy="55" r="2.5" fill="#1a1208"/>
    <circle cx="190" cy="55" r="0.8" fill="white"/>
    <path d="M170 55 Q172 60 170 65" stroke="#1a1208" strokeWidth="0.8" fill="none" opacity="0.5"/>
  </svg>
);

const SwordFish = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 240 110">
    <defs>
      <linearGradient id="sw-b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#4a6a8c"/><stop offset="50%" stopColor="#28405a"/><stop offset="100%" stopColor="#0a1a30"/></linearGradient>
    </defs>
    <path d="M25 55 Q5 30 0 18 Q10 40 18 55 Q10 70 0 92 Q5 80 25 55 Z" fill="url(#sw-b)" stroke="#1a1208" strokeWidth="1.5"/>
    <ellipse cx="110" cy="55" rx="90" ry="22" fill="url(#sw-b)" stroke="#1a1208" strokeWidth="2"/>
    <path d="M70 38 Q90 18 105 38 Z" fill="url(#sw-b)" stroke="#1a1208" strokeWidth="1.5"/>
    <path d="M120 72 Q140 92 105 95 Q100 80 110 72 Z" fill="url(#sw-b)" stroke="#1a1208" strokeWidth="1.5"/>
    <path d="M200 55 L240 50 L240 60 Z" fill="#cab68a" stroke="#1a1208" strokeWidth="1.5"/>
    <ellipse cx="195" cy="50" rx="3" ry="2.5" fill="#1a1208"/>
    <circle cx="196" cy="49" r="0.8" fill="white"/>
    <path d="M40 65 Q110 75 195 65" stroke="white" strokeWidth="1" fill="none" opacity="0.4"/>
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
      { id: "clownfish", name: "Clownfish", rarity: "Common", fact: "Lives in symbiotic harmony with anemones, immune to their stinging tentacles." },
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
const GAMES = [
  { id: "pattern", name: "Pattern Recall", icon: "🧩", color: C.aqua, skill: "Memory", desc: "Memorize and repeat tile patterns", difficulty: "Medium" },
  { id: "number", name: "Number Flow", icon: "🔢", color: C.gold, skill: "Logic", desc: "Solve sequences and equations fast", difficulty: "Medium" },
  { id: "focus", name: "Focus Grid", icon: "🎯", color: "#a08fc7", skill: "Attention", desc: "Find targets in a visual field", difficulty: "Easy" },
  { id: "decision", name: "Decision Lab", icon: "⚖️", color: C.seagrass, skill: "Judgment", desc: "Navigate executive scenarios", difficulty: "Hard" },
  { id: "wordmaze", name: "Word Maze", icon: "🔤", color: C.coral, skill: "Creativity", desc: "Build word chains from connections", difficulty: "Medium" },
  { id: "priority", name: "Priority Matrix", icon: "📋", color: "#e4925a", skill: "Planning", desc: "Sort tasks by urgency and impact", difficulty: "Hard" },
  { id: "dualn", name: "Dual N-Back", icon: "🔁", color: C.shallow, skill: "Working Memory", desc: "Track two streams simultaneously", difficulty: "Hard" },
  { id: "speedsort", name: "Speed Sort", icon: "⚡", color: "#e8c75c", skill: "Flexibility", desc: "Categorize rapidly under pressure", difficulty: "Easy" },
];

const SKILLS = [
  { name: "Memory", color: C.aqua }, { name: "Logic", color: C.gold },
  { name: "Attention", color: "#a08fc7" }, { name: "Judgment", color: C.seagrass },
  { name: "Creativity", color: C.coral }, { name: "Planning", color: "#e4925a" },
  { name: "Flexibility", color: "#e8c75c" },
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
  skillScores: { Memory: 5, Logic: 5, Attention: 5, Judgment: 5, Creativity: 5, Planning: 5, Flexibility: 5 },
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
  skillScores: { Memory: 7, Logic: 6, Attention: 8, Judgment: 7, Creativity: 6, Planning: 5, Flexibility: 6 },
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
        Train your mind through 8 cognitive games. Complete daily dives to descend deeper and discover {TOTAL_CREATURES} exotic sea creatures.
      </p>
      <div style={{ flex: 1 }} />
      <Btn onClick={() => setPage(1)} style={{ opacity: animIn ? 1 : 0, transition: "opacity 0.6s 0.5s" }}>Begin the Journey 🌊</Btn>
    </div>,
    <div key={1} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: 32, textAlign: "center" }}>
      <div style={{ marginBottom: 18 }}><SeaTurtle size={130} /></div>
      <div style={{ ...displayFont(28), color: "#fff", marginBottom: 24 }}>What should we call you, diver?</div>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Your first name"
        style={{ ...font(20, 600), color: "#fff", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 14, padding: "14px 20px", textAlign: "center", width: "80%", outline: "none" }} />
      <p style={{ ...font(14, 500), color: "rgba(255,255,255,0.5)", marginTop: 12, maxWidth: 300 }}>We'll guide your descent based on your performance.</p>
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
// GAMES — preserved logic, ocean theme colors
// ═══════════════════════════════════════════════════════════
const GameChrome = ({ name, icon, color, round, totalRounds, score, timeLeft, maxTime, children, subtitle }) => (
  <div style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
    <div style={{ ...displayFont(22), color: "#fff", marginBottom: 2 }}>{icon} {name}</div>
    {subtitle && <div style={{ ...font(14, 500), color: `${color}cc`, marginBottom: 8 }}>{subtitle}</div>}
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

const DecisionLabGame = ({ onComplete }) => {
  const allS = [
    { cat: "Leadership", sit: "Your team member made a major error on a client deliverable. The client hasn't noticed yet.", choices: ["Immediately tell the client and offer a fix", "Quietly fix it and send an 'updated version'", "Wait to see if the client notices", "Document the incident for review"], best: 0, why: "Proactive transparency builds trust. Clients respect honesty far more than perfection." },
    { cat: "Risk Assessment", sit: "Option A: guaranteed 8% return. Option B: 60% chance of 25%, 40% chance of -10%. This is 30% of your capital.", choices: ["Option A — guaranteed return", "Option B — higher expected value", "Split evenly between both", "Need more information"], best: 2, why: "Diversification reduces risk while capturing upside — almost always optimal." },
    { cat: "Time Management", sit: "3 tasks due today: board presentation (3hrs), routine report (1hr), urgent emails (30min). 3 hours left.", choices: ["Board presentation first", "Emails, report, then presentation", "Delegate report, skip email, focus presentation", "Report first for a quick win"], best: 2, why: "Focus irreplaceable expertise on the highest-impact task. Delegate what others can do." },
    { cat: "Emotional IQ", sit: "A colleague publicly criticizes your project. The criticism has valid points but delivery was inappropriate.", choices: ["Thank them, discuss privately later", "Defend your decision point by point", "Redirect to agenda, address privately", "Acknowledge valid points, note private feedback pref"], best: 3, why: "Acknowledging valid points shows security. Setting the boundary models professionalism." },
    { cat: "Strategic Thinking", sit: "Your industry is being disrupted by AI. Your skills are valuable now but may not be in 5 years.", choices: ["Double down on current expertise", "Learn AI tools to augment your skills", "Pivot to an AI-resistant field", "Focus on leadership and human skills"], best: 1, why: "AI augmentation of existing expertise is highest-leverage — domain knowledge plus AI multipliers." },
  ];
  const [scenarios] = useState(() => [...allS].sort(() => Math.random() - 0.5));
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const timerRef = useRef(null);
  const labels = ["A","B","C","D"];

  useEffect(() => {
    setTimeLeft(20); setSelected(null); clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); return 0; } return t - 1; }), 1000);
    return () => clearInterval(timerRef.current);
  }, [round]);

  const pick = (i) => { if (selected !== null) return; clearInterval(timerRef.current); setSelected(i); setScore(s => s + (i === scenarios[round].best ? 20 + timeLeft * 2 : 5)); };
  const s = scenarios[round];

  return (
    <GameChrome name="Decision Lab" icon="⚖️" color={C.seagrass} round={round + 1} totalRounds={5} score={score} timeLeft={timeLeft} maxTime={20} subtitle="Choose the best executive move">
      <div style={{ padding: 14, background: "rgba(255,255,255,0.06)", borderRadius: 14, marginBottom: 14 }}>
        <span style={{ ...font(11, 600), color: C.seagrass, textTransform: "uppercase", letterSpacing: 1, padding: "3px 10px", background: `${C.seagrass}26`, borderRadius: 12, display: "inline-block", marginBottom: 8 }}>{s.cat}</span>
        <div style={{ ...font(15), color: "#fff", lineHeight: 1.5 }}>{s.sit}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {s.choices.map((c, i) => {
          const isB = selected !== null && i === s.best, isW = selected === i && i !== s.best;
          return (
            <div key={i} onClick={() => pick(i)} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: 12, borderRadius: 12, cursor: selected ? "default" : "pointer", background: isB ? `${C.success}1f` : isW ? `${C.coral}14` : "rgba(255,255,255,0.04)", border: `2px solid ${isB ? `${C.success}66` : "transparent"}`, transition: "all 0.3s" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, ...mono(14), color: isB ? C.deepNavy : "#fff", background: isB ? C.success : "rgba(255,255,255,0.1)" }}>{labels[i]}</div>
              <div style={{ ...font(14), color: isB ? "#fff" : selected !== null ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.85)", lineHeight: 1.4 }}>{c}</div>
            </div>
          );
        })}
      </div>
      {selected !== null && (
        <div style={{ padding: 12, background: `${C.gold}14`, borderRadius: 12, marginTop: 12 }}>
          <div style={{ ...font(14, 600), color: C.gold, marginBottom: 4 }}>💡 {s.why}</div>
          <Btn onClick={() => { if (round < 4) setRound(r => r + 1); else onComplete(score); }} style={{ marginTop: 8, padding: "10px 24px" }}>{round < 4 ? "Next Scenario" : "Finish"}</Btn>
        </div>
      )}
    </GameChrome>
  );
};

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

const PriorityMatrixGame = ({ onComplete }) => {
  const rounds = [
    { items: [
      { task: "Server is down — clients can't log in", urgent: true, important: true },
      { task: "Reply to a 'thanks for the meeting' email", urgent: false, important: false },
      { task: "Plan next quarter's strategic roadmap", urgent: false, important: true },
      { task: "Coworker asks for help with their report", urgent: true, important: false },
    ]},
    { items: [
      { task: "Investor pitch in 2 hours — not ready", urgent: true, important: true },
      { task: "Update LinkedIn profile picture", urgent: false, important: false },
      { task: "Review long-term hiring plan", urgent: false, important: true },
      { task: "Office snack supply needs reorder", urgent: true, important: false },
    ]},
  ];
  const [round, setRound] = useState(0);
  const [ci, setCi] = useState(0);
  const [score, setScore] = useState(0);
  const [lastResult, setLastResult] = useState(null);

  const handlePick = (urgent, important) => {
    const item = rounds[round].items[ci];
    const correct = item.urgent === urgent && item.important === important;
    setScore(s => Math.max(0, s + (correct ? 25 : -5)));
    setLastResult(correct ? "correct" : "wrong"); setTimeout(() => setLastResult(null), 300);
    if (ci + 1 >= rounds[round].items.length) {
      if (round + 1 < rounds.length) { setRound(r => r + 1); setCi(0); }
      else setTimeout(() => onComplete(score + (correct ? 25 : 0)), 500);
    } else setCi(c => c + 1);
  };

  const item = rounds[round].items[ci];
  const quadrants = [
    { label: "Do First", desc: "Urgent + Important", urgent: true, important: true, color: C.coral },
    { label: "Schedule", desc: "Important", urgent: false, important: true, color: C.aqua },
    { label: "Delegate", desc: "Urgent", urgent: true, important: false, color: C.gold },
    { label: "Eliminate", desc: "Neither", urgent: false, important: false, color: C.slate },
  ];
  return (
    <GameChrome name="Priority Matrix" icon="📋" color="#e4925a" round={round + 1} totalRounds={rounds.length} score={score} timeLeft={0} maxTime={0} subtitle="Where does it go?">
      {item && (
        <>
          <div style={{ padding: 18, borderRadius: 16, background: lastResult === "correct" ? `${C.success}26` : lastResult === "wrong" ? `${C.coral}26` : "rgba(255,255,255,0.08)", border: `2px solid ${lastResult === "correct" ? C.success : lastResult === "wrong" ? C.coral : "rgba(255,255,255,0.15)"}`, marginBottom: 16, textAlign: "center", transition: "all 0.15s" }}>
            <div style={{ ...font(17, 600), color: "#fff", lineHeight: 1.4 }}>{item.task}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {quadrants.map(q => (
              <div key={q.label} onClick={() => handlePick(q.urgent, q.important)} style={{ padding: 14, borderRadius: 12, background: `${q.color}1f`, border: `2px solid ${q.color}55`, cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}>
                <div style={{ ...font(16, 700), color: q.color }}>{q.label}</div>
                <div style={{ ...font(11, 500), color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{q.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ ...font(12, 500), color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: 10 }}>Task {ci + 1}/{rounds[round].items.length}</div>
        </>
      )}
    </GameChrome>
  );
};

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

const SpeedSortGame = ({ onComplete }) => {
  const categories = [
    { name: "Sea Creature", color: C.aqua, items: ["Dolphin","Octopus","Coral","Tuna","Manta Ray","Sea Star","Anchovy","Sea Urchin"] },
    { name: "Land Animal", color: "#e4925a", items: ["Wolf","Elephant","Tiger","Sparrow","Snake","Squirrel","Horse","Hawk"] },
  ];
  const [items, setItems] = useState([]);
  const [ci, setCi] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [streak, setStreak] = useState(0);
  const [lastResult, setLastResult] = useState(null);
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setItems(categories.flatMap(c => c.items.map(item => ({ text: item, category: c.name, color: c.color }))).sort(() => Math.random() - 0.5));
    timerRef.current = setInterval(() => setTimeLeft(t => { if (t <= 0.1) { clearInterval(timerRef.current); setDone(true); return 0; } return +(t - 0.1).toFixed(1); }), 100);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, []);

  useEffect(() => { if (done) { clearInterval(timerRef.current); setTimeout(() => onComplete(score), 1500); } }, [done]);

  const classify = (cat) => {
    if (done || ci >= items.length) return;
    const correct = items[ci].category === cat;
    setScore(s => Math.max(0, s + (correct ? 10 + (streak >= 3 ? 5 : 0) : -5)));
    setStreak(s => correct ? s + 1 : 0);
    setLastResult(correct ? "correct" : "wrong"); setTimeout(() => setLastResult(null), 300);
    if (ci + 1 >= items.length) setDone(true); else setCi(c => c + 1);
  };

  const item = items[ci];
  return (
    <GameChrome name="Speed Sort" icon="⚡" color="#e8c75c" round={ci + 1} totalRounds={items.length} score={score} timeLeft={timeLeft / 3} maxTime={10}
      subtitle={streak >= 3 ? `🔥 ${streak} streak! Bonus active` : "Classify as fast as you can"}>
      {!done && item ? (
        <>
          <div style={{ padding: 24, borderRadius: 18, textAlign: "center", marginBottom: 20, background: lastResult === "correct" ? `${C.success}26` : lastResult === "wrong" ? `${C.coral}26` : "rgba(255,255,255,0.08)", border: `3px solid ${lastResult === "correct" ? C.success : lastResult === "wrong" ? C.coral : "rgba(255,255,255,0.15)"}`, transition: "all 0.15s" }}>
            <div style={{ ...displayFont(32), color: "#fff" }}>{item.text}</div>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            {categories.map(c => (
              <div key={c.name} onClick={() => classify(c.name)} style={{ flex: 1, padding: "20px 16px", borderRadius: 16, textAlign: "center", cursor: "pointer", background: `${c.color}1a`, border: `2px solid ${c.color}4d`, transition: "all 0.2s" }}>
                <div style={{ ...font(18, 700), color: c.color }}>{c.name}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <div style={{ ...displayFont(28), color: "#fff" }}>Time's up!</div>
          <div style={{ ...mono(20), color: C.gold, marginTop: 8 }}>Final: {score} pts</div>
        </div>
      )}
    </GameChrome>
  );
};

const GAME_COMPONENTS = { pattern: PatternRecallGame, number: NumberFlowGame, focus: FocusGridGame, decision: DecisionLabGame, wordmaze: WordMazeGame, priority: PriorityMatrixGame, dualn: DualNBackGame, speedsort: SpeedSortGame };

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
              {stage.creatures.map(c => (
                <div key={c.id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: 4, filter: "brightness(0.4) contrast(1.2)" }}>
                    {renderCreature(c.id, 56)}
                  </div>
                  <div style={{ ...font(10, 600), color: "#fff", opacity: 0.7, marginTop: 4 }}>???</div>
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
        <SwimmingCreature creature={currentStage.creatures[0]?.id || "clownfish"} top={20} side="left" duration={22} scale={0.6} flip={false} />
        <SwimmingCreature creature={currentStage.creatures[1]?.id || "seahorse"} top={120} side="right" duration={28} delay={4} scale={0.5} flip={true} />
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
                              background: collected ? `${RARITY_COLORS[c.rarity]}22` : "rgba(20,40,70,0.08)",
                              border: collected ? `1.5px solid ${RARITY_COLORS[c.rarity]}66` : `1px solid rgba(20,40,70,0.1)`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              filter: collected ? "none" : "grayscale(100%) opacity(0.35)",
                            }}>
                              {renderCreature(c.id, 38)}
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
                    filter: isCollected ? "none" : "grayscale(100%) opacity(0.3)",
                  }}>
                    {renderCreature(c.id, 80)}
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
