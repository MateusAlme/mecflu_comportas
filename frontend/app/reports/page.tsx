"use client";
import { useState, useEffect } from "react";
import { api, Experimento } from "@/lib/api";
import { Trash2, RefreshCw, FlaskConical, Calendar, Ruler, Droplets } from "lucide-react";
import { clsx } from "clsx";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function erroColor(erro: number) {
  if (erro < 5) return "text-emerald-400";
  if (erro < 15) return "text-amber-400";
  return "text-red-400";
}

export default function ReportsPage() {
  const [experimentos, setExperimentos] = useState<Experimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandido, setExpandido] = useState<number | null>(null);
  const [deletando, setDeletando] = useState<number | null>(null);

  const carregar = async () => {
    setLoading(true);
    try {
      const data = await api.listarExperimentos();
      setExperimentos(data);
    } catch {
      setExperimentos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const handleDeletar = async (id: number) => {
    if (!confirm("Deseja excluir este experimento?")) return;
    setDeletando(id);
    await api.deletarExperimento(id);
    await carregar();
    setDeletando(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Relatórios</h1>
          <p className="text-slate-400 text-sm mt-1">
            Histórico de experimentos salvos
          </p>
        </div>
        <button
          onClick={carregar}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:border-slate-600 text-sm"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Atualizar
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 text-slate-500">
          <RefreshCw size={24} className="animate-spin mr-3" /> Carregando...
        </div>
      ) : experimentos.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-[#111827] border border-slate-800 rounded-xl text-slate-500">
          <FlaskConical size={40} className="mb-3 opacity-20" />
          <p className="text-sm">Nenhum experimento salvo ainda</p>
          <p className="text-xs mt-1">Vá ao Simulador e salve um experimento</p>
        </div>
      ) : (
        <div className="space-y-4">
          {experimentos.map((exp) => (
            <div key={exp.id} className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden">
              {/* Header do experimento */}
              <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-800/30 transition-colors"
                onClick={() => setExpandido(expandido === exp.id ? null : exp.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <FlaskConical size={18} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{exp.nome}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Calendar size={10} /> {formatDate(exp.data_criacao)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Ruler size={10} /> Ø {exp.diametro_mm} mm
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Droplets size={10} /> H={exp.altura_h_cm} cm
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">
                    {exp.medicoes.length} medição(ões)
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeletar(exp.id); }}
                    disabled={deletando === exp.id}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Medições expandidas */}
              {expandido === exp.id && exp.medicoes.length > 0 && (
                <div className="border-t border-slate-800 p-5">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Medições
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs text-slate-500 border-b border-slate-800">
                          <th className="text-left py-2 pr-4">Nº</th>
                          <th className="text-right py-2 pr-4">Areia (g)</th>
                          <th className="text-right py-2 pr-4">F (N)</th>
                          <th className="text-right py-2 pr-4">τ Teórico (N·m)</th>
                          <th className="text-right py-2 pr-4">τ Experimental (N·m)</th>
                          <th className="text-right py-2">Erro (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {exp.medicoes.map((m) => (
                          <tr key={m.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                            <td className="py-2 pr-4 text-slate-400">{m.numero}</td>
                            <td className="py-2 pr-4 text-right font-mono text-slate-200">{m.massa_areia_g.toFixed(2)}</td>
                            <td className="py-2 pr-4 text-right font-mono text-cyan-400">{m.forca_hidrostatica_n.toFixed(4)}</td>
                            <td className="py-2 pr-4 text-right font-mono text-blue-400">{m.torque_teorico_nm.toFixed(5)}</td>
                            <td className="py-2 pr-4 text-right font-mono text-amber-400">{m.torque_experimental_nm.toFixed(5)}</td>
                            <td className={clsx("py-2 text-right font-mono font-bold", erroColor(m.erro_percentual))}>
                              {m.erro_percentual.toFixed(2)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Parâmetros do experimento */}
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: "Gancho", val: `${exp.massa_gancho_g} g` },
                      { label: "Recipiente", val: `${exp.massa_recipiente_g} g` },
                      { label: "Braço de alavanca", val: `${exp.braco_alavanca_cm} cm` },
                      { label: "Densidade", val: `${exp.densidade_fluido} kg/m³` },
                    ].map((p) => (
                      <div key={p.label} className="bg-slate-800/40 rounded-lg px-3 py-2">
                        <p className="text-xs text-slate-500">{p.label}</p>
                        <p className="text-sm font-mono text-slate-300">{p.val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
