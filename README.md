# ♻️ Recicla ![CI](https://github.com/PabloExeQGimenez/recicla/actions/workflows/ci.yml/badge.svg)

Sistema web para la gestión de una cooperativa de reciclado. Permite administrar recuperadores, materiales, pesajes y solicitudes de pago de forma integral.

## 🚀 Demo

| Servicio | URL |
|---|---|
| Frontend | [recicla-frontend.onrender.com](https://recicla-frontend.onrender.com) |
| API | [recicla-api.onrender.com](https://recicla-api.onrender.com) |
| Swagger | [recicla-api.onrender.com/api/docs](https://recicla-api.onrender.com/api/docs) |

> Credenciales de prueba: `admin@recicla.com` / `admin123`

## 📦 Tech Stack

| Capa | Tecnologías |
|---|---|
| Backend | NestJS, Prisma, PostgreSQL, Zod, JWT, Passport |
| Frontend | React 19, TypeScript, Vite, Styled Components, React Router |
| Shared | `@recicla/shared` — tipos, enums y schemas Zod compartidos |
| Deploy | Docker, Docker Compose, Render |

## 🏗️ Arquitectura

Proyecto **monorepo** con npm workspaces siguiendo principios de **Clean Architecture**:

- **Backend:** domain → application (use cases) → infrastructure (Prisma) → presentation (controllers)
- **Frontend:** pages → hooks → services → API
- **Shared:** tipos y validaciones consumidos por ambos lados

## 📂 Estructura del proyecto

```
recicla/
├── apps/
│   ├── api/              Backend (NestJS + Prisma)
│   └── frontend/         Frontend (React + Vite)
├── packages/
│   └── shared/           Tipos y validaciones compartidas
├── docker-compose.yml
├── render.yaml
└── package.json
```

## 🔧 Prerrequisitos

- Node.js >= 18
- npm >= 9
- Docker y Docker Compose (opcional, para levantar con containers)

## ▶️ Instalación y ejecución

**Con Docker (recomendado):**

```bash
git clone git@github.com:PabloExeQGimenez/recicla.git
cd recicla
docker compose up --build
```

- Frontend: `http://localhost`
- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api/docs`

**Sin Docker:**

```bash
git clone git@github.com:PabloExeQGimenez/recicla.git
cd recicla
npm install
cp apps/api/.env.example apps/api/.env
# Completar las variables de entorno en apps/api/.env
npm run dev
```

## 🧪 Tests

```bash
# Backend
npm run test -w apps/api

# Frontend
npm run test -w apps/frontend
```

## 🚢 Deploy

Desplegado en [Render](https://render.com) usando `render.yaml` como blueprint:

- **API:** Dockerfile multi-stage → Node 22 Alpine → Prisma migrate + seed al arranque
- **Frontend:** Build estático servido con Nginx
- **Base de datos:** PostgreSQL managed en Render (plan free)

## ⚙️ CI/CD

Pipeline de [GitHub Actions](.github/workflows/ci.yml) que se ejecuta en cada PR y push a `main`:

- **quality** — lint y build del monorepo
- **test-frontend** — tests del frontend con Vitest
- **test-api** — tests del backend con Jest + PostgreSQL

## 👨‍💻 Autor

**Pablo Exequiel Giménez** — [GitHub](https://github.com/PabloExeQGimenez)
