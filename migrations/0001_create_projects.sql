-- Projetos do portfólio. A ordem de exibição é por categoria (`position`).
CREATE TABLE projects (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  slug         TEXT    NOT NULL UNIQUE,
  title        TEXT    NOT NULL,
  client       TEXT    NOT NULL,
  category     TEXT    NOT NULL CHECK (category IN ('conteudo', 'identidade', 'design')),
  description  TEXT,
  -- chave do objeto no R2 (bucket portfolio-images)
  image_key    TEXT,
  aspect       TEXT    NOT NULL DEFAULT 'portrait' CHECK (aspect IN ('portrait', 'landscape', 'square')),
  link         TEXT,
  position     INTEGER NOT NULL DEFAULT 0,
  featured     INTEGER NOT NULL DEFAULT 1 CHECK (featured IN (0, 1)),
  published_at TEXT,
  created_at   TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at   TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX projects_category_position ON projects (category, position);
