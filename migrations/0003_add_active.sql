-- Projeto oculto (active = 0) some do site mas continua no painel.
ALTER TABLE projects ADD COLUMN active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1));
