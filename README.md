# mecflu_comportas

Plataforma educacional para simulação e análise de experimentos de **comporta hidrostática circular** — disciplina de Mecânica dos Fluidos.

## Stack

- **Backend**: Python 3 · FastAPI · SQLAlchemy · SQLite
- **Frontend**: Next.js 15 · React 19 · TailwindCSS · Recharts

## Funcionalidades

- Simulador interativo com cálculos hidrostáticos (força, centro de pressão, torque, erro %)
- Visualização SVG animada da bancada experimental (comporta + massas + fluxo)
- Gráficos de pressão × altura, força × altura e comparativo teórico/experimental
- Histórico de experimentos com medições salvas
- Página teórica com diagramas e equações fundamentais

## Executar localmente

```bash
# Backend (porta 8000)
./start_backend.sh

# Frontend (porta 3000)
./start_frontend.sh
```

Acesse `http://localhost:3000`
