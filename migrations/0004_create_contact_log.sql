-- Envios do formulário de contato, para limitar por IP (anti-spam).
-- Guarda só o hash do IP; linhas com mais de 1 dia são apagadas a cada envio.
CREATE TABLE contact_log (
  ip_hash    TEXT    NOT NULL,
  -- epoch em milissegundos
  created_at INTEGER NOT NULL
);

CREATE INDEX contact_log_ip_created ON contact_log (ip_hash, created_at);
CREATE INDEX contact_log_created ON contact_log (created_at);
