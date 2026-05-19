from fastapi import APIRouter
from models.experiment import EntradaCalculo, ResultadoCalculo, DadosGraficos
from calculations.hydrostatics import calcular_hidrostatics, gerar_dados_graficos

router = APIRouter(prefix="/calculos", tags=["Cálculos"])


@router.post("/simular", response_model=ResultadoCalculo)
def simular(entrada: EntradaCalculo):
    resultado = calcular_hidrostatics(
        diametro_mm=entrada.diametro_mm,
        altura_h_cm=entrada.altura_h_cm,
        altura_h_linha_cm=entrada.altura_h_linha_cm,
        massa_comporta_g=entrada.massa_comporta_g,
        massa_gancho_g=entrada.massa_gancho_g,
        massa_recipiente_g=entrada.massa_recipiente_g,
        massa_areia_g=entrada.massa_areia_g,
        braco_alavanca_cm=entrada.braco_alavanca_cm,
        densidade=entrada.densidade_fluido,
        gravidade=entrada.gravidade,
    )
    return ResultadoCalculo(
        raio_m=resultado.raio_m,
        area_m2=resultado.area_m2,
        profundidade_centroide_m=resultado.profundidade_centroide_m,
        pressao_centroide_pa=resultado.pressao_centroide_pa,
        forca_hidrostatica_n=resultado.forca_hidrostatica_n,
        momento_inercia_m4=resultado.momento_inercia_m4,
        profundidade_centro_pressao_m=resultado.profundidade_centro_pressao_m,
        excentricidade_m=resultado.excentricidade_m,
        torque_hidrostatico_nm=resultado.torque_hidrostatico_nm,
        massa_total_kg=resultado.massa_total_kg,
        torque_massa_nm=resultado.torque_massa_nm,
        erro_percentual=resultado.erro_percentual,
        massa_teorica_kg=resultado.massa_teorica_kg,
    )


@router.post("/graficos", response_model=DadosGraficos)
def graficos(entrada: EntradaCalculo):
    dados = gerar_dados_graficos(
        diametro_mm=entrada.diametro_mm,
        altura_h_cm=entrada.altura_h_cm,
        altura_h_linha_cm=entrada.altura_h_linha_cm,
        densidade=entrada.densidade_fluido,
        gravidade=entrada.gravidade,
    )
    return DadosGraficos(**dados)
