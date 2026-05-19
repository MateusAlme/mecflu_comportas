"use client";
import { useState, useCallback } from "react";
import { api, ResultadoCalculo, DadosGraficos, EntradaCalculo } from "@/lib/api";
import { MetricCard } from "@/components/ui/Card";
import GateVisualization from "@/components/simulator/GateVisualization";
import { PressureChart, ForceChart, ComparisonChart } from "@/components/charts/HydroCharts";
import { Play, Save, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { clsx } from "clsx";

const DEFAULT_INPUT: EntradaCalculo = {
  nome: "Experimento",
  diametro_mm: 75.1,
  massa_comporta_g: 27.23,
  massa_gancho_g: 5.36,
  massa_recipiente_g: 15.74,
  altura_h_cm: 25,
  altura_h_linha_cm: 13,
  densidade_fluido: 1000,
  gravidade: 9.81,
  braco_alavanca_cm: 0.583,
  massa_areia_g: 246.79,
};

interface InputFieldProps {
  label: string;
  unit: string;
  field: keyof EntradaCalculo;
  value: number | string;
  onChange: (field: keyof EntradaCalculo, val: number | string) => void;
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

  const handleChange = useCallback((field: keyof EntradaCalculo, val: number | string) => {
    setInput((prev) => ({ ...prev, [field]: val }));
  }, []);

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
      const exp = await api.criarExperimento(input);
      await api.adicionarMedicao(exp.id, 1, input.massa_areia_g);
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
          label: "Torque (N·m)",
          teorico: parseFloat(resultado.torque_hidrostatico_nm.toFixed(5)),
          experimental: parseFloat(resultado.torque_massa_nm.toFixed(5)),
        },
        {
          label: "Massa (kg)",
          teorico: parseFloat(resultado.massa_teorica_kg.toFixed(4)),
          experimental: parseFloat(resultado.massa_total_kg.toFixed(4)),
        },
      ]
    : [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Simulador Hidrostático</h1>
        <p className="text-slate-400 text-sm mt-1">
          Insira os parâmetros do experimento e execute a simulação
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-6">
        {/* Painel de entrada */}
        <div className="space-y-4">
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">
              Geometria da Comporta
            </h2>
            <div className="space-y-3">
              <InputField label="Diâmetro (D)" unit="mm" field="diametro_mm" value={input.diametro_mm} onChange={handleChange} step={0.1} />
              <InputField label="Altura da água (H)" unit="cm" field="altura_h_cm" value={input.altura_h_cm} onChange={handleChange} step={0.5} />
              <InputField label="Altura do centro (H')" unit="cm" field="altura_h_linha_cm" value={input.altura_h_linha_cm} onChange={handleChange} step={0.5} />
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
              <InputField label="Massa de areia" unit="g" field="massa_areia_g" value={input.massa_areia_g} onChange={handleChange} />
            </div>
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
                <InputField label="Gravidade (g)" unit="m/s²" field="gravidade" value={input.gravidade} onChange={handleChange} step={0.001} />
                <InputField label="Braço de alavanca" unit="cm" field="braco_alavanca_cm" value={input.braco_alavanca_cm} onChange={handleChange} step={0.5} />
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
        <div className="space-y-6">
          {/* Visualização */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6">
            <div>
              {resultado ? (
                <div className="space-y-4">
                  <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                    Resultados
                  </h2>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    <MetricCard
                      label="Área"
                      value={resultado.area_m2}
                      unit="m²"
                      color="cyan"
                      description="πr²"
                    />
                    <MetricCard
                      label="Pressão (centróide)"
                      value={resultado.pressao_centroide_pa.toFixed(2)}
                      unit="Pa"
                      color="blue"
                      description="ρgh"
                    />
                    <MetricCard
                      label="Força Hidrostática"
                      value={resultado.forca_hidrostatica_n.toFixed(4)}
                      unit="N"
                      color="cyan"
                      description="F = P·A"
                    />
                    <MetricCard
                      label="Excentricidade"
                      value={(resultado.excentricidade_m * 1000).toFixed(3)}
                      unit="mm"
                      color="amber"
                      description="e = ycp − ȳ"
                    />
                    <MetricCard
                      label="Torque Hidrostático"
                      value={resultado.torque_hidrostatico_nm.toFixed(5)}
                      unit="N·m"
                      color="blue"
                      description="Teórico"
                    />
                    <MetricCard
                      label="Torque das Massas"
                      value={resultado.torque_massa_nm.toFixed(5)}
                      unit="N·m"
                      color="green"
                      description="Experimental"
                    />
                    <MetricCard
                      label="Massa Teórica"
                      value={(resultado.massa_teorica_kg * 1000).toFixed(2)}
                      unit="g"
                      color="cyan"
                      description="Para equilíbrio"
                    />
                    <MetricCard
                      label="Massa Experimental"
                      value={(resultado.massa_total_kg * 1000).toFixed(2)}
                      unit="g"
                      color="amber"
                      description="Gancho + rec + areia"
                    />
                    <MetricCard
                      label="Erro Percentual"
                      value={resultado.erro_percentual.toFixed(2)}
                      unit="%"
                      color={resultado.erro_percentual < 5 ? "green" : resultado.erro_percentual < 15 ? "amber" : "red"}
                      description="Teórico vs Experimental"
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
            />
          </div>

          {/* Gráficos */}
          {graficos && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
                  Pressão × Altura
                </h3>
                <PressureChart data={graficos.pressao_vs_altura} />
              </div>
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
                  Força × Altura
                </h3>
                <ForceChart data={graficos.forca_vs_altura} />
              </div>
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
                  Teórico × Experimental
                </h3>
                <ComparisonChart data={comparisonData} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
