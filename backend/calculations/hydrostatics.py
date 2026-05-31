import math
from dataclasses import dataclass


@dataclass
class ResultadoHidrostatico:
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


def calcular_area(diametro_m: float) -> tuple[float, float]:
    raio = diametro_m / 2
    area = math.pi * diametro_m**2 / 4
    return raio, area


def calcular_momento_inercia(diametro_m: float) -> float:
    return math.pi * diametro_m**4 / 64


def calcular_hidrostatics(
    diametro_mm: float,
    altura_h_cm: float,
    altura_h_linha_cm: float,
    angulo_graus: float,
    massa_comporta_g: float,
    massa_gancho_g: float,
    massa_recipiente_g: float,
    medicoes_areia_g: list[float],
    densidade: float = 1000.0,
    gravidade: float = 10.0,
) -> ResultadoHidrostatico:
    # Conversões
    diametro_m = diametro_mm / 1000
    altura_h_linha_m = altura_h_linha_cm / 100
    massa_comporta_kg = massa_comporta_g / 1000
    massa_gancho_kg = massa_gancho_g / 1000
    massa_recipiente_kg = massa_recipiente_g / 1000

    massa_areia_media_g = (
        sum(medicoes_areia_g) / len(medicoes_areia_g) if medicoes_areia_g else 0.0
    )
    massa_areia_kg = massa_areia_media_g / 1000
    massa_total_kg = massa_gancho_kg + massa_recipiente_kg + massa_areia_kg

    # Geometria
    raio, area = calcular_area(diametro_m)
    momento_inercia = calcular_momento_inercia(diametro_m)

    theta_rad = math.radians(angulo_graus)
    sin_theta = math.sin(theta_rad)
    cos_theta = math.cos(theta_rad)

    # h̄ = profundidade vertical até o centroide
    h_barra = altura_h_linha_m + sin_theta * raio
    # ȳ = distância no plano inclinado da superfície até o centroide
    y_barra = altura_h_linha_m / sin_theta + raio

    peso_especifico = densidade * gravidade
    pressao_centroide = peso_especifico * h_barra
    forca_hidrostatica = peso_especifico * h_barra * area

    # Centro de pressão (medido a partir do pivô O no topo da comporta, no plano inclinado)
    excentricidade = momento_inercia / (area * y_barra)
    distancia_cp = raio + excentricidade

    # Componente do peso da comporta perpendicular ao plano inclinado
    componente_peso = massa_comporta_kg * gravidade * cos_theta

    # Equilíbrio de momentos em O — tração mínima para abrir
    tracao_teorica = (forca_hidrostatica * distancia_cp + componente_peso * raio) / diametro_m

    # Tração experimental: massas pendem direto na ponta do cabo
    tracao_experimental = massa_total_kg * gravidade

    # Massa teórica para equilíbrio: T_teorica = m * g
    massa_teorica_kg = tracao_teorica / gravidade if gravidade > 0 else 0.0

    # Erro percentual (T_teorica como referencia)
    if tracao_teorica > 0:
        erro = abs(tracao_teorica - tracao_experimental) / tracao_teorica * 100
    else:
        erro = 0.0

    return ResultadoHidrostatico(
        raio_m=raio,
        area_m2=area,
        angulo_graus=angulo_graus,
        h_barra_m=h_barra,
        y_barra_m=y_barra,
        pressao_centroide_pa=pressao_centroide,
        forca_hidrostatica_n=forca_hidrostatica,
        momento_inercia_m4=momento_inercia,
        distancia_centro_pressao_m=distancia_cp,
        excentricidade_m=excentricidade,
        componente_peso_n=componente_peso,
        tracao_teorica_n=tracao_teorica,
        massa_areia_media_g=massa_areia_media_g,
        massa_total_kg=massa_total_kg,
        tracao_experimental_n=tracao_experimental,
        massa_teorica_kg=massa_teorica_kg,
        erro_percentual=erro,
    )


def gerar_dados_graficos(
    diametro_mm: float,
    altura_h_cm: float,
    altura_h_linha_cm: float,
    angulo_graus: float,
    densidade: float = 1000.0,
    gravidade: float = 10.0,
) -> dict:
    diametro_m = diametro_mm / 1000
    altura_h_linha_m = altura_h_linha_cm / 100
    raio, area = calcular_area(diametro_m)
    momento_inercia = calcular_momento_inercia(diametro_m)

    theta_rad = math.radians(angulo_graus)
    sin_theta = math.sin(theta_rad)
    peso_especifico = densidade * gravidade

    # Varia H' (profundidade do topo da comporta) de 1 cm até altura_h_cm
    h_linha_max_cm = max(int(altura_h_cm), 1)
    dados_pressao: list[dict] = []
    dados_forca: list[dict] = []
    dados_excentricidade: list[dict] = []

    for h_linha_cm in range(1, h_linha_max_cm + 1):
        h_linha_m = h_linha_cm / 100
        h_barra = h_linha_m + sin_theta * raio
        y_barra = h_linha_m / sin_theta + raio
        if y_barra <= 0:
            continue
        pressao = peso_especifico * h_barra
        forca = pressao * area
        exc = momento_inercia / (area * y_barra)

        dados_pressao.append({"altura_cm": h_linha_cm, "pressao_pa": round(pressao, 2)})
        dados_forca.append({"altura_cm": h_linha_cm, "forca_n": round(forca, 4)})
        dados_excentricidade.append(
            {"altura_cm": h_linha_cm, "excentricidade_mm": round(exc * 1000, 4)}
        )

    return {
        "pressao_vs_altura": dados_pressao,
        "forca_vs_altura": dados_forca,
        "excentricidade_vs_altura": dados_excentricidade,
    }
