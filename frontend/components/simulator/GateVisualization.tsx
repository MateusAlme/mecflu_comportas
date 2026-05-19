"use client";

interface Props {
  alturaH: number;
  alturaHLinha: number;
  diametroMm: number;
  forcaN?: number;
  excentricidadeMm?: number;
  massaTotalKg?: number;
  angulo?: number;
}

export default function GateVisualization({
  alturaH,
  alturaHLinha,
  diametroMm,
  forcaN = 0,
  excentricidadeMm = 0,
  massaTotalKg = 0,
  angulo = 60,
}: Props) {
  const W = 430;
  const H_SVG = 320;

  // ── Geometria do tanque ──────────────────────────────────────────────────
  const tankLeft = 52;
  const tankRight = 183;
  const tankBottom = 268;
  const tankTop = 30;

  const scale = (tankBottom - tankTop - 8) / Math.max(alturaH * 1.12, 1);
  const waterTopY = tankBottom - alturaH * scale;

  // ── Ângulo exibido (animado via CSS) ─────────────────────────────────────
  // Sem simulação: comporta quase horizontal (água "ganha")
  // Com simulação:  comporta no ângulo de equilíbrio (massa "levanta")
  const displayAngle = forcaN > 0 ? angulo : Math.max(angulo * 0.20, 9);
  const cosD = Math.cos((displayAngle * Math.PI) / 180);
  const sinD = Math.sin((displayAngle * Math.PI) / 180);

  // ── Geometria fixa (baseada no ângulo de equilíbrio) ──────────────────────
  const eqRad = (angulo * Math.PI) / 180;
  const sinEq = Math.sin(eqRad);
  const cosEq = Math.cos(eqRad);

  // distância do pivô A ao centróide G ao longo da comporta (fixa)
  const distG = (alturaHLinha * scale) / sinEq;
  const gateHalf = Math.min(Math.max(((diametroMm / 2) / 10) * scale, 13), 28);
  const excPx = Math.max((excentricidadeMm / 10) * scale * 2.5, excentricidadeMm > 0 ? 5 : 0);
  const fLen = Math.min(Math.max(forcaN * 5, 22), 50);

  // ── Pivô A ────────────────────────────────────────────────────────────────
  const pivotX = tankRight;
  const pivotY = tankBottom;

  // ── Posições no mundo (após rotação) ─────────────────────────────────────
  // Ponto (d, 0) na comporta horizontal → após rotate(-displayAngle, pivotX, pivotY):
  //   world_x = pivotX + d·cos(displayAngle)
  //   world_y = pivotY - d·sin(displayAngle)
  const wPos = (d: number) => ({
    x: pivotX + d * cosD,
    y: pivotY - d * sinD,
  });

  const gcW = wPos(distG);
  const cpW = wPos(distG - excPx);
  const gTopW = wPos(distG + gateHalf);   // extremidade superior

  // Normal exterior (aponta para fora d'água): em pré-rotação = (0,+1) → pós = (sinD, cosD)
  const fEnd = { x: cpW.x + sinD * fLen, y: cpW.y + cosD * fLen };

  // ── Sistema de cabo e massas ─────────────────────────────────────────────
  const pulleyX = W - 42;
  const pulleyY = tankTop + 6;

  // comprimento fixo do cabo (calculado no ângulo de equilíbrio)
  const gTopEq = { x: pivotX + (distG + gateHalf) * cosEq, y: pivotY - (distG + gateHalf) * sinEq };
  const cordGateEq = Math.hypot(pulleyX - gTopEq.x, pulleyY - gTopEq.y);
  const massDesiredAtEq = 158; // posição do topo das massas no equilíbrio (px Y)
  const cordTotal = cordGateEq + (massDesiredAtEq - pulleyY);

  // comprimento atual do cabo até o topo da comporta
  const cordGate = Math.hypot(pulleyX - gTopW.x, pulleyY - gTopW.y);
  const cordMass = Math.max(cordTotal - cordGate, 18);
  const massTopY = Math.min(pulleyY + cordMass, 218);
  const massBotY = massTopY + 52;

  // ── Coordenadas pré-rotação (comporta horizontal em y=pivotY) ─────────────
  // Tudo dentro do <g> rotacionado usa estas coords SVG brutas
  const preX = (d: number) => pivotX + d;
  const preY = pivotY; // y fixo (linha horizontal)
  const thick = 3.8;   // espessura visual da placa

  const hasResult = forcaN > 0;
  const isEquil = hasResult && massaTotalKg > 0;

  return (
    <div className="bg-[#0d1224] rounded-xl border border-slate-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Vista Lateral — Bancada da Comporta
        </h3>
        {isEquil && (
          <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
            Equilíbrio ✓
          </span>
        )}
        {!hasResult && (
          <span className="text-xs text-slate-600 italic">pressão ↓ comporta</span>
        )}
      </div>

      <svg viewBox={`0 0 ${W} ${H_SVG}`} className="w-full" style={{ height: 320 }}>
        <defs>
          <linearGradient id="vl_water" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(34,211,238,0.30)" />
            <stop offset="100%" stopColor="rgba(8,100,145,0.20)" />
          </linearGradient>
          <linearGradient id="vl_gate" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          <linearGradient id="vl_sand" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(251,191,36,0.6)" />
            <stop offset="100%" stopColor="rgba(180,83,9,0.7)" />
          </linearGradient>
          <marker id="vl_arrF" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="#ef4444" />
          </marker>
          <marker id="vl_arrW" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
          </marker>
        </defs>

        {/* ── Chão ─────────────────────────────────────── */}
        <rect x={tankLeft - 12} y={tankBottom} width={W - tankLeft + 6} height={10} fill="#1a2744" rx={2} />

        {/* ── Tanque ───────────────────────────────────── */}
        <rect x={tankLeft - 12} y={tankTop} width={12} height={tankBottom - tankTop} fill="#1e3a5f" />
        <rect x={tankLeft - 12} y={tankBottom - 6} width={tankRight - tankLeft + 12} height={6} fill="#1e3a5f" />
        {/* parede direita acima do topo da comporta */}
        {gTopW.y > tankTop && (
          <rect x={tankRight} y={tankTop} width={9} height={Math.max(gTopW.y - tankTop, 0)} fill="#1e3a5f" />
        )}
        <text x={tankLeft} y={tankTop - 8} fontSize="9" fill="#93c5fd" fontWeight="600">
          Reservatório
        </text>

        {/* ── Água ─────────────────────────────────────── */}
        {waterTopY < tankBottom && (
          <rect
            x={tankLeft} y={waterTopY}
            width={tankRight - tankLeft} height={tankBottom - waterTopY}
            fill="url(#vl_water)" className="gate-water-fill"
          />
        )}
        {waterTopY < tankBottom && (
          <path
            d={`M${tankLeft},${waterTopY} Q${tankLeft + 35},${waterTopY - 4} ${tankLeft + 70},${waterTopY} Q${tankLeft + 105},${waterTopY + 4} ${tankRight},${waterTopY}`}
            fill="none" stroke="rgba(34,211,238,0.62)" strokeWidth="1.6"
            className="gate-surface-wave"
          />
        )}
        <text
          x={(tankLeft + tankRight) / 2 - 10} y={(waterTopY + tankBottom) / 2 + 5}
          fontSize="11" fill="rgba(186,230,253,0.40)" fontStyle="italic"
        >
          Água
        </text>

        {/* ── Cota H ───────────────────────────────────── */}
        {waterTopY < tankBottom && (
          <>
            <line x1={tankLeft - 26} y1={waterTopY} x2={tankLeft - 26} y2={tankBottom} stroke="#22d3ee" strokeWidth="1" />
            <line x1={tankLeft - 30} y1={waterTopY} x2={tankLeft - 22} y2={waterTopY} stroke="#22d3ee" strokeWidth="1" />
            <line x1={tankLeft - 30} y1={tankBottom} x2={tankLeft - 22} y2={tankBottom} stroke="#22d3ee" strokeWidth="1" />
            <text x={tankLeft - 38} y={(waterTopY + tankBottom) / 2 + 4} fontSize="10" fill="#22d3ee" textAnchor="middle">H</text>
          </>
        )}

        {/* ── Cota H' (referência no ângulo de equilíbrio) ── */}
        {(() => {
          const gcEq = { x: pivotX + distG * cosEq, y: pivotY - distG * sinEq };
          return (
            <>
              <line x1={tankRight + 22} y1={gcEq.y} x2={tankRight + 22} y2={tankBottom}
                stroke="#64748b" strokeWidth="1" strokeDasharray="3,2" />
              <line x1={tankRight + 18} y1={gcEq.y} x2={tankRight + 26} y2={gcEq.y} stroke="#64748b" strokeWidth="1" />
              <text x={tankRight + 28} y={(gcEq.y + tankBottom) / 2 + 4} fontSize="9" fill="#64748b">H'</text>
            </>
          );
        })()}

        {/* ── Linha de nível até a comporta ─────────────── */}
        {waterTopY < tankBottom && (
          <line x1={tankRight} y1={waterTopY} x2={tankRight + 38} y2={waterTopY}
            stroke="#22d3ee" strokeWidth="1" strokeDasharray="4,3" opacity="0.35" />
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            COMPORTA (grupo rotacionado com transição CSS)
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            Em espaço pré-rotação: comporta = linha horizontal em y=pivotY
            O rotate(-displayAngle) em torno de A faz ela se levantar.     */}
        <g
          style={{
            transform: `rotate(${-displayAngle}deg)`,
            transformOrigin: `${pivotX}px ${pivotY}px`,
            transformBox: "view-box",
            transition: "transform 0.85s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {/* sombra (baixo = fora da água após rotação) */}
          <line
            x1={preX(distG - gateHalf)} y1={preY + thick}
            x2={preX(distG + gateHalf)} y2={preY + thick}
            stroke="rgba(30,60,100,0.6)" strokeWidth="7" strokeLinecap="butt"
          />
          {/* face principal da placa */}
          <line
            x1={preX(distG - gateHalf)} y1={preY}
            x2={preX(distG + gateHalf)} y2={preY}
            stroke="url(#vl_gate)" strokeWidth="7" strokeLinecap="butt"
          />
          {/* realce (lado da água = cima em pré-rotação) */}
          <line
            x1={preX(distG - gateHalf)} y1={preY - thick * 0.55}
            x2={preX(distG + gateHalf)} y2={preY - thick * 0.55}
            stroke="rgba(226,232,240,0.22)" strokeWidth="2" strokeLinecap="butt"
          />

          {/* Vetor F (pré-rotação: aponta para baixo = para fora d'água após rotação) */}
          {hasResult && (
            <line
              x1={preX(distG - excPx)} y1={preY}
              x2={preX(distG - excPx)} y2={preY + fLen}
              stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#vl_arrF)"
            />
          )}
        </g>

        {/* ── Centróide G (world coords) ─────────────────── */}
        <circle cx={gcW.x} cy={gcW.y} r={4} fill="#22d3ee" stroke="#0d1224" strokeWidth="1" />
        <text x={gcW.x - sinD * 14 - 5} y={gcW.y - cosD * 14 + 3} fontSize="9" fill="#22d3ee" fontWeight="bold">G</text>

        {/* ── Centro de pressão CP (world coords) ──────────── */}
        {hasResult && (
          <>
            <circle cx={cpW.x} cy={cpW.y} r={4} fill="#f59e0b" stroke="#0d1224" strokeWidth="1" />
            <text x={cpW.x - sinD * 16 - 7} y={cpW.y - cosD * 16 + 3} fontSize="9" fill="#f59e0b" fontWeight="bold">CP</text>
          </>
        )}

        {/* ── Label F (world coords) ────────────────────── */}
        {hasResult && (
          <text
            x={fEnd.x + sinD * 6 + 2}
            y={fEnd.y + cosD * 6 - 3}
            fontSize="9" fill="#ef4444" fontWeight="bold"
          >
            F={forcaN.toFixed(2)} N
          </text>
        )}

        {/* ── Pivô A ───────────────────────────────────────── */}
        <circle cx={pivotX} cy={pivotY} r={5.5} fill="#64748b" stroke="#e2e8f0" strokeWidth="1.5" />
        <text x={pivotX + 8} y={pivotY + 4} fontSize="9" fill="#94a3b8" fontWeight="bold">A</text>

        {/* ── Arco do ângulo em A ─────────────────────────── */}
        {(() => {
          const r = 24;
          const ax = pivotX + r * cosD;
          const ay = pivotY - r * sinD;
          return (
            <>
              <line x1={pivotX - 38} y1={pivotY} x2={pivotX} y2={pivotY}
                stroke="#475569" strokeWidth="1" strokeDasharray="3,2" />
              <path d={`M${pivotX - r},${pivotY} A${r},${r} 0 0,0 ${ax},${ay}`}
                fill="none" stroke="#94a3b8" strokeWidth="1"
                style={{ transition: "d 0.85s ease-in-out" }}
              />
              <text x={pivotX - r * 0.52 + 2} y={pivotY - r * 0.4}
                fontSize="9" fill="#94a3b8"
              >
                {Math.round(displayAngle)}°
              </text>
            </>
          );
        })()}

        {/* ── Cabo: topo da comporta → polia ───────────────── */}
        <line
          x1={gTopW.x} y1={gTopW.y}
          x2={pulleyX - 7} y2={pulleyY + 5}
          stroke="#94a3b8" strokeWidth="1.5"
        />

        {/* ── Suporte + polia ───────────────────────────────── */}
        <rect x={pulleyX - 2} y={tankTop} width={4} height={pulleyY - tankTop + 1} fill="#334155" />
        <circle cx={pulleyX} cy={pulleyY} r={8} fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
        <circle cx={pulleyX} cy={pulleyY} r={3} fill="#64748b" />

        {/* ── Cabo vertical: polia → massas ─────────────────── */}
        <line x1={pulleyX} y1={pulleyY + 8} x2={pulleyX} y2={massTopY}
          stroke="#94a3b8" strokeWidth="1.5" />

        {/* ── Gancho ────────────────────────────────────────── */}
        <path
          d={`M${pulleyX},${massTopY} C${pulleyX + 10},${massTopY + 7} ${pulleyX + 10},${massTopY + 15} ${pulleyX},${massTopY + 15}`}
          fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"
        />
        <text x={pulleyX - 30} y={massTopY + 9} fontSize="8" fill="#f59e0b">Gancho</text>

        {/* ── Recipiente ────────────────────────────────────── */}
        <path d={`M${pulleyX - 22},${massTopY + 17} L${pulleyX + 22},${massTopY + 17}`}
          stroke="#f59e0b" strokeWidth="2" />
        <rect
          x={pulleyX - 22} y={massTopY + 16}
          width={44} height={massBotY - massTopY - 16}
          rx={3} fill="rgba(245,158,11,0.10)" stroke="#f59e0b" strokeWidth="1.5"
        />
        {isEquil && (
          <rect
            x={pulleyX - 19} y={massTopY + 30}
            width={38} height={massBotY - massTopY - 35}
            rx={2} fill="url(#vl_sand)"
          />
        )}
        {/* alça */}
        <path
          d={`M${pulleyX - 22},${massTopY + 22} L${pulleyX - 27},${massTopY + 17} L${pulleyX + 27},${massTopY + 17} L${pulleyX + 22},${massTopY + 22}`}
          fill="none" stroke="#f59e0b" strokeWidth="1.5"
        />

        <text x={pulleyX} y={massBotY + 14} fontSize="9" fill="#f59e0b" textAnchor="middle" fontWeight="600">
          {isEquil ? `m_T = ${(massaTotalKg * 1000).toFixed(1)} g` : "Massas"}
        </text>

        {/* seta peso W */}
        <line x1={pulleyX} y1={massBotY + 1} x2={pulleyX} y2={massBotY + 22}
          stroke="#64748b" strokeWidth="1.5" markerEnd="url(#vl_arrW)" />
        <text x={pulleyX + 5} y={massBotY + 20} fontSize="8" fill="#64748b">W</text>

        {/* ── Fluxo de água saindo (animado quando portão abre) ── */}
        {hasResult && (
          <g className="gate-flow">
            <path
              d={`M${tankRight + 5},${tankBottom - 22} Q${tankRight + 65},${tankBottom - 14} ${tankRight + 140},${tankBottom - 26}`}
              fill="none" stroke="rgba(34,211,238,0.60)" strokeWidth="2"
              strokeDasharray="10,6"
            />
            <path
              d={`M${tankRight + 5},${tankBottom - 42} Q${tankRight + 70},${tankBottom - 34} ${tankRight + 140},${tankBottom - 48}`}
              fill="none" stroke="rgba(34,211,238,0.48)" strokeWidth="1.8"
              strokeDasharray="10,6"
            />
            <path
              d={`M${tankRight + 5},${tankBottom - 62} Q${tankRight + 75},${tankBottom - 54} ${tankRight + 140},${tankBottom - 69}`}
              fill="none" stroke="rgba(34,211,238,0.35)" strokeWidth="1.5"
              strokeDasharray="10,6"
            />
          </g>
        )}
      </svg>

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" /> Centróide (G)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" /> Centro de Pressão
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-400" /> F hidrostática
        </span>
      </div>
    </div>
  );
}
