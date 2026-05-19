from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class EntradaExperimento(BaseModel):
    nome: str = "Experimento"
    diametro_mm: float = Field(75.1, gt=0, description="Diâmetro da comporta em mm")
    massa_comporta_g: float = Field(27.23, gt=0)
    massa_gancho_g: float = Field(5.36, gt=0)
    massa_recipiente_g: float = Field(15.74, gt=0)
    altura_h_cm: float = Field(25.0, gt=0, description="Altura do nível da água (cm)")
    altura_h_linha_cm: float = Field(13.0, gt=0, description="Altura do centro da comporta (cm)")
    densidade_fluido: float = Field(1000.0, gt=0)
    gravidade: float = Field(9.81, gt=0)
    braco_alavanca_cm: float = Field(0.583, gt=0, description="Braço de alavanca das massas (cm)")


class EntradaMedicao(BaseModel):
    numero: int
    massa_areia_g: float = Field(gt=0)


class EntradaCalculo(EntradaExperimento):
    massa_areia_g: float = Field(246.79, gt=0)


class ResultadoCalculo(BaseModel):
    raio_m: float
    area_m2: float
    profundidade_centroide_m: float
    pressao_centroide_pa: float
    forca_hidrostatica_n: float
    momento_inercia_m4: float
    profundidade_centro_pressao_m: float
    excentricidade_m: float
    torque_hidrostatico_nm: float
    massa_total_kg: float
    torque_massa_nm: float
    erro_percentual: float
    massa_teorica_kg: float


class MedicaoResponse(BaseModel):
    id: int
    numero: int
    massa_areia_g: float
    forca_hidrostatica_n: float
    torque_teorico_nm: float
    torque_experimental_nm: float
    erro_percentual: float

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
    densidade_fluido: float
    gravidade: float
    braco_alavanca_cm: float
    medicoes: list[MedicaoResponse] = []

    class Config:
        from_attributes = True


class DadosGraficos(BaseModel):
    pressao_vs_altura: list[dict]
    forca_vs_altura: list[dict]
    excentricidade_vs_altura: list[dict]
