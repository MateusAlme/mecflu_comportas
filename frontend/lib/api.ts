const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface EntradaCalculo {
  nome?: string;
  diametro_mm: number;
  massa_comporta_g: number;
  massa_gancho_g: number;
  massa_recipiente_g: number;
  altura_h_cm: number;
  altura_h_linha_cm: number;
  angulo_graus: number;
  densidade_fluido: number;
  gravidade: number;
  medicoes_areia_g: number[];
}

export interface ResultadoCalculo {
  raio_m: number;
  area_m2: number;
  angulo_graus: number;
  h_barra_m: number;
  y_barra_m: number;
  pressao_centroide_pa: number;
  forca_hidrostatica_n: number;
  momento_inercia_m4: number;
  distancia_centro_pressao_m: number;
  excentricidade_m: number;
  componente_peso_n: number;
  tracao_teorica_n: number;
  massa_areia_media_g: number;
  massa_total_kg: number;
  tracao_experimental_n: number;
  massa_teorica_kg: number;
  erro_percentual: number;
}

export interface DadosGraficos {
  pressao_vs_altura: { altura_cm: number; pressao_pa: number }[];
  forca_vs_altura: { altura_cm: number; forca_n: number }[];
  excentricidade_vs_altura: { altura_cm: number; excentricidade_mm: number }[];
}

export interface Medicao {
  id: number;
  numero: number;
  massa_areia_g: number;
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
  angulo_graus: number;
  densidade_fluido: number;
  gravidade: number;
  tracao_teorica_n: number;
  tracao_experimental_n: number;
  erro_percentual: number;
  massa_areia_media_g: number;
  medicoes: Medicao[];
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

  criarExperimento: (dados: EntradaCalculo) =>
    fetcher<Experimento>("/experimentos/", {
      method: "POST",
      body: JSON.stringify(dados),
    }),

  buscarExperimento: (id: number) => fetcher<Experimento>(`/experimentos/${id}`),

  deletarExperimento: (id: number) =>
    fetch(`${API_BASE}/experimentos/${id}`, { method: "DELETE" }),
};
