# Task Flow

Gerenciador de tarefas com board estilo Kanban, com autenticação, múltiplos quadros, gerenciamento de membros e drag & drop.

## Stack

- **Frontend:** React 18 + TypeScript + Material UI 5 + Vite 5
- **Backend:** NestJS 10 + TypeScript
- **Banco de dados:** Supabase (PostgreSQL)
- **Deploy:** Vercel (Serverless)

## Funcionalidades

- Autenticação (login e cadastro)
- Editar perfil (nome, e-mail, avatar)
- CRUD de quadros (boards) com ícone e cor personalizáveis
- Sidebar de quadros com criação rápida
- Gerenciamento de membros por quadro (convite por e-mail)
- Filtro de quadros por usuário (cada usuário vê apenas seus quadros)
- Board Kanban com 3 colunas: **Não iniciado**, **Em andamento**, **Concluído**
- Criar, editar, duplicar e excluir tarefas
- Drag & drop entre colunas (altera status automaticamente)
- Atribuição de responsável por tarefa
- Datas de início e vencimento com indicação visual de atraso
- Chip "Atrasada" para tarefas vencidas
- Loading states (sidebar e área principal)

## Como rodar localmente

### Pré-requisitos

- Node.js 18+
- npm
- Conta no [Supabase](https://supabase.com)

### Banco de dados

1. Crie um projeto no Supabase
2. Acesse o **SQL Editor** e execute o conteúdo de `backend/supabase-schema.sql`

### Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend/`:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-anon
FRONTEND_URL=http://localhost:5173
```

```bash
npm run start:dev
```

O servidor roda em `http://localhost:3000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O app roda em `http://localhost:5173`.

> Em desenvolvimento local, não é necessário criar `.env` no frontend — o padrão já aponta para `http://localhost:3000`.

## Variáveis de ambiente

| Variável       | Projeto  | Obrigatória | Descrição                                                    |
| -------------- | -------- | ----------- | ------------------------------------------------------------ |
| `SUPABASE_URL` | Backend  | Sim         | URL do projeto Supabase                                      |
| `SUPABASE_KEY` | Backend  | Sim         | Chave anon do Supabase                                       |
| `FRONTEND_URL` | Backend  | Não         | URL do frontend para CORS (default: `http://localhost:5173`) |
| `PORT`         | Backend  | Não         | Porta do servidor (default: `3000`)                          |
| `VITE_API_URL` | Frontend | Não         | URL base da API (default: `http://localhost:3000`)           |

## API Endpoints

### Auth (`/auth`)

| Método | Rota                | Descrição             |
| ------ | ------------------- | --------------------- |
| POST   | `/auth/register`    | Cadastrar usuário     |
| POST   | `/auth/login`       | Login (email + senha) |
| PUT    | `/auth/profile/:id` | Atualizar perfil      |

### Boards (`/boards`)

| Método | Rota                          | Descrição                  |
| ------ | ----------------------------- | -------------------------- |
| GET    | `/boards?userId=`             | Listar quadros do usuário  |
| GET    | `/boards/:id`                 | Buscar quadro por ID       |
| POST   | `/boards`                     | Criar quadro               |
| PUT    | `/boards/:id`                 | Editar quadro              |
| DELETE | `/boards/:id`                 | Excluir quadro             |
| GET    | `/boards/:id/members`         | Listar membros do quadro   |
| POST   | `/boards/:id/members`         | Convidar membro por e-mail |
| DELETE | `/boards/:id/members/:userId` | Remover membro             |

### Tasks (`/tasks`)

| Método | Rota              | Descrição                |
| ------ | ----------------- | ------------------------ |
| GET    | `/tasks?boardId=` | Listar tarefas do quadro |
| GET    | `/tasks/:id`      | Buscar tarefa por ID     |
| POST   | `/tasks`          | Criar tarefa             |
| PUT    | `/tasks/:id`      | Atualizar tarefa         |
| DELETE | `/tasks/:id`      | Excluir tarefa           |

## Banco de dados

4 tabelas no Supabase:

- **users** — id, name, email, password, avatar
- **boards** — id, name, icon, icon_color
- **board_members** — board_id, user_id (relação N:N)
- **tasks** — id, board_id, title, description, status, assignee_id, assignee_name, start_date, due_date

O schema completo está em `backend/supabase-schema.sql`.

## Deploy na Vercel

O projeto é deployado como **dois projetos separados** (backend e frontend).

### Backend

1. Crie um novo projeto na Vercel e importe o repositório
2. **Root Directory:** `backend`
3. **Build Command:** `npm run build`
4. Adicione as variáveis de ambiente: `SUPABASE_URL`, `SUPABASE_KEY`, `FRONTEND_URL`
5. Deploy

### Frontend

1. Crie outro projeto na Vercel e importe o mesmo repositório
2. **Root Directory:** `frontend`
3. **Framework Preset:** Vite
4. Adicione a variável de ambiente: `VITE_API_URL` (URL do backend deployado)
5. Deploy

Após o deploy do frontend, atualize a variável `FRONTEND_URL` no projeto do backend com a URL do frontend e faça redeploy.

## Estrutura do projeto

```
task-flow/
├── backend/
│   ├── src/
│   │   ├── auth/          # Autenticação (login, registro, perfil)
│   │   ├── boards/        # CRUD de quadros e membros
│   │   ├── tasks/         # CRUD de tarefas
│   │   ├── supabase/      # Módulo do Supabase
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── supabase-schema.sql
│   ├── vercel.json
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Componentes React (11 componentes)
│   │   ├── contexts/      # AuthContext
│   │   ├── services/      # APIs (taskApi, boardApi)
│   │   ├── types.ts       # Tipos TypeScript
│   │   └── App.tsx        # Componente principal
│   ├── vercel.json
│   └── package.json
└── README.md
```
