"use client";
import { useState, useCallback } from "react";
import { api, ResultadoCalculo, DadosGraficos, EntradaCalculo } from "@/lib/api";
import { MetricCard } from "@/components/ui/Card";
import GateVisualization from "@/components/simulator/GateVisualization";
import { PressureChart, ForceChart, ComparisonChart } from "@/components/charts/HydroCharts";
import { AlertTriangle, CheckCircle2, Play, Save, RotateCcw, ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import { clsx } from "clsx";

const DEFAULT_INPUT: EntradaCalculo = {
  nome: "Experimento",
  diametro_mm: 75.5,
  massa_comporta_g: 27.23,
  massa_gancho_g: 5.38,
  massa_recipiente_g: 15.74,
  altura_h_cm: 25,
  altura_h_linha_cm: 13,
  angulo_graus: 60,
  densidade_fluido: 1000,
  gravidade: 10,
  medicoes_areia_g: [246.79, 246.38, 249.91, 249.74, 236.08],
};

type SimpleField = Exclude<keyof EntradaCalculo, "medicoes_areia_g" | "nome">;

interface InputFieldProps {
  label: string;
  unit: string;
  field: SimpleField;
  value: number | string;
  onChange: (field: SimpleField, val: number) => void;
  step?: number;
  min?: number;
}

function InputField({ label, unit, field, value, onChange, step = 0.01, min = 0 }: InputFieldProps) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1">{label}</label>
      <div className="flex">
        <input
          type="number"
          step={step}
          min={min}
          value={value}
          onChange={(e) => onChange(field, parseFloat(e.target.value) || 0)}
          className="w-full bg-[#0d1224] border border-slate-700 text-slate-100 text-sm rounded-l-lg px-3 py-2 focus:outline-none focus:border-cyan-500/50 font-mono"
        />
        <span className="bg-slate-800 border border-l-0 border-slate-700 text-slate-400 text-xs px-2 rounded-r-lg flex items-center whitespace-nowrap">
          {unit}
        </span>
      </div>
    </div>
  );
}

