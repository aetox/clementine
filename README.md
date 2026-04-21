# Babyfoot Tournament Manager

Application fullstack Nuxt 4 pour gerer des tournois de baby-foot:

- CRUD tournois (nom, date, description)
- generation automatique des matchs en Round Robin
- saisie des scores
- calcul de classement en temps reel (3/1/0 + goal average)

## Stack

- Nuxt 4 (frontend dans app/)
- API REST Nitro (server/api)
- Prisma + PostgreSQL
- Validation Zod
- Tailwind CSS + DaisyUI
- TypeScript strict

## Structure

- app/pages, app/components, app/composables, app/assets
- server/api, server/utils
- shared (types + schemas + algorithmes)
- prisma (schema + migrations)

## Installation locale

1. Installer les dependances:

```bash
npm install
```

2. Copier les variables d'environnement:

```bash
cp .env.example .env
```

3. Demarrer PostgreSQL (exemple Docker):

```bash
docker compose up -d db
```

4. Generer Prisma Client et appliquer les migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Lancer l'application:

```bash
npm run dev
```

## Build production

```bash
npm run build
npm run start
```

## API REST

- GET /api/tournaments
- POST /api/tournaments
- GET /api/tournaments/:id
- PUT /api/tournaments/:id
- DELETE /api/tournaments/:id
- POST /api/tournaments/:id/generate-matches
- GET /api/tournaments/:id/standings
- PATCH /api/matches/:id/score

## Docker

Le projet inclut:

- Dockerfile multi-etape pour Nuxt
- docker-compose.yml avec services app + db

Commande:

```bash
docker compose up --build
```

Notes:

- Le service `db` expose un healthcheck (`pg_isready`).
- Le service `app` attend que la base soit healthy.
- Au demarrage, `app` execute automatiquement `prisma migrate deploy` avant de lancer Nuxt.
