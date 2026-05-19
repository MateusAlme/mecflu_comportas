from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.db import init_db
from api.routes.calculations import router as calc_router
from api.routes.experiments import router as exp_router

app = FastAPI(
    title="MecFlu — Simulador de Comporta Hidrostática",
    description="API para simulação e análise de experimentos de mecânica dos fluidos com comporta circular",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    init_db()


app.include_router(calc_router, prefix="/api/v1")
app.include_router(exp_router, prefix="/api/v1")


@app.get("/")
def root():
    return {
        "projeto": "MecFlu — Simulador de Comporta Hidrostática",
        "versao": "1.0.0",
        "docs": "/docs",
    }