export default function SimulatorPage() {
  const [input, setInput] = useState<EntradaCalculo>(DEFAULT_INPUT);
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [graficos, setGraficos] = useState<DadosGraficos | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const handleChange = useCallback((field: SimpleField, val: number) => {
    setInput((prev) => ({ ...prev, [field]: val }));
  }, []);

  const handleMedicaoChange = (index: number, val: number) => {
    setInput((prev) => {
      const novas = [...prev.medicoes_areia_g];
      novas[index] = val;
      return { ...prev, medicoes_areia_g: novas };
    });
  };

  const addMedicao = () => {
    setInput((prev) => ({
      ...prev,
      medicoes_areia_g: [...prev.medicoes_areia_g, 0],
    }));
  };

  const removeMedicao = (index: number) => {
    setInput((prev) => {
      if (prev.medicoes_areia_g.length <= 1) return prev;
      const novas = prev.medicoes_areia_g.filter((_, i) => i !== index);
      return { ...prev, medicoes_areia_g: novas };
    });
  };

  const handleSimular = async () => {
    setLoading(true);
    setError(null);
    try {
      const [res, graf] = await Promise.all([
        api.simular(input),
        api.graficos(input),
      ]);
      setResultado(res);
      setGraficos(graf);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro na comunicação com o servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleSalvar = async () => {
    setSaveStatus("saving");
    try {
      await api.criarExperimento(input);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("idle");
    }
  };

  const handleReset = () => {
    setInput(DEFAULT_INPUT);
    setResultado(null);
    setGraficos(null);
    setError(null);
  };

  const comparisonData = resultado
    ? [
        {
          label: "Tração (N)",
          teorico: parseFloat(resultado.tracao_teorica_n.toFixed(4)),
          experimental: parseFloat(resultado.tracao_experimental_n.toFixed(4)),
        },
        {
          label: "Massa (kg)",
          teorico: parseFloat(resultado.massa_teorica_kg.toFixed(4)),
          experimental: parseFloat(resultado.massa_total_kg.toFixed(4)),
        },
      ]
    : [];

  const canOpenGate = resultado
    ? resultado.tracao_experimental_n >= resultado.tracao_teorica_n
    : false;
  const tracaoSameDisplay = resultado
    ? resultado.tracao_experimental_n.toFixed(4) === resultado.tracao_teorica_n.toFixed(4)
    : false;

  const tracaoFaltante = resultado
    ? Math.max(resultado.tracao_teorica_n - resultado.tracao_experimental_n, 0)
    : 0;

  const sinTheta = Math.sin((input.angulo_graus * Math.PI) / 180);
  const cosTheta = Math.cos((input.angulo_graus * Math.PI) / 180);

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Simulador Hidrostático</h1>
        <p className="text-slate-400 text-sm mt-1">
          Comporta circular inclinada submersa — equilíbrio de momentos em O
        </p>
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-[340px_1fr] gap-6">
        {/* Painel de entrada */}
        <div className="space-y-4 min-w-0">
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">
              Geometria da Comporta
            </h2>
            <div className="space-y-3">
              <InputField label="Diâmetro (D)" unit="mm" field="diametro_mm" value={input.diametro_mm} onChange={handleChange} step={0.1} />
              <InputField label="Altura da água (H)" unit="cm" field="altura_h_cm" value={input.altura_h_cm} onChange={handleChange} step={0.5} />
              <InputField label="Prof. do topo (H')" unit="cm" field="altura_h_linha_cm" value={input.altura_h_linha_cm} onChange={handleChange} step={0.5} />
              <InputField label="Ângulo (θ)" unit="°" field="angulo_graus" value={input.angulo_graus} onChange={handleChange} step={1} />
            </div>
          </div>

          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">
              Massas do Sistema
            </h2>
            <div className="space-y-3">
              <InputField label="Massa da comporta" unit="g" field="massa_comporta_g" value={input.massa_comporta_g} onChange={handleChange} />
              <InputField label="Massa do gancho" unit="g" field="massa_gancho_g" value={input.massa_gancho_g} onChange={handleChange} />
              <InputField label="Massa do recipiente" unit="g" field="massa_recipiente_g" value={input.massa_recipiente_g} onChange={handleChange} />
            </div>
          </div>

          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Medições de Areia
              </h2>
              <button
                onClick={addMedicao}
                className="p-1 text-slate-400 hover:text-cyan-400 rounded"
                title="Adicionar medição"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {input.medicoes_areia_g.map((massa, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-mono w-5">{idx + 1}</span>
                  <div className="flex flex-1">
                    <input
                      type="number"
                      step={0.01}
                      min={0}
                      value={massa}
                      onChange={(e) => handleMedicaoChange(idx, parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#0d1224] border border-slate-700 text-slate-100 text-sm rounded-l-lg px-3 py-2 focus:outline-none focus:border-cyan-500/50 font-mono"
                    />
                    <span className="bg-slate-800 border border-l-0 border-slate-700 text-slate-400 text-xs px-2 rounded-r-lg flex items-center">
                      g
                    </span>
                  </div>
                  <button
                    onClick={() => removeMedicao(idx)}
                    disabled={input.medicoes_areia_g.length <= 1}
                    className="p-1 text-slate-500 hover:text-red-400 disabled:opacity-30 disabled:hover:text-slate-500 rounded"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Média: <span className="font-mono text-slate-300">
                {(input.medicoes_areia_g.reduce((a, b) => a + b, 0) / input.medicoes_areia_g.length).toFixed(2)} g
              </span>
            </p>
          </div>

          {/* Parâmetros avançados */}
          <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between px-5 py-3 text-sm text-slate-400 hover:text-slate-200"
            >
              <span className="font-semibold uppercase tracking-wider">Parâmetros Avançados</span>
              {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {showAdvanced && (
              <div className="px-5 pb-5 space-y-3 border-t border-slate-800 pt-4">
                <InputField label="Densidade do fluido" unit="kg/m³" field="densidade_fluido" value={input.densidade_fluido} onChange={handleChange} step={10} />
                <InputField label="Gravidade (g)" unit="m/s²" field="gravidade" value={input.gravidade} onChange={handleChange} step={0.01} />
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="space-y-2">
            <button
              onClick={handleSimular}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-[#0a0e1a] font-bold rounded-lg transition-colors"
            >
              {loading ? (
                <span className="animate-spin w-4 h-4 border-2 border-[#0a0e1a] border-t-transparent rounded-full" />
              ) : (
                <Play size={16} />
              )}
              {loading ? "Calculando..." : "Simular"}
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleSalvar}
                disabled={!resultado || saveStatus === "saving"}
                className={clsx(
                  "flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg border transition-colors",
                  saveStatus === "saved"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600 disabled:opacity-40"
                )}
              >
                <Save size={14} />
                {saveStatus === "saved" ? "Salvo!" : saveStatus === "saving" ? "Salvando..." : "Salvar"}
              </button>
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600"
              >
                <RotateCcw size={14} />
                Reset
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Área de resultados */}
        <div className="space-y-6 min-w-0">
          {/* Visualização */}
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] gap-6 items-start min-w-0">
            <div className="min-w-0">
              {resultado ? (
                <div className="space-y-4">
                  <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                    Resultados
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    <MetricCard
                      label="Área"
                      value={resultado.area_m2}
                      unit="m²"
                      color="cyan"
                      description="A = πD²/4"
                      details={[
                        `Diâmetro: D = ${input.diametro_mm} mm = ${(input.diametro_mm / 1000).toFixed(5)} m.`,
                        `Área: A = π · D² / 4 = π · (${(input.diametro_mm / 1000).toFixed(5)})² / 4.`,
                        `Resultado: A = ${resultado.area_m2.toExponential(3)} m².`,
                      ]}
                    />
                    <MetricCard
                      label="h̄ (vertical)"
                      value={resultado.h_barra_m.toFixed(4)}
                      unit="m"
                      color="blue"
                      description="H' + sen(θ)·R"
                      details={[
                        `Profundidade vertical da superfície até o centroide.`,
                        `h̄ = H' + sen(${input.angulo_graus}°) · R = ${(input.altura_h_linha_cm / 100).toFixed(4)} + ${sinTheta.toFixed(4)} · ${resultado.raio_m.toFixed(5)}.`,
                        `Resultado: h̄ = ${resultado.h_barra_m.toFixed(4)} m.`,
                      ]}
                    />
                    <MetricCard
                      label="ȳ (inclinada)"
                      value={resultado.y_barra_m.toFixed(4)}
                      unit="m"
                      color="blue"
                      description="H'/sen(θ) + R"
                      details={[
                        `Distância da superfície até o centroide ao longo do plano inclinado.`,
                        `ȳ = H' / sen(${input.angulo_graus}°) + R = ${(input.altura_h_linha_cm / 100).toFixed(4)} / ${sinTheta.toFixed(4)} + ${resultado.raio_m.toFixed(5)}.`,
                        `Resultado: ȳ = ${resultado.y_barra_m.toFixed(4)} m.`,
                      ]}
                    />
                    <MetricCard
                      label="Força Hidrostática"
                      value={resultado.forca_hidrostatica_n.toFixed(4)}
                      unit="N"
                      color="cyan"
                      description="F = γ·h̄·A"
                      details={[
                        `γ = ρ · g = ${input.densidade_fluido} · ${input.gravidade} = ${(input.densidade_fluido * input.gravidade).toFixed(0)} N/m³.`,
                        `F = γ · h̄ · A = ${(input.densidade_fluido * input.gravidade).toFixed(0)} · ${resultado.h_barra_m.toFixed(4)} · ${resultado.area_m2.toExponential(3)}.`,
                        `Resultado: F = ${resultado.forca_hidrostatica_n.toFixed(4)} N.`,
                      ]}
                    />
                    <MetricCard
                      label="Centro de Pressão"
                      value={resultado.distancia_centro_pressao_m.toFixed(5)}
                      unit="m"
                      color="amber"
                      description="Dcp = R + ICG/(A·ȳ)"
                      details={[
                        `ICG = π·D⁴/64 = ${resultado.momento_inercia_m4.toExponential(3)} m⁴.`,
                        `Excentricidade: ICG / (A·ȳ) = ${resultado.excentricidade_m.toExponential(3)} m.`,
                        `Dcp = R + e = ${resultado.raio_m.toFixed(5)} + ${resultado.excentricidade_m.toFixed(6)} = ${resultado.distancia_centro_pressao_m.toFixed(5)} m.`,
                      ]}
                    />
                    <MetricCard
                      label="Componente do Peso"
                      value={resultado.componente_peso_n.toFixed(5)}
                      unit="N"
                      color="amber"
                      description="Gx = m·g·cos(θ)"
                      details={[
                        `Componente do peso da comporta perpendicular ao plano inclinado.`,
                        `Gx = m · g · cos(${input.angulo_graus}°) = ${(input.massa_comporta_g / 1000).toFixed(5)} · ${input.gravidade} · ${cosTheta.toFixed(4)}.`,
                        `Resultado: Gx = ${resultado.componente_peso_n.toFixed(5)} N.`,
                      ]}
                    />
                    <MetricCard
                      label="Tração Teórica"
                      value={resultado.tracao_teorica_n.toFixed(4)}
                      unit="N"
                      color="blue"
                      description="T = (F·Dcp + Gx·R) / D"
                      details={[
                        `Equilíbrio de momentos em O (topo da comporta).`,
                        `T = (F · Dcp + Gx · R) / D = (${resultado.forca_hidrostatica_n.toFixed(4)} · ${resultado.distancia_centro_pressao_m.toFixed(5)} + ${resultado.componente_peso_n.toFixed(5)} · ${resultado.raio_m.toFixed(5)}) / ${(input.diametro_mm / 1000).toFixed(5)}.`,
                        `Resultado: T = ${resultado.tracao_teorica_n.toFixed(4)} N.`,
                      ]}
                    />
                    <MetricCard
                      label="Tração Experimental"
                      value={resultado.tracao_experimental_n.toFixed(4)}
                      unit="N"
                      color="green"
                      description="T_exp = mT·g"
                      details={[
                        `Massa total: mT = m_areia + m_recipiente + m_gancho.`,
                        `mT = ${resultado.massa_areia_media_g.toFixed(2)} + ${input.massa_recipiente_g} + ${input.massa_gancho_g} = ${(resultado.massa_total_kg * 1000).toFixed(2)} g.`,
                        `T_exp = ${resultado.massa_total_kg.toFixed(5)} · ${input.gravidade} = ${resultado.tracao_experimental_n.toFixed(4)} N.`,
                      ]}
                    />
                    <MetricCard
                      label="Massa Teórica"
                      value={(resultado.massa_teorica_kg * 1000).toFixed(2)}
                      unit="g"
                      color="cyan"
                      description="Para abertura"
                      details={[
                        `Massa total necessária para igualar a tração teórica.`,
                        `mT_min = T_teórica / g = ${resultado.tracao_teorica_n.toFixed(4)} / ${input.gravidade}.`,
                        `Resultado: mT_min = ${(resultado.massa_teorica_kg * 1000).toFixed(2)} g.`,
                      ]}
                    />
                    <MetricCard
                      label="Média da Areia"
                      value={resultado.massa_areia_media_g.toFixed(2)}
                      unit="g"
                      color="amber"
                      description={`${input.medicoes_areia_g.length} medições`}
                      details={[
                        `Soma: ${input.medicoes_areia_g.map((m) => m.toFixed(2)).join(" + ")} = ${input.medicoes_areia_g.reduce((a, b) => a + b, 0).toFixed(2)} g.`,
                        `Média = soma / ${input.medicoes_areia_g.length} = ${resultado.massa_areia_media_g.toFixed(2)} g.`,
                      ]}
                    />
                    <MetricCard
                      label="Massa Total Experimental"
                      value={(resultado.massa_total_kg * 1000).toFixed(2)}
                      unit="g"
                      color="amber"
                      description="Areia + rec + gancho"
                      details={[
                        `mT = m_areia + m_recipiente + m_gancho.`,
                        `mT = ${resultado.massa_areia_media_g.toFixed(2)} + ${input.massa_recipiente_g} + ${input.massa_gancho_g} g.`,
                        `Resultado: mT = ${(resultado.massa_total_kg * 1000).toFixed(2)} g = ${resultado.massa_total_kg.toFixed(5)} kg.`,
                      ]}
                    />
                    <MetricCard
                      label="Erro Percentual"
                      value={resultado.erro_percentual.toFixed(2)}
                      unit="%"
                      color={resultado.erro_percentual < 5 ? "green" : resultado.erro_percentual < 15 ? "amber" : "red"}
                      description="|T_teórica − T_exp| / T_teórica"
                      details={[
                        `Erro = |T_teórica − T_exp| / T_teórica · 100.`,
                        `Erro = |${resultado.tracao_teorica_n.toFixed(4)} − ${resultado.tracao_experimental_n.toFixed(4)}| / ${resultado.tracao_teorica_n.toFixed(4)} · 100.`,
                        `Resultado: ${resultado.erro_percentual.toFixed(2)}%.`,
                      ]}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 bg-[#111827] border border-slate-800 rounded-xl text-slate-500">
                  <Play size={40} className="mb-3 opacity-20" />
                  <p className="text-sm">Execute a simulação para ver os resultados</p>
                </div>
              )}
            </div>

            <GateVisualization
              alturaH={input.altura_h_cm}
              alturaHLinha={input.altura_h_linha_cm}
              diametroMm={input.diametro_mm}
              forcaN={resultado?.forca_hidrostatica_n}
              excentricidadeMm={resultado ? resultado.excentricidade_m * 1000 : 0}
              massaTotalKg={resultado?.massa_total_kg}
              angulo={input.angulo_graus}
              canOpen={canOpenGate}
            />
          </div>

          {resultado && (
            <div
              className={clsx(
                "rounded-xl border p-4 flex items-start gap-3",
                canOpenGate
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                  : "bg-amber-500/10 border-amber-500/20 text-amber-300"
              )}
            >
              {canOpenGate ? (
                <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
              ) : (
                <AlertTriangle size={20} className="mt-0.5 shrink-0" />
              )}
              <div>
                <p className="text-sm font-semibold">
                  {canOpenGate ? "A comporta abre com os valores informados" : "A comporta permanece fechada"}
                </p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {canOpenGate
                    ? tracaoSameDisplay
                      ? `Tração experimental (${resultado.tracao_experimental_n.toFixed(6)} N) é marginalmente superior à teórica (${resultado.tracao_teorica_n.toFixed(6)} N) — diferença de ${(resultado.tracao_experimental_n - resultado.tracao_teorica_n).toExponential(2)} N.`
                      : `Tração experimental (${resultado.tracao_experimental_n.toFixed(4)} N) supera a tração teórica necessária (${resultado.tracao_teorica_n.toFixed(4)} N).`
                    : `Tração experimental (${resultado.tracao_experimental_n.toFixed(4)} N) é menor que a tração teórica (${resultado.tracao_teorica_n.toFixed(4)} N). Faltam ${tracaoFaltante.toFixed(4)} N (~${(tracaoFaltante / input.gravidade * 1000).toFixed(1)} g de massa) para a abertura.`}
                </p>
              </div>
            </div>
          )}

          {/* Gráficos */}
          {graficos && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 min-w-0">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Pressão × H'
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-3 leading-relaxed">
                  Pressão no centroide variando a profundidade do topo da comporta.
                </p>
                <PressureChart data={graficos.pressao_vs_altura} />
              </div>
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 min-w-0">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Força × H'
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-3 leading-relaxed">
                  Força hidrostática resultante na comporta para cada profundidade do topo.
                </p>
                <ForceChart data={graficos.forca_vs_altura} />
              </div>
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 min-w-0">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Teórico × Experimental
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-3 leading-relaxed">
                  Compara a tração/massa calculadas pela teoria com os valores experimentais.
                </p>
                <ComparisonChart data={comparisonData} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
