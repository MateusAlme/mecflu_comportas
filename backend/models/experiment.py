from pydantic import BaseModel, Field
from datetime import datetime


class EntradaExperimento(BaseModel):
    nome: str = "Experimento"
    diametro_mm: float = Field(75.5, gt=0, description="Diâmetro da comporta em mm")
    massa_comporta_g: float = Field(27.23, gt=0)
    massa_gancho_g: float = Field(5.38, gt=0)
    massa_recipiente_g: float = Field(15.74, gt=0)
    altura_h_cm: float = Field(25.0, gt=0, description="Altura do nível da água (cm)")
    altura_h_linha_cm: float = Field(
        13.0, gt=0, description="Profundidade do topo da comporta (cm)"
    )
    angulo_graus: float = Field(60.0, gt=0, lt=90, description="Inclinação da comporta (°)")
    densidade_fluido: float = Field(1000.0, gt=0)
    gravidade: float = Field(10.0, gt=0)


class EntradaCalculo(EntradaExperimento):
    medicoes_areia_g: list[float] = Field(
        default_factory=lambda: [246.79, 246.38, 249.91, 249.74, 236.08],
        description="Medições da massa de areia (g)",
        min_length=1,
    )


class ResultadoCalculo(BaseModel):
    raio_m: float
    area_m2: float
    angulo_graus: float
    h_barra_m: float
    y_barra_m: float
    pressao_centroide_pa: float
    forca_hidrostatica_n: float
    momento_inercia_m4: float
    distancia_centro_pressao_m: float
    excentricidade_m: float
    componente_peso_n: float
    tracao_teorica_n: float
    massa_areia_media_g: float
    massa_total_kg: float
    tracao_experimental_n: float
    massa_teorica_kg: float
    erro_percentual: float


class MedicaoResponse(BaseModel):
    id: int
    numero: int
    massa_areia_g: float

    class Config:
        from_attributes = True


class ExperimentoResponse(BaseModel):
    id: int
    nome: str
    data_criacao: datetime
    diametro_mm: float
    massa_comporta_g: float
    massa_gancho_g: float
    massa_recipiente_g: float
    altura_h_cm: float
    altura_h_linha_cm: float
    angulo_graus: float
    densidade_fluido: float
    gravidade: float
    tracao_teorica_n: float
    tracao_experimental_n: float
    erro_percentual: float
    massa_areia_media_g: float
    medicoes: list[MedicaoResponse] = []

    class Config:
        from_attributes = True


class DadosGraficos(BaseModel):
    pressao_vs_altura: list[dict]
    forca_vs_altura: list[dict]
    excentricidade_vs_altura: list[dict]
