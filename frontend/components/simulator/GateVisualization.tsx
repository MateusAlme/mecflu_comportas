"use client";

import { useEffect, useState } from "react";

interface Props {
  alturaH: number;
  alturaHLinha: number;
  diametroMm: number;
  forcaN?: number;
  excentricidadeMm?: number;
  massaTotalKg?: number;
  angulo?: number;
  canOpen?: boolean;
}

export default function GateVisualization({
  alturaH,
  forcaN = 0,
  massaTotalKg = 0,
  angulo = 60,
  canOpen = true,
}: Props) {
  const [motionOpen, setMotionOpen] = useState(false);
  const W = 560;
  const H_SVG = 340;

  const leftX = 58;
  const rightX = 430;
  const topY = 42;
  const lowerShelfY = 205;
  const bottomY = 292;
  const notchX = 172;

  const scale = (lowerShelfY - topY - 16) / Math.max(alturaH, 1);
  const waterY = lowerShelfY - alturaH * scale;

  const hasResult = forcaN > 0;
  const isEquil = hasResult && massaTotalKg > 0;
  const showOpen = hasResult && canOpen && motionOpen;

  const closedA = { x: notchX + 34, y: 150 };
  const closedB = { x: 252, y: lowerShelfY };
  const gateLength = Math.hypot(closedB.x - closedA.x, closedB.y - closedA.y);
  const closedAngle = Math.atan2(closedB.y - closedA.y, closedB.x - closedA.x);
  const targetAngle = Math.max(closedAngle - 0.58, 0.22);
  const openAngle = showOpen ? targetAngle : closedAngle;
  const gateUx = Math.cos(openAngle);
  const gateUy = Math.sin(openAngle);

  const pointA = closedA;
  const pointB = {
    x: pointA.x + gateLength * gateUx,
    y: pointA.y + gateLength * gateUy,
  };
  const openingMidY = (pointB.y + closedB.y) / 2;

  const pulleyX = rightX + 2;
  const pulleyY = waterY - 22;
  const massX = pulleyX + 58;
  const massTopY = Math.min(Math.max(pulleyY + (showOpen ? 120 : 68), 112), 220);
  const massBottomY = massTopY + 52;

  const wall = "#dbeafe";
  const wallDark = "#0f172a";

  useEffect(() => {
    if (!hasResult) {
      setMotionOpen(false);
      return;
    }

    setMotionOpen(false);
    const frame = requestAnimationFrame(() => setMotionOpen(true));
    return () => cancelAnimationFrame(frame);
  }, [hasResult, forcaN, massaTotalKg]);

  return (
    <div className="bg-[#0d1224] rounded-xl border border-slate-800 p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Vista Lateral — Aparato da Prática
        </h3>
        {isEquil && (
          <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
            Equilíbrio
          </span>
        )}
      </div>

      <svg viewBox={`0 0 ${W} ${H_SVG}`} className="w-full" style={{ height: 340 }}>
        <defs>
          <linearGradient id="practiceWater" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(34,211,238,0.28)" />
            <stop offset="100%" stopColor="rgba(8,145,178,0.08)" />
          </linearGradient>
          <linearGradient id="practiceGate" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
          <linearGradient id="practiceSand" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* Água */}
        <polygon
          points={`${leftX},${waterY} ${rightX},${waterY} ${rightX},${lowerShelfY} ${closedB.x},${closedB.y} ${pointA.x},${pointA.y} ${notchX},150 ${leftX},150`}
          fill="url(#practiceWater)"
          className="gate-water-fill"
        />
        <line x1={leftX} y1={waterY} x2={rightX} y2={waterY} stroke="#22d3ee" strokeWidth="2.2" />
        <path
          d={`M${leftX + 35},${waterY + 11} q14,5 0,11 q-14,6 0,12`}
          fill="none"
          stroke="#22d3ee"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="gate-surface-wave"
        />

        {/* Estrutura em degrau, inspirada no desenho da prática */}
        <g fill="none" stroke={wall} strokeWidth="5.5" strokeLinecap="square" strokeLinejoin="round">
          <path d={`M${leftX},${topY} L${leftX},150 L${notchX},150`} />
          <path d={`M${leftX},${lowerShelfY} L${closedB.x + 5},${lowerShelfY}`} />
          <path d={`M${leftX},${lowerShelfY} L${leftX},${bottomY} L${rightX},${bottomY} L${rightX},${waterY}`} />
          <path d={`M${notchX},150 L${pointA.x},${pointA.y}`} />
        </g>
        <g fill="none" stroke={wallDark} strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" opacity="0.55">
          <path d={`M${leftX},${topY} L${leftX},150 L${notchX},150`} />
          <path d={`M${leftX},${lowerShelfY} L${closedB.x + 5},${lowerShelfY}`} />
          <path d={`M${leftX},${lowerShelfY} L${leftX},${bottomY} L${rightX},${bottomY} L${rightX},${waterY}`} />
          <path d={`M${notchX},150 L${pointA.x},${pointA.y}`} />
        </g>

        {/* Vão aberto pela rotação da comporta */}
        {showOpen && (
          <path
            d={`M${closedB.x - 4},${closedB.y - 2} L${pointB.x - 2},${pointB.y + 4} Q${pointB.x + 34},${openingMidY + 1} ${closedB.x + 48},${closedB.y - 1} Q${closedB.x + 18},${closedB.y + 3} ${closedB.x - 4},${closedB.y - 2}`}
            fill="rgba(34,211,238,0.24)"
            stroke="rgba(34,211,238,0.72)"
            strokeWidth="1.5"
            className="gate-water-fill"
          />
        )}

        {/* Comporta A-B */}
        <line
          x1={pointA.x}
          y1={pointA.y}
          x2={pointB.x}
          y2={pointB.y}
          stroke="url(#practiceGate)"
          strokeWidth="11"
          strokeLinecap="round"
          className={showOpen ? "gate-disk gate-disk-open" : "gate-disk"}
          style={{ transition: "all 900ms cubic-bezier(0.34, 1.56, 0.64, 1)" }}
        />
        <line
          x1={pointA.x}
          y1={pointA.y}
          x2={pointB.x}
          y2={pointB.y}
          stroke="#0f172a"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.45"
          style={{ transition: "all 900ms cubic-bezier(0.34, 1.56, 0.64, 1)" }}
        />
        <circle cx={pointA.x} cy={pointA.y} r="4.5" fill="#2563eb" stroke="#dbeafe" strokeWidth="1.2" />
        <circle cx={pointB.x} cy={pointB.y} r="4.5" fill="#2563eb" stroke="#dbeafe" strokeWidth="1.2" />
        <text x={pointA.x - 17} y={pointA.y - 8} fontSize="12" fill="#60a5fa" fontWeight="700">A</text>
        <text x={pointB.x + 9} y={pointB.y + 18} fontSize="12" fill="#60a5fa" fontWeight="700">B</text>

        {/* Cabo / tração T */}
        <path
          d={`M${pointB.x + 5},${pointB.y - 3} C${pointB.x + 84},${pointB.y - 78} ${pulleyX - 75},${pulleyY - 16} ${pulleyX - 11},${pulleyY - 8}`}
          fill="none"
          stroke={wall}
          strokeWidth="4.2"
          strokeLinecap="round"
        />
        <path
          d={`M${pointB.x + 5},${pointB.y - 3} C${pointB.x + 84},${pointB.y - 78} ${pulleyX - 75},${pulleyY - 16} ${pulleyX - 11},${pulleyY - 8}`}
          fill="none"
          stroke="#0f172a"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.45"
        />
        {/* Polia e massa */}
        <g
          className={showOpen ? "practice-pulley practice-pulley-active" : "practice-pulley"}
          style={{
            transformBox: "fill-box",
            transformOrigin: "center",
          }}
        >
          <circle cx={pulleyX} cy={pulleyY} r="18" fill="#0f172a" stroke={wall} strokeWidth="4" />
          <line x1={pulleyX - 13} y1={pulleyY} x2={pulleyX + 13} y2={pulleyY} stroke="#94a3b8" strokeWidth="1.4" />
          <line x1={pulleyX} y1={pulleyY - 13} x2={pulleyX} y2={pulleyY + 13} stroke="#94a3b8" strokeWidth="1.4" />
          <line x1={pulleyX - 9} y1={pulleyY - 9} x2={pulleyX + 9} y2={pulleyY + 9} stroke="#64748b" strokeWidth="1.2" />
          <line x1={pulleyX + 9} y1={pulleyY - 9} x2={pulleyX - 9} y2={pulleyY + 9} stroke="#64748b" strokeWidth="1.2" />
        </g>
        <circle cx={pulleyX} cy={pulleyY} r="7" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
        <path
          d={`M${pulleyX + 15},${pulleyY - 4} C${massX - 4},${pulleyY + 18} ${massX - 4},${massTopY - 22} ${massX},${massTopY}`}
          fill="none"
          stroke={wall}
          strokeWidth="4.2"
          strokeLinecap="round"
          style={{ transition: "all 850ms ease" }}
        />
        <path
          d={`M${pulleyX + 15},${pulleyY - 4} C${massX - 4},${pulleyY + 18} ${massX - 4},${massTopY - 22} ${massX},${massTopY}`}
          fill="none"
          stroke="#0f172a"
          strokeWidth="1.4"
          opacity="0.45"
          style={{ transition: "all 850ms ease" }}
        />
        <rect
          x={massX - 24}
          y={massTopY}
          width="48"
          height="52"
          rx="3"
          fill={isEquil ? "url(#practiceSand)" : "rgba(245,158,11,0.12)"}
          stroke={wall}
          strokeWidth="4"
          style={{ transition: "all 850ms ease" }}
        />
        <text x={massX} y={massBottomY + 50} fontSize="10" fill="#f59e0b" textAnchor="middle" fontWeight="700" style={{ transition: "all 850ms ease" }}>
          {isEquil ? `${(massaTotalKg * 1000).toFixed(1)} g` : "massas"}
        </text>

        {/* Fluxo visível após simular */}
        {showOpen && (
          <g className="gate-flow">
            <path
              d={`M${closedB.x + 1},${closedB.y - 5} C${closedB.x + 45},${closedB.y - 4} ${closedB.x + 98},${closedB.y + 1} ${rightX - 20},${closedB.y + 16} L${rightX - 20},${closedB.y + 36} C${closedB.x + 104},${closedB.y + 20} ${closedB.x + 46},${closedB.y + 13} ${closedB.x + 1},${closedB.y + 8} Z`}
              fill="rgba(34,211,238,0.18)"
              stroke="rgba(34,211,238,0.34)"
              strokeWidth="1"
            />
            <path
              d={`M${rightX - 26},${closedB.y + 18} C${closedB.x + 112},${closedB.y + 6} ${closedB.x + 54},${closedB.y - 2} ${closedB.x + 4},${closedB.y - 2}`}
              fill="none"
              stroke="rgba(34,211,238,0.9)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="14,8"
            />
            <path
              d={`M${rightX - 24},${closedB.y + 42} C${closedB.x + 116},${closedB.y + 22} ${closedB.x + 58},${closedB.y + 14} ${closedB.x + 5},${closedB.y + 10}`}
              fill="none"
              stroke="rgba(34,211,238,0.62)"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeDasharray="12,9"
            />
          </g>
        )}
      </svg>

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-500">
        <span>Comporta A-B</span>
        <span>Polia e massa</span>
        <span>Fluxo d'água</span>
      </div>
    </div>
  );
}
