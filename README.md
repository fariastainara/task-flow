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
- CRUD de quadros (boards) com ícone, cor do ícone e cor de fundo personalizáveis
- Duplicar quadros
- Reordenação de quadros por drag & drop na sidebar
- Convite de membros por e-mail com status (pendente, aceito, recusado)
- Notificação de convites pendentes com badge
- Filtro de tarefas por membro (clique no avatar)
- Board Kanban com 3 colunas: **Não iniciado**, **Em andamento**, **Concluído**
- Criar, editar, duplicar e excluir tarefas
- Prioridade de tarefa: Baixa, Média, Alta, Urgente
- Atribuição de responsável por tarefa
- Datas de início e vencimento com indicador visual de atraso
- Drag & drop de tarefas entre colunas (altera status automaticamente)
- Busca de tarefas por título
- Ordenação de tarefas por prioridade em cada coluna
- Contador de tarefas colorido por coluna
- Barra de progresso segmentada por status (concluídas, em andamento, atrasadas, a fazer)
- Loading states na sidebar e área principal
- Layout responsivo (mobile e desktop)

## Como rodar localmente

### Pré-requisitos

- [Node.js 18+](https://nodejs.org/)
- npm (incluído com o Node.js)
- Conta no [Supabase](https://supabase.com) (gratuita)
- Git

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/task-flow.git
cd task-flow
```

### 2. Configure o banco de dados (Supabase)

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Após a criação, vá em **SQL Editor** no menu lateral
3. Cole e execute todo o conteúdo do arquivo `backend/supabase-schema.sql`
4. Após a execução, vá em **Project Settings → API** e copie:
   - **Project URL** → será o valor de `SUPABASE_URL`
   - **anon / public key** → será o valor de `SUPABASE_KEY`

### 3. Configure e rode o backend

```bash
cd backend
npm install
```

Crie o arquivo `backend/.env` com as credenciais do Supabase:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-anon-publica
```

Inicie o servidor em modo de desenvolvimento (com hot-reload):

```bash
npm run start:dev
```

O backend ficará disponível em `http://localhost:3000`.

### 4. Configure e rode o frontend

Abra um **novo terminal** (mantenha o backend rodando):

```bash
cd frontend
npm install
npm run dev
```

O frontend ficará disponível em `http://localhost:5173`.

> Não é necessário criar `.env` no frontend para rodar localmente — por padrão já aponta para `http://localhost:3000`.

### 5. Acesse a aplicação

Abra o navegador em `http://localhost:5173`. Cadastre-se com e-mail e senha para começar a usar.

---

## Variáveis de ambiente

| Variável       | Projeto  | Obrigatória | Descrição                                                    |
| -------------- | -------- | ----------- | ------------------------------------------------------------ |
| `SUPABASE_URL` | Backend  | Sim         | URL do projeto Supabase                                      |
| `SUPABASE_KEY` | Backend  | Sim         | Chave anon pública do Supabase                               |
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

| Método | Rota                                    | Descrição                         |
| ------ | --------------------------------------- | --------------------------------- |
| GET    | `/boards?userId=`                       | Listar quadros do usuário         |
| GET    | `/boards/:id`                           | Buscar quadro por ID              |
| POST   | `/boards`                               | Criar quadro                      |
| PUT    | `/boards/:id`                           | Editar quadro                     |
| DELETE | `/boards/:id`                           | Excluir quadro                    |
| POST   | `/boards/:id/duplicate`                 | Duplicar quadro                   |
| POST   | `/boards/reorder`                       | Reordenar quadros na sidebar      |
| GET    | `/boards/:id/members`                   | Listar membros do quadro          |
| POST   | `/boards/:id/members`                   | Convidar membro por e-mail        |
| DELETE | `/boards/:id/members/:userId`           | Remover membro                    |
| GET    | `/boards/invitations/pending?userId=`   | Listar convites pendentes         |
| POST   | `/boards/:id/invitations/respond`       | Aceitar ou recusar convite        |

### Tasks (`/tasks`)

| Método | Rota              | Descrição                |
| ------ | ----------------- | ------------------------ |
| GET    | `/tasks?boardId=` | Listar tarefas do quadro |
| GET    | `/tasks/:id`      | Buscar tarefa por ID     |
| POST   | `/tasks`          | Criar tarefa             |
| PUT    | `/tasks/:id`      | Atualizar tarefa         |
| DELETE | `/tasks/:id`      | Excluir tarefa           |

## Banco de dados

4 tabelas no Supabase (schema completo em `backend/supabase-schema.sql`):

**users**
| Coluna | Tipo | Descrição |
| --- | --- | --- |
| id | UUID | Chave primária |
| name | TEXT | Nome do usuário |
| email | TEXT | E-mail único |
| password | TEXT | Senha (texto simples) |
| avatar | TEXT | URL do avatar (opcional) |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data de atualização |

**boards**
| Coluna | Tipo | Descrição |
| --- | --- | --- |
| id | UUID | Chave primária |
| name | TEXT | Nome do quadro |
| icon | TEXT | Nome do ícone |
| icon_color | TEXT | Cor do ícone (hex) |
| bg_color | TEXT | Cor de fundo (hex) |
| created_by | UUID | FK → users.id |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data de atualização |

**board_members**
| Coluna | Tipo | Descrição |
| --- | --- | --- |
| id | UUID | Chave primária |
| board_id | UUID | FK → boards.id |
| user_id | UUID | FK → users.id |
| status | TEXT | `PENDING`, `ACCEPTED` ou `DECLINED` |
| sort_order | INTEGER | Ordem do quadro na sidebar |
| created_at | TIMESTAMPTZ | Data de criação |

**tasks**
| Coluna | Tipo | Descrição |
| --- | --- | --- |
| id | UUID | Chave primária |
| board_id | UUID | FK → boards.id |
| title | TEXT | Título da tarefa |
| description | TEXT | Descrição (opcional) |
| status | TEXT | `TODO`, `IN_PROGRESS` ou `DONE` |
| priority | TEXT | `LOW`, `MEDIUM`, `HIGH` ou `URGENT` |
| assignee_id | UUID | FK → users.id (opcional) |
| assignee_name | TEXT | Nome do responsável (cache) |
| start_date | TEXT | Data de início (YYYY-MM-DD) |
| due_date | TEXT | Data de vencimento (YYYY-MM-DD) |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data de atualização |

## Deploy na Vercel

O projeto é deployado como **dois projetos separados** na Vercel (backend e frontend).

### Backend

1. Crie um novo projeto na Vercel e importe este repositório
2. **Root Directory:** `backend`
3. **Build Command:** `npm run build`
4. Adicione as variáveis de ambiente: `SUPABASE_URL` e `SUPABASE_KEY`
5. Faça o deploy e copie a URL gerada (ex: `https://task-flow-api.vercel.app`)

### Frontend

1. Crie outro projeto na Vercel e importe o mesmo repositório
2. **Root Directory:** `frontend`
3. **Framework Preset:** Vite
4. Adicione a variável de ambiente `VITE_API_URL` com a URL do backend (passo anterior)
5. Faça o deploy

## Estrutura do projeto

```
task-flow/
├── backend/
│   ├── src/
│   │   ├── auth/           # Autenticação (login, registro, perfil)
│   │   ├── boards/         # CRUD de quadros, membros e convites
│   │   ├── tasks/          # CRUD de tarefas
│   │   ├── supabase/       # Módulo do cliente Supabase
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── api/
│   │   └── index.js        # Handler serverless para Vercel
│   ├── supabase-schema.sql # Script de criação do banco
│   ├── vercel.json
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   │   ├── TaskBoard.tsx
│   │   │   ├── TaskColumn.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   ├── BoardSelector.tsx
│   │   │   ├── BoardMembersDialog.tsx
│   │   │   ├── PendingInvitesDialog.tsx
│   │   │   ├── EditProfileDialog.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx  # Autenticação global
│   │   ├── services/
│   │   │   ├── taskApi.ts       # Chamadas à API de tarefas
│   │   │   └── boardApi.ts      # Chamadas à API de quadros
│   │   ├── types.ts             # Tipos TypeScript compartilhados
│   │   └── App.tsx              # Componente raiz
│   ├── vercel.json
│   └── package.json
└── README.md
```
