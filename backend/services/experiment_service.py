from sqlalchemy.orm import Session
from database.db import ExperimentoDB, MedicaoDB
from models.experiment import EntradaCalculo
from calculations.hydrostatics import calcular_hidrostatics


def criar_experimento(db: Session, dados: EntradaCalculo) -> ExperimentoDB:
    resultado = calcular_hidrostatics(
        diametro_mm=dados.diametro_mm,
        altura_h_cm=dados.altura_h_cm,
        altura_h_linha_cm=dados.altura_h_linha_cm,
        angulo_graus=dados.angulo_graus,
        massa_comporta_g=dados.massa_comporta_g,
        massa_gancho_g=dados.massa_gancho_g,
        massa_recipiente_g=dados.massa_recipiente_g,
        medicoes_areia_g=dados.medicoes_areia_g,
        densidade=dados.densidade_fluido,
        gravidade=dados.gravidade,
    )

    experimento = ExperimentoDB(
        nome=dados.nome,
        diametro_mm=dados.diametro_mm,
        massa_comporta_g=dados.massa_comporta_g,
        massa_gancho_g=dados.massa_gancho_g,
        massa_recipiente_g=dados.massa_recipiente_g,
        altura_h_cm=dados.altura_h_cm,
        altura_h_linha_cm=dados.altura_h_linha_cm,
        angulo_graus=dados.angulo_graus,
        densidade_fluido=dados.densidade_fluido,
        gravidade=dados.gravidade,
        tracao_teorica_n=resultado.tracao_teorica_n,
        tracao_experimental_n=resultado.tracao_experimental_n,
        erro_percentual=resultado.erro_percentual,
        massa_areia_media_g=resultado.massa_areia_media_g,
    )

    for idx, massa in enumerate(dados.medicoes_areia_g, start=1):
        experimento.medicoes.append(MedicaoDB(numero=idx, massa_areia_g=massa))

    db.add(experimento)
    db.commit()
    db.refresh(experimento)
    return experimento


def listar_experimentos(db: Session) -> list[ExperimentoDB]:
    return db.query(ExperimentoDB).order_by(ExperimentoDB.data_criacao.desc()).all()


def buscar_experimento(db: Session, experimento_id: int) -> ExperimentoDB | None:
    return db.query(ExperimentoDB).filter(ExperimentoDB.id == experimento_id).first()


def deletar_experimento(db: Session, experimento_id: int) -> bool:
    exp = db.query(ExperimentoDB).filter(ExperimentoDB.id == experimento_id).first()
    if not exp:
        return False
    db.delete(exp)
    db.commit()
    return True
