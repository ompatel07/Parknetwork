import { useId } from "react";
import type { IconName } from "@/config/site";
import { cn } from "@/lib/cn";

/** Line-art illustrations for each service (SVG + CSS animation, ~1KB each). */
export function ServiceVisual({ kind, className }: { kind: IconName; className?: string }) {
  const id = useId().replace(/:/g, "");
  const g = `sv-${id}`;
  const stroke = `url(#${g})`;

  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden className={cn("viz", className)}>
      <defs>
        <linearGradient id={g} x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C5CFF" />
          <stop offset="0.55" stopColor="#3D8BFF" />
          <stop offset="1" stopColor="#4FE3FF" />
        </linearGradient>
      </defs>
      {kind === "audio" && <Audio stroke={stroke} />}
      {kind === "stream" && <Stream stroke={stroke} />}
      {kind === "agency" && <Agency stroke={stroke} />}
      {kind === "host" && <Host stroke={stroke} />}
      {kind === "coins" && <CoinStack stroke={stroke} />}
      {(kind === "handshake" || kind === "briefcase" || kind === "crown" || kind === "shield" || kind === "mic") && (
        <Partners stroke={stroke} />
      )}
    </svg>
  );
}

type P = { stroke: string };

function Audio({ stroke }: P) {
  return (
    <>
      <g className="spin-rev">
        <circle cx="100" cy="100" r="86" stroke={stroke} strokeWidth="1" strokeDasharray="1 6" strokeLinecap="round" />
      </g>
      {Array.from({ length: 40 }, (_, i) => (
        <g key={i} transform={`rotate(${i * 9} 100 100)`}>
          <rect className="eq" x="99" y="30" width="2.4" height="18" rx="1.2" fill={stroke} style={{ ["--i" as string]: i }} />
        </g>
      ))}
      <circle cx="100" cy="100" r="40" stroke={stroke} strokeWidth="1.5" />
      <circle cx="100" cy="100" r="30" fill="#7C5CFF" opacity="0.14" />
      <rect x="92" y="80" width="16" height="27" rx="8" stroke={stroke} strokeWidth="2" />
      <path d="M84 98a16 16 0 0 0 32 0M100 114v8" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

function Stream({ stroke }: P) {
  return (
    <>
      <rect x="26" y="46" width="148" height="104" rx="16" stroke={stroke} strokeWidth="1.5" />
      <rect x="26" y="46" width="148" height="104" rx="16" fill="#3D8BFF" opacity="0.06" />
      <path
        d="M44 68v-8h8M156 68v-8h-8M44 128v8h8M156 128v8h-8"
        stroke="#F5F4FA"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        transform="translate(0 -2)"
      />
      <rect x="56" y="62" width="32" height="13" rx="6.5" fill="#FF3D6E" />
      <text x="72" y="71.5" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700" letterSpacing="1">
        LIVE
      </text>
      <circle className="blink" cx="146" cy="68.5" r="3" fill="#FF3D6E" />
      <circle cx="100" cy="96" r="20" stroke={stroke} strokeWidth="1.5" />
      <path d="M94 86.5 108 96l-14 9.5z" fill={stroke} />
      <line x1="42" y1="134" x2="158" y2="134" stroke="#F5F4FA" strokeOpacity="0.15" strokeWidth="2" strokeLinecap="round" />
      <g className="playhead">
        <line x1="42" y1="134" x2="42" y2="134" stroke={stroke} strokeWidth="2" />
        <circle cx="42" cy="134" r="4" fill="#4FE3FF" />
      </g>
    </>
  );
}

function Agency({ stroke }: P) {
  const nodes = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    return [100 + Math.cos(a) * 64, 100 + Math.sin(a) * 64] as const;
  });
  return (
    <>
      <circle cx="100" cy="100" r="64" stroke={stroke} strokeWidth="0.8" opacity="0.4" />
      <g className="spin">
        {nodes.map(([x, y], i) => (
          <g key={i}>
            <line className="dash" x1="100" y1="100" x2={x} y2={y} stroke={stroke} strokeWidth="1.4" />
            <circle cx={x} cy={y} r="9" fill="#100E1A" stroke={stroke} strokeWidth="1.5" />
            <circle cx={x} cy={y} r="3" fill={stroke} />
          </g>
        ))}
        {nodes.map(([x, y], i) => {
          const [nx, ny] = nodes[(i + 1) % nodes.length] ?? [x, y];
          return <line key={`e${i}`} x1={x} y1={y} x2={nx} y2={ny} stroke={stroke} strokeWidth="0.8" opacity="0.35" />;
        })}
      </g>
      <circle className="pulse" cx="100" cy="100" r="18" stroke="#4FE3FF" strokeWidth="1" />
      <circle cx="100" cy="100" r="16" fill={stroke} />
      <path d="M93 104v-8l7-5 7 5v8z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
    </>
  );
}

