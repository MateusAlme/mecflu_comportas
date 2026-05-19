from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.db import get_db
from models.experiment import EntradaExperimento, EntradaMedicao, ExperimentoResponse, MedicaoResponse
from services.experiment_service import (
    criar_experimento,
    adicionar_medicao,
    listar_experimentos,
    buscar_experimento,
    deletar_experimento,
)

router = APIRouter(prefix="/experimentos", tags=["Experimentos"])


@router.get("/", response_model=list[ExperimentoResponse])
def listar(db: Session = Depends(get_db)):
    return listar_experimentos(db)


@router.post("/", response_model=ExperimentoResponse, status_code=201)
def criar(dados: EntradaExperimento, db: Session = Depends(get_db)):
    return criar_experimento(db, dados)


@router.get("/{experimento_id}", response_model=ExperimentoResponse)
def buscar(experimento_id: int, db: Session = Depends(get_db)):
    exp = buscar_experimento(db, experimento_id)
    if not exp:
        raise HTTPException(status_code=404, detail="Experimento não encontrado")
    return exp


@router.delete("/{experimento_id}", status_code=204)
def deletar(experimento_id: int, db: Session = Depends(get_db)):
    if not deletar_experimento(db, experimento_id):
        raise HTTPException(status_code=404, detail="Experimento não encontrado")


@router.post("/{experimento_id}/medicoes", response_model=MedicaoResponse, status_code=201)
def adicionar(experimento_id: int, medicao: EntradaMedicao, db: Session = Depends(get_db)):
    result = adicionar_medicao(db, experimento_id, medicao)
    if not result:
        raise HTTPException(status_code=404, detail="Experimento não encontrado")
    return result
