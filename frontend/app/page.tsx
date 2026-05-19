import Link from "next/link";
import { FlaskConical, BookOpen, FileText, Waves, ArrowRight, Gauge, Activity, Database } from "lucide-react";

const features = [
  {
    icon: FlaskConical,
    title: "Simulador Interativo",
    description: "Insira os dados experimentais e obtenha cálculos automáticos de pressão, força e torque em tempo real.",
    href: "/simulator",
    color: "cyan",
  },
  {
    icon: BookOpen,
    title: "Área Teórica",
    description: "Fundamentos de mecânica dos fluidos, equações e exemplos práticos para aprendizado.",
    href: "/theory",
    color: "blue",
  },
  {
    icon: FileText,
    title: "Relatórios",
    description: "Histórico completo de experimentos com comparação teórico-experimental e exportação de dados.",
    href: "/reports",
    color: "green",
  },
];

const stats = [
  { icon: Gauge, label: "Pressão Hidrostática", value: "P = ρgh" },
  { icon: Activity, label: "Força Resultante", value: "F = P·A" },
  { icon: Database, label: "Equilíbrio", value: "ΣM = 0" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden px-8 py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-6">
            <Waves size={12} />
            Mecânica dos Fluidos — ENGENHARIA
          </div>

          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Simulador de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Comporta Hidrostática
            </span>
          </h1>

          <p className="text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed">
            Plataforma educacional para simulação, análise e visualização de experimentos
            com comportas circulares submetidas à pressão hidrostática.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/simulator"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-[#0a0e1a] font-semibold rounded-lg transition-colors"
            >
              <FlaskConical size={18} />
              Abrir Simulador
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/theory"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg border border-slate-700 transition-colors"
            >
              <BookOpen size={18} />
              Área Teórica
            </Link>
          </div>
        </div>

        {/* Equations row */}
        <div className="mt-16 grid grid-cols-3 gap-4 max-w-2xl">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-[#111827] border border-slate-800 rounded-lg p-4 text-center">
              <Icon size={20} className="text-cyan-400 mx-auto mb-2" />
              <p className="text-slate-400 text-xs mb-1">{label}</p>
              <p className="font-mono text-cyan-300 font-medium">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-8 pb-20">
        <h2 className="text-2xl font-bold text-white mb-8">Funcionalidades</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description, href, color }) => (
            <Link
              key={href}
              href={href}
              className="group bg-[#111827] border border-slate-800 hover:border-cyan-500/30 rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.05)]"
            >
              <div className={`w-10 h-10 rounded-lg bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center mb-4`}>
                <Icon size={20} className={`text-${color}-400`} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
              <div className="mt-4 flex items-center gap-1 text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">
                Acessar <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Experiment data */}
      <section className="px-8 pb-20">
        <h2 className="text-2xl font-bold text-white mb-8">Dados do Experimento de Referência</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Diâmetro da Comporta", value: "75,1 mm", sub: "média: D1=74,7 / D2=75,5" },
            { label: "Altura da Água (H)", value: "25 cm", sub: "nível do reservatório" },
            { label: "Altura do Centro (H')", value: "13 cm", sub: "centro da comporta" },
            { label: "Massa de Areia", value: "~246 g", sub: "média das medições" },
          ].map((item) => (
            <div key={item.label} className="bg-[#111827] border border-slate-800 rounded-lg p-4">
              <p className="text-xs text-slate-500 mb-1">{item.label}</p>
              <p className="text-xl font-bold font-mono text-cyan-400">{item.value}</p>
              <p className="text-xs text-slate-600 mt-1">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