function Host({ stroke }: P) {
  return (
    <>
      <g className="signal-animated" stroke={stroke} strokeWidth="2" strokeLinecap="round">
        <path className="signal-arc" d="M62 66a48 48 0 0 0 0 64" />
        <path className="signal-arc" d="M138 66a48 48 0 0 1 0 64" />
        <path className="signal-arc signal-arc--outer" d="M44 50a72 72 0 0 0 0 96" />
        <path className="signal-arc signal-arc--outer" d="M156 50a72 72 0 0 1 0 96" />
      </g>
      <rect x="84" y="52" width="32" height="56" rx="16" fill="#7C5CFF" fillOpacity="0.15" stroke={stroke} strokeWidth="2" />
      {[64, 72, 80].map((y) => (
        <line key={y} x1="92" y1={y} x2="108" y2={y} stroke={stroke} strokeWidth="1.2" opacity="0.6" />
      ))}
      <path d="M74 94a26 26 0 0 0 52 0M100 120v18M86 140h28" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

function CoinStack({ stroke }: P) {
  const ys = [138, 122, 106];
  return (
    <>
      {ys.map((y) => (
        <g key={y}>
          <path d={`M54 ${y}v10a46 14 0 0 0 92 0v-10`} fill="#100E1A" stroke={stroke} strokeWidth="1.5" />
          <ellipse cx="100" cy={y} rx="46" ry="14" fill="#18152A" stroke={stroke} strokeWidth="1.5" />
          <ellipse cx="100" cy={y} rx="30" ry="8.5" stroke={stroke} strokeWidth="0.8" opacity="0.5" />
        </g>
      ))}
      <g className="bob">
        <ellipse cx="100" cy="64" rx="34" ry="34" fill="#7C5CFF" fillOpacity="0.12" stroke={stroke} strokeWidth="2" />
        <ellipse cx="100" cy="64" rx="24" ry="24" stroke={stroke} strokeWidth="1" opacity="0.6" />
        <path d="M95 53.5 111 64l-16 10.5z" fill={stroke} />
      </g>
      {[
        [40, 60, 0],
        [158, 44, 1],
        [166, 96, 2],
      ].map(([x, y, i]) => (
        <path
          key={i}
          className="blink"
          style={{ animationDelay: `${(i ?? 0) * -0.5}s` }}
          d={`M${x} ${(y ?? 0) - 6}v12M${(x ?? 0) - 6} ${y}h12`}
          stroke="#4FE3FF"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}
    </>
  );
}

function Partners({ stroke }: P) {
  return (
    <>
      <g className="spin">
        <circle cx="100" cy="100" r="84" stroke={stroke} strokeWidth="1" strokeDasharray="2 8" strokeLinecap="round" />
        <circle cx="184" cy="100" r="4" fill="#4FE3FF" />
        <circle cx="16" cy="100" r="3" fill="#7C5CFF" />
      </g>
      <circle cx="78" cy="100" r="42" stroke={stroke} strokeWidth="1.8" />
      <circle cx="122" cy="100" r="42" stroke={stroke} strokeWidth="1.8" />
      <path d="M100 62.4a42 42 0 0 1 0 75.2a42 42 0 0 1 0-75.2z" fill={stroke} opacity="0.35" />
      <circle className="pulse" cx="100" cy="100" r="10" stroke="#4FE3FF" strokeWidth="1" />
      <circle cx="100" cy="100" r="5" fill="#fff" />
    </>
  );
}
