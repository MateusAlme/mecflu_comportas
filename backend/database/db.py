from sqlalchemy import create_engine, Column, Integer, Float, DateTime, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

DATABASE_URL = "sqlite:///./mecflu.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class ExperimentoDB(Base):
    __tablename__ = "experimentos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, default="Experimento")
    data_criacao = Column(DateTime, default=datetime.utcnow)
    diametro_mm = Column(Float)
    massa_comporta_g = Column(Float)
    massa_gancho_g = Column(Float)
    massa_recipiente_g = Column(Float)
    altura_h_cm = Column(Float)
    altura_h_linha_cm = Column(Float)
    angulo_graus = Column(Float, default=60.0)
    densidade_fluido = Column(Float, default=1000.0)
    gravidade = Column(Float, default=10.0)
    tracao_teorica_n = Column(Float, default=0.0)
    tracao_experimental_n = Column(Float, default=0.0)
    erro_percentual = Column(Float, default=0.0)
    massa_areia_media_g = Column(Float, default=0.0)

    medicoes = relationship("MedicaoDB", back_populates="experimento", cascade="all, delete-orphan")


class MedicaoDB(Base):
    __tablename__ = "medicoes"

    id = Column(Integer, primary_key=True, index=True)
    experimento_id = Column(Integer, ForeignKey("experimentos.id"))
    numero = Column(Integer)
    massa_areia_g = Column(Float)

    experimento = relationship("ExperimentoDB", back_populates="medicoes")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)
