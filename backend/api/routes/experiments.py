from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.db import get_db
from models.experiment import EntradaCalculo, ExperimentoResponse
from services.experiment_service import (
    criar_experimento,
    listar_experimentos,
    buscar_experimento,
    deletar_experimento,
)

router = APIRouter(prefix="/experimentos", tags=["Experimentos"])


@router.get("/", response_model=list[ExperimentoResponse])
def listar(db: Session = Depends(get_db)):
    return listar_experimentos(db)


@router.post("/", response_model=ExperimentoResponse, status_code=201)
def criar(dados: EntradaCalculo, db: Session = Depends(get_db)):
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
