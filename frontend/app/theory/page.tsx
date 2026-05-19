import type { ReactNode, ElementType } from "react";
import { BookOpen, Waves, Zap, Scale, Calculator, Ruler, Droplets, Weight } from "lucide-react";

interface SectionProps {
  title: string;
  subtitle: string;
  icon: ElementType;
  children: ReactNode;
}

function Section({ title, subtitle, icon: Icon, children }: SectionProps) {
  return (
    <section className="bg-[#111827] border border-slate-800 rounded-xl p-5 lg:p-6">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
          <Icon size={18} className="text-cyan-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Formula({ eq, desc, tone = "cyan" }: { eq: string; desc: string; tone?: "cyan" | "amber" | "blue" | "emerald" }) {
  const tones = {
    cyan: "border-cyan-500/15 text-cyan-300 bg-cyan-500/[0.04]",
    amber: "border-amber-500/15 text-amber-300 bg-amber-500/[0.04]",
    blue: "border-blue-500/15 text-blue-300 bg-blue-500/[0.04]",
    emerald: "border-emerald-500/15 text-emerald-300 bg-emerald-500/[0.04]",
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-[#0d1224] p-3">
      <div className={`rounded-md border px-3 py-2 font-mono text-sm ${tones[tone]}`}>
        {eq}
      </div>
      <p className="text-xs text-slate-500 mt-2">{desc}</p>
    </div>
  );
}

function Var({ sym, desc, unit }: { sym: string; desc: string; unit: string }) {
  return (
    <div className="grid grid-cols-[56px_1fr_auto] items-baseline gap-3 py-2 border-b border-slate-800/60 last:border-0">
      <span className="font-mono text-cyan-300 text-sm">{sym}</span>
      <span className="text-slate-300 text-sm">{desc}</span>
      <span className="text-slate-500 text-xs font-mono">{unit}</span>
    </div>
  );
}

function ConceptCard({ icon: Icon, title, value, desc }: { icon: ElementType; title: string; value: string; desc: string }) {
  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
          <Icon size={16} className="text-cyan-400" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">{title}</p>
          <p className="font-mono text-lg text-white mt-0.5">{value}</p>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-3 leading-relaxed">{desc}</p>
    </div>
  );
}

function PressureDiagram() {
  return (
    <svg viewBox="0 0 360 220" className="w-full h-auto min-h-[220px]">
      <defs>
        <linearGradient id="pressureWater" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(34,211,238,0.18)" />
          <stop offset="100%" stopColor="rgba(14,116,144,0.54)" />
        </linearGradient>
        <linearGradient id="pressureRamp" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(34,211,238,0.08)" />
          <stop offset="100%" stopColor="rgba(34,211,238,0.68)" />
        </linearGradient>
      </defs>
      <rect x="42" y="28" width="110" height="166" fill="url(#pressureWater)" stroke="#1e3a5f" strokeWidth="8" />
      <path d="M42 42 Q70 35 98 42 T152 42" fill="none" stroke="#22d3ee" strokeWidth="2" />
      <path d="M184 42 L308 194 L184 194 Z" fill="url(#pressureRamp)" stroke="#22d3ee" strokeWidth="1.5" />
      <line x1="184" y1="42" x2="184" y2="194" stroke="#64748b" strokeDasharray="4 4" />
      <line x1="32" y1="42" x2="20" y2="42" stroke="#22d3ee" />
      <line x1="32" y1="194" x2="20" y2="194" stroke="#22d3ee" />
      <line x1="24" y1="42" x2="24" y2="194" stroke="#22d3ee" strokeDasharray="3 3" />
      <text x="12" y="122" fill="#22d3ee" fontSize="11" transform="rotate(-90 12 122)">h</text>
      <text x="54" y="23" fill="#93c5fd" fontSize="11">superfície livre</text>
      <text x="210" y="37" fill="#94a3b8" fontSize="11">P quase nula</text>
      <text x="226" y="207" fill="#22d3ee" fontSize="11">P aumenta com h</text>
    </svg>
  );
}

function GateDiagram() {
  return (
    <svg viewBox="0 0 360 240" className="w-full h-auto min-h-[240px]">
      <defs>
        <linearGradient id="gateWater" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(34,211,238,0.24)" />
          <stop offset="100%" stopColor="rgba(14,116,144,0.36)" />
        </linearGradient>
      </defs>
      <rect x="50" y="28" width="136" height="176" fill="url(#gateWater)" stroke="#1e3a5f" strokeWidth="8" />
      <path d="M54 45 Q86 38 118 45 T182 45" fill="none" stroke="#22d3ee" strokeWidth="2" />
      <rect x="186" y="28" width="12" height="176" fill="#1e3a5f" />
      <circle cx="198" cy="132" r="33" fill="rgba(148,163,184,0.5)" stroke="#cbd5e1" strokeWidth="2" />
      <circle cx="198" cy="132" r="4" fill="#22d3ee" />
      <text x="207" y="136" fill="#22d3ee" fontSize="11">G</text>
      <circle cx="198" cy="148" r="4" fill="#f59e0b" />
      <text x="207" y="152" fill="#f59e0b" fontSize="11">CP</text>
      <line x1="126" y1="148" x2="178" y2="148" stroke="#ef4444" strokeWidth="3" markerEnd="url(#theoryArrow)" />
      <line x1="224" y1="132" x2="306" y2="88" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
      <line x1="306" y1="88" x2="306" y2="176" stroke="#f59e0b" strokeWidth="2" />
      <path d="M286 176 L326 176 L320 216 L292 216 Z" fill="rgba(245,158,11,0.16)" stroke="#f59e0b" strokeWidth="2" />
      <text x="112" y="139" fill="#ef4444" fontSize="11" fontWeight="700">F_R</text>
      <text x="256" y="78" fill="#94a3b8" fontSize="11">braço</text>
      <text x="278" y="231" fill="#f59e0b" fontSize="11">massas</text>
      <defs>
        <marker id="theoryArrow" markerWidth="7" markerHeight="7" refX="7" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 Z" fill="#ef4444" />
        </marker>
      </defs>
    </svg>
  );
}

function MomentDiagram() {
  return (
    <svg viewBox="0 0 360 180" className="w-full h-auto min-h-[210px]">
      <line x1="56" y1="96" x2="304" y2="96" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
      <polygon points="174,104 186,104 180,88" fill="#22d3ee" />
      <circle cx="180" cy="96" r="6" fill="#0d1224" stroke="#22d3ee" strokeWidth="2" />
      <line x1="116" y1="96" x2="116" y2="42" stroke="#ef4444" strokeWidth="3" markerEnd="url(#momentArrowUp)" />
      <line x1="272" y1="96" x2="272" y2="150" stroke="#f59e0b" strokeWidth="3" markerEnd="url(#momentArrowDown)" />
      <path d="M128 75 A58 58 0 0 1 172 42" fill="none" stroke="#ef4444" strokeDasharray="4 4" />
      <path d="M190 42 A58 58 0 0 1 260 78" fill="none" stroke="#f59e0b" strokeDasharray="4 4" />
      <text x="96" y="33" fill="#ef4444" fontSize="12" fontWeight="700">M_água</text>
      <text x="246" y="166" fill="#f59e0b" fontSize="12" fontWeight="700">M_massa</text>
      <text x="164" y="124" fill="#22d3ee" fontSize="11">pivô</text>
      <text x="96" y="114" fill="#94a3b8" fontSize="11">e</text>
      <text x="226" y="114" fill="#94a3b8" fontSize="11">L</text>
      <defs>
        <marker id="momentArrowUp" markerWidth="7" markerHeight="7" refX="3.5" refY="0" orient="auto">
          <path d="M0,7 L3.5,0 L7,7 Z" fill="#ef4444" />
        </marker>
        <marker id="momentArrowDown" markerWidth="7" markerHeight="7" refX="3.5" refY="7" orient="auto">
          <path d="M0,0 L3.5,7 L7,0 Z" fill="#f59e0b" />
        </marker>
      </defs>
    </svg>
  );
}

const referenceRows = [
  { g: "Diâmetro D", vals: "74,7 mm / 75,5 mm", med: "75,1 mm" },
  { g: "Massa da comporta", vals: "27,20 / 27,23 / 27,26 g", med: "27,23 g" },
  { g: "Massa do gancho", vals: "5,36 g", med: "5,36 g" },
  { g: "Massa do recipiente", vals: "15,74 g", med: "15,74 g" },
  { g: "Altura H (água)", vals: "25 cm", med: "25 cm" },
  { g: "Altura H' (centro)", vals: "13 cm", med: "13 cm" },
  { g: "Massa de areia", vals: "246,79 / 246,38 / 249,91 / 249,74 / 236,08 g", med: "~245,8 g" },
];

export default function TheoryPage() {
  return (
    <div className="p-6 w-full max-w-none">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-4">
          <BookOpen size={12} />
          Área Educacional
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Mecânica dos Fluidos</h1>
        <p className="text-slate-400 max-w-2xl">
          Fundamentos teóricos para interpretar a simulação, os gráficos e o experimento de comporta hidrostática.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <ConceptCard
          icon={Droplets}
          title="Pressão"
          value="P = ρgh"
          desc="A profundidade define a pressão local. Mais fundo significa maior carregamento."
        />
        <ConceptCard
          icon={Zap}
          title="Resultante"
          value="F_R = P_G A"
          desc="A força equivalente atua na superfície circular da comporta."
        />
        <ConceptCard
          icon={Scale}
          title="Equilíbrio"
          value="ΣM = 0"
          desc="A massa no braço compensa o torque causado pela água."
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="space-y-6 xl:col-span-7">
          <Section title="Pressão Hidrostática" subtitle="O carregamento cresce de forma linear com a profundidade." icon={Waves}>
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(280px,0.85fr)_minmax(380px,1.15fr)] gap-5 items-center">
              <div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  Em um fluido parado, cada camada sustenta o peso do fluido acima dela. Por isso, a pressão na superfície livre é baixa e aumenta conforme a profundidade cresce.
                </p>
                <Formula eq="P = ρ · g · h" desc="Pressão local abaixo da superfície livre." />
                <div className="mt-4 bg-[#0d1224] border border-slate-800 rounded-lg p-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Variáveis</p>
                  <Var sym="P" desc="Pressão hidrostática" unit="Pa" />
                  <Var sym="ρ" desc="Densidade do fluido" unit="kg/m³" />
                  <Var sym="g" desc="Aceleração gravitacional" unit="m/s²" />
                  <Var sym="h" desc="Profundidade" unit="m" />
                </div>
              </div>
              <div className="bg-[#0d1224] border border-slate-800 rounded-xl p-3 min-w-0">
                <PressureDiagram />
              </div>
            </div>
          </Section>

          <Section title="Força, Centróide e Centro de Pressão" subtitle="A resultante não atua exatamente no centro geométrico." icon={Calculator}>
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(320px,0.9fr)_minmax(420px,1.1fr)] gap-5 items-start">
              <div className="space-y-3">
                <p className="text-slate-300 text-sm leading-relaxed">
                  A força total é calculada usando a pressão no centróide da área. Como a pressão é maior na parte inferior, o centro de pressão fica abaixo do centróide.
                </p>
                <Formula eq="F_R = P_G · A = ρ · g · ȳ · A" desc="Força resultante sobre a placa circular." tone="blue" />
                <Formula eq="A = π · r²" desc="Área da comporta circular." />
                <Formula eq="y_CP = ȳ + I_G / (ȳ · A)" desc="Profundidade do centro de pressão." tone="amber" />
                <Formula eq="I_G = π · r⁴ / 4" desc="Momento de inércia da área circular." tone="amber" />
              </div>
              <div className="bg-[#0d1224] border border-slate-800 rounded-xl p-3 min-w-0">
                <GateDiagram />
              </div>
            </div>
          </Section>
        </div>

        <div className="space-y-6 xl:col-span-5">
          <Section title="Equilíbrio de Momentos" subtitle="O experimento compara o torque da água com o torque das massas." icon={Scale}>
            <div className="space-y-4">
              <div className="bg-[#0d1224] border border-slate-800 rounded-xl p-3 min-w-0">
                <MomentDiagram />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Formula eq="M_água = F_R · e" desc="Torque gerado pela força hidrostática." tone="blue" />
                <Formula eq="M_massa = m_total · g · L" desc="Torque gerado pelo conjunto de massas." tone="emerald" />
                <Formula eq="m_teórico = F_R · e / (g · L)" desc="Massa calculada para o equilíbrio." tone="amber" />
                <Formula eq="m_total = m_gancho + m_recipiente + m_areia" desc="Massa experimental medida no ensaio." />
              </div>
            </div>
          </Section>

          <Section title="Leitura do Experimento" subtitle="Como conectar os valores da bancada com o simulador." icon={Ruler}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#0d1224] border border-slate-800 rounded-lg p-3">
                <Waves size={18} className="text-cyan-400 mb-2" />
                <p className="text-sm font-semibold text-slate-200">Nível H</p>
                <p className="text-xs text-slate-500 mt-1">Define a lâmina d'água e a pressão disponível.</p>
              </div>
              <div className="bg-[#0d1224] border border-slate-800 rounded-lg p-3">
                <Zap size={18} className="text-red-400 mb-2" />
                <p className="text-sm font-semibold text-slate-200">Força F_R</p>
                <p className="text-xs text-slate-500 mt-1">Empurra a comporta e produz torque no pivô.</p>
              </div>
              <div className="bg-[#0d1224] border border-slate-800 rounded-lg p-3">
                <Weight size={18} className="text-amber-400 mb-2" />
                <p className="text-sm font-semibold text-slate-200">Massas</p>
                <p className="text-xs text-slate-500 mt-1">Contrabalançam o momento causado pela água.</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-lg">
              <p className="text-xs text-cyan-400 font-medium mb-1">Exemplo rápido</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Para água a 12 cm de profundidade: <span className="font-mono text-cyan-300">P = 1000 × 9,81 × 0,12 = 1177,2 Pa</span>.
                Esse é o mesmo raciocínio usado nos cartões de resultado do simulador.
              </p>
            </div>
          </Section>

          <Section title="Dados de Referência" subtitle="Valores medidos no laboratório usados como ponto de partida." icon={BookOpen}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-500 border-b border-slate-800">
                    <th className="text-left py-2 pr-4">Grandeza</th>
                    <th className="text-right py-2 pr-4">Valor(es)</th>
                    <th className="text-right py-2">Média</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  {referenceRows.map((row) => (
                    <tr key={row.g} className="border-b border-slate-800/40 last:border-0">
                      <td className="py-2 pr-4 text-slate-300">{row.g}</td>
                      <td className="py-2 pr-4 text-right font-mono text-xs text-slate-500">{row.vals}</td>
                      <td className="py-2 text-right font-mono text-cyan-300 font-medium">{row.med}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
