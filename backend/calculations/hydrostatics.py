import math
from dataclasses import dataclass


@dataclass
class ResultadoHidrostatico:
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


def calcular_area(diametro_m: float) -> tuple[float, float]:
    raio = diametro_m / 2
    area = math.pi * raio**2
    return raio, area


def calcular_momento_inercia(raio_m: float) -> float:
    return math.pi * raio_m**4 / 4


def calcular_forca_hidrostatica(
    rho: float,
    g: float,
    profundidade_centroide_m: float,
    area_m2: float,
) -> tuple[float, float]:
    pressao = rho * g * profundidade_centroide_m
    forca = pressao * area_m2
    return pressao, forca


def calcular_centro_pressao(
    profundidade_centroide_m: float,
    momento_inercia_m4: float,
    area_m2: float,
) -> tuple[float, float]:
    ycp = profundidade_centroide_m + momento_inercia_m4 / (profundidade_centroide_m * area_m2)
    excentricidade = ycp - profundidade_centroide_m
    return ycp, excentricidade


def calcular_hidrostatics(
    diametro_mm: float,
    altura_h_cm: float,
    altura_h_linha_cm: float,
    massa_comporta_g: float,
    massa_gancho_g: float,
    massa_recipiente_g: float,
    massa_areia_g: float,
    braco_alavanca_cm: float = 20.0,
    densidade: float = 1000.0,
    gravidade: float = 9.81,
) -> ResultadoHidrostatico:
    # Conversões de unidades
    diametro_m = diametro_mm / 1000
    altura_h_m = altura_h_cm / 100
    altura_h_linha_m = altura_h_linha_cm / 100
    braco_m = braco_alavanca_cm / 100

    massa_gancho_kg = massa_gancho_g / 1000
    massa_recipiente_kg = massa_recipiente_g / 1000
    massa_areia_kg = massa_areia_g / 1000
    massa_total_kg = massa_gancho_kg + massa_recipiente_kg + massa_areia_kg

    # Geometria da comporta
    raio_m, area_m2 = calcular_area(diametro_m)
    momento_inercia = calcular_momento_inercia(raio_m)

    # Profundidade do centróide abaixo da superfície livre
    # H = nível da água a partir do fundo, H' = altura do centro da comporta do fundo
    # profundidade do centróide = H - H'
    profundidade_centroide = altura_h_m - altura_h_linha_m

    # Pressão e força hidrostática
    pressao, forca = calcular_forca_hidrostatica(
        densidade, gravidade, profundidade_centroide, area_m2
    )

    # Centro de pressão
    ycp, excentricidade = calcular_centro_pressao(
        profundidade_centroide, momento_inercia, area_m2
    )

    # Torque hidrostático (momento em relação ao pivô = centro da comporta)
    # O torque é gerado pela excentricidade entre o centróide e o centro de pressão
    torque_hidrostatico = forca * excentricidade

    # Torque experimental das massas
    torque_massa = massa_total_kg * gravidade * braco_m

    # Massa teórica necessária para equilíbrio
    if gravidade * braco_m > 0:
        massa_teorica_kg = torque_hidrostatico / (gravidade * braco_m)
    else:
        massa_teorica_kg = 0.0

    # Erro percentual
    if torque_massa > 0:
        erro = abs(torque_hidrostatico - torque_massa) / torque_massa * 100
    else:
        erro = 0.0

    return ResultadoHidrostatico(
        raio_m=raio_m,
        area_m2=area_m2,
        profundidade_centroide_m=profundidade_centroide,
        pressao_centroide_pa=pressao,
        forca_hidrostatica_n=forca,
        momento_inercia_m4=momento_inercia,
        profundidade_centro_pressao_m=ycp,
        excentricidade_m=excentricidade,
        torque_hidrostatico_nm=torque_hidrostatico,
        massa_total_kg=massa_total_kg,
        torque_massa_nm=torque_massa,
        erro_percentual=erro,
        massa_teorica_kg=massa_teorica_kg,
    )


def gerar_dados_graficos(
    diametro_mm: float,
    altura_h_cm: float,
    altura_h_linha_cm: float,
    densidade: float = 1000.0,
    gravidade: float = 9.81,
) -> dict:
    diametro_m = diametro_mm / 1000
    raio_m, area_m2 = calcular_area(diametro_m)
    momento_inercia = calcular_momento_inercia(raio_m)

    alturas = [h for h in range(1, int(altura_h_cm) + 1)]
    dados_pressao = []
    dados_forca = []
    dados_excentricidade = []

    for h in alturas:
        h_m = h / 100
        altura_h_linha_m = altura_h_linha_cm / 100
        prof = h_m - altura_h_linha_m
        if prof <= 0:
            continue
        pressao = densidade * gravidade * prof
        forca = pressao * area_m2
        ycp = prof + momento_inercia / (prof * area_m2)
        exc = ycp - prof

        dados_pressao.append({"altura_cm": h, "pressao_pa": round(pressao, 2)})
        dados_forca.append({"altura_cm": h, "forca_n": round(forca, 4)})
        dados_excentricidade.append({"altura_cm": h, "excentricidade_mm": round(exc * 1000, 4)})

    return {
        "pressao_vs_altura": dados_pressao,
        "forca_vs_altura": dados_forca,
        "excentricidade_vs_altura": dados_excentricidade,
    }
