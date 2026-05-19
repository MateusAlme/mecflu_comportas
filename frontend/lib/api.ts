const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface EntradaCalculo {
  nome?: string;
  diametro_mm: number;
  massa_comporta_g: number;
  massa_gancho_g: number;
  massa_recipiente_g: number;
  altura_h_cm: number;
  altura_h_linha_cm: number;
  densidade_fluido: number;
  gravidade: number;
  braco_alavanca_cm: number;
  massa_areia_g: number;
}

export interface ResultadoCalculo {
  raio_m: number;
  area_m2: number;
  profundidade_centroide_m: number;
  pressao_centroide_pa: number;
  forca_hidrostatica_n: number;
  momento_inercia_m4: number;
  profundidade_centro_pressao_m: number;
  excentricidade_m: number;
  torque_hidrostatico_nm: number;
  massa_total_kg: number;
  torque_massa_nm: number;
  erro_percentual: number;
  massa_teorica_kg: number;
}

export interface DadosGraficos {
  pressao_vs_altura: { altura_cm: number; pressao_pa: number }[];
  forca_vs_altura: { altura_cm: number; forca_n: number }[];
  excentricidade_vs_altura: { altura_cm: number; excentricidade_mm: number }[];
}

export interface Experimento {
  id: number;
  nome: string;
  data_criacao: string;
  diametro_mm: number;
  massa_comporta_g: number;
  massa_gancho_g: number;
  massa_recipiente_g: number;
  altura_h_cm: number;
  altura_h_linha_cm: number;
  densidade_fluido: number;
  gravidade: number;
  braco_alavanca_cm: number;
  medicoes: Medicao[];
}

export interface Medicao {
  id: number;
  numero: number;
  massa_areia_g: number;
  forca_hidrostatica_n: number;
  torque_teorico_nm: number;
  torque_experimental_nm: number;
  erro_percentual: number;
}

async function fetcher<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`Erro ${res.status}: ${await res.text()}`);
  return res.json();
}

export const api = {
  simular: (entrada: EntradaCalculo) =>
    fetcher<ResultadoCalculo>("/calculos/simular", {
      method: "POST",
      body: JSON.stringify(entrada),
    }),

  graficos: (entrada: EntradaCalculo) =>
    fetcher<DadosGraficos>("/calculos/graficos", {
      method: "POST",
      body: JSON.stringify(entrada),
    }),

  listarExperimentos: () => fetcher<Experimento[]>("/experimentos/"),

  criarExperimento: (dados: Omit<EntradaCalculo, "massa_areia_g">) =>
    fetcher<Experimento>("/experimentos/", {
      method: "POST",
      body: JSON.stringify(dados),
    }),

  buscarExperimento: (id: number) => fetcher<Experimento>(`/experimentos/${id}`),

  deletarExperimento: (id: number) =>
    fetch(`${API_BASE}/experimentos/${id}`, { method: "DELETE" }),

  adicionarMedicao: (experimentoId: number, numero: number, massa_areia_g: number) =>
    fetcher<Medicao>(`/experimentos/${experimentoId}/medicoes`, {
      method: "POST",
      body: JSON.stringify({ numero, massa_areia_g }),
    }),
};
