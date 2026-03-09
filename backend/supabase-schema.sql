-- ===========================================
-- Task Flow - Schema SQL para Supabase
-- Execute este script no SQL Editor do Supabase
-- ===========================================

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de quadros
CREATE TABLE IF NOT EXISTS boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT DEFAULT 'Dashboard',
  icon_color TEXT DEFAULT '#1976d2',
  bg_color TEXT DEFAULT '#f5f5f5',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Migração: adicionar coluna bg_color se já existir a tabela
ALTER TABLE boards ADD COLUMN IF NOT EXISTS bg_color TEXT DEFAULT '#f5f5f5';

-- Tabela de membros do quadro
CREATE TABLE IF NOT EXISTS board_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'ACCEPTED' CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(board_id, user_id)
);

ALTER TABLE board_members
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'ACCEPTED';

UPDATE board_members
SET status = 'ACCEPTED'
WHERE status IS NULL;

ALTER TABLE board_members DROP CONSTRAINT IF EXISTS board_members_status_check;
ALTER TABLE board_members
  ADD CONSTRAINT board_members_status_check
  CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED'));

-- Tabela de tarefas
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'TODO' CHECK (status IN ('TODO', 'IN_PROGRESS', 'DONE')),
  assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  assignee_name TEXT,
  start_date TEXT,
  due_date TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_tasks_board_id ON tasks(board_id);
CREATE INDEX IF NOT EXISTS idx_board_members_board_id ON board_members(board_id);
CREATE INDEX IF NOT EXISTS idx_board_members_user_id ON board_members(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Usuário admin padrão (senha: admin123)
INSERT INTO users (name, email, password)
VALUES ('Admin', 'admin@taskflow.com', 'admin123')
ON CONFLICT (email) DO NOTHING;
