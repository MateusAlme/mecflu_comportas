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
        angulo_graus=entrada.angulo_graus,
        massa_comporta_g=entrada.massa_comporta_g,
        massa_gancho_g=entrada.massa_gancho_g,
        massa_recipiente_g=entrada.massa_recipiente_g,
        medicoes_areia_g=entrada.medicoes_areia_g,
        densidade=entrada.densidade_fluido,
        gravidade=entrada.gravidade,
    )
    return ResultadoCalculo(
        raio_m=resultado.raio_m,
        area_m2=resultado.area_m2,
        angulo_graus=resultado.angulo_graus,
        h_barra_m=resultado.h_barra_m,
        y_barra_m=resultado.y_barra_m,
        pressao_centroide_pa=resultado.pressao_centroide_pa,
        forca_hidrostatica_n=resultado.forca_hidrostatica_n,
        momento_inercia_m4=resultado.momento_inercia_m4,
        distancia_centro_pressao_m=resultado.distancia_centro_pressao_m,
        excentricidade_m=resultado.excentricidade_m,
        componente_peso_n=resultado.componente_peso_n,
        tracao_teorica_n=resultado.tracao_teorica_n,
        massa_areia_media_g=resultado.massa_areia_media_g,
        massa_total_kg=resultado.massa_total_kg,
        tracao_experimental_n=resultado.tracao_experimental_n,
        massa_teorica_kg=resultado.massa_teorica_kg,
        erro_percentual=resultado.erro_percentual,
    )


@router.post("/graficos", response_model=DadosGraficos)
def graficos(entrada: EntradaCalculo):
    dados = gerar_dados_graficos(
        diametro_mm=entrada.diametro_mm,
        altura_h_cm=entrada.altura_h_cm,
        altura_h_linha_cm=entrada.altura_h_linha_cm,
        angulo_graus=entrada.angulo_graus,
        densidade=entrada.densidade_fluido,
        gravidade=entrada.gravidade,
    )
    return DadosGraficos(**dados)
