from sqlalchemy.orm import Session
from database.db import ExperimentoDB, MedicaoDB
from models.experiment import EntradaExperimento, EntradaMedicao
from calculations.hydrostatics import calcular_hidrostatics


def criar_experimento(db: Session, dados: EntradaExperimento) -> ExperimentoDB:
    experimento = ExperimentoDB(
        nome=dados.nome,
        diametro_mm=dados.diametro_mm,
        massa_comporta_g=dados.massa_comporta_g,
        massa_gancho_g=dados.massa_gancho_g,
        massa_recipiente_g=dados.massa_recipiente_g,
        altura_h_cm=dados.altura_h_cm,
        altura_h_linha_cm=dados.altura_h_linha_cm,
        densidade_fluido=dados.densidade_fluido,
        gravidade=dados.gravidade,
        braco_alavanca_cm=dados.braco_alavanca_cm,
    )
    db.add(experimento)
    db.commit()
    db.refresh(experimento)
    return experimento


def adicionar_medicao(
    db: Session, experimento_id: int, medicao: EntradaMedicao
) -> MedicaoDB | None:
    exp = db.query(ExperimentoDB).filter(ExperimentoDB.id == experimento_id).first()
    if not exp:
        return None

    resultado = calcular_hidrostatics(
        diametro_mm=exp.diametro_mm,
        altura_h_cm=exp.altura_h_cm,
        altura_h_linha_cm=exp.altura_h_linha_cm,
        massa_comporta_g=exp.massa_comporta_g,
        massa_gancho_g=exp.massa_gancho_g,
        massa_recipiente_g=exp.massa_recipiente_g,
        massa_areia_g=medicao.massa_areia_g,
        braco_alavanca_cm=exp.braco_alavanca_cm,
        densidade=exp.densidade_fluido,
        gravidade=exp.gravidade,
    )

    nova_medicao = MedicaoDB(
        experimento_id=experimento_id,
        numero=medicao.numero,
        massa_areia_g=medicao.massa_areia_g,
        forca_hidrostatica_n=resultado.forca_hidrostatica_n,
        torque_teorico_nm=resultado.torque_hidrostatico_nm,
        torque_experimental_nm=resultado.torque_massa_nm,
        erro_percentual=resultado.erro_percentual,
    )
    db.add(nova_medicao)
    db.commit()
    db.refresh(nova_medicao)
    return nova_medicao


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
