import "server-only";

/**
 * Publicação de conteúdo via GitHub: cada alteração do painel vira um commit
 * no próprio repositório, e o deploy reconstrói o site com o conteúdo novo.
 *
 * Vantagem sobre um banco: nada para hospedar, nada que hiberne ou expire, e
 * histórico completo do que foi publicado (com possibilidade de reverter).
 * Custo: o site leva alguns segundos para refletir a mudança.
 *
 * Usa a Git Data API (blob → tree → commit → ref) em vez da Contents API
 * porque assim o JSON e a imagem entram no MESMO commit — um único rebuild.
 */

const API = "https://api.github.com";

export type CommitFile =
  | { path: string; content: string; encoding: "utf-8" | "base64" }
  | { path: string; delete: true };

/** Só publica no GitHub quando há token; sem ele o painel escreve em disco (dev). */
export function isGitHubConfigured() {
  return Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO);
}

function config() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) {
    throw new Error("GITHUB_TOKEN e GITHUB_REPO precisam estar configurados");
  }
  return { token, repo, branch: process.env.GITHUB_BRANCH || "main" };
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const { token } = config();
  const response = await fetch(`${API}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `GitHub ${init?.method ?? "GET"} ${path} falhou (${response.status}): ${body.slice(0, 300)}`,
    );
  }

  return response.json() as Promise<T>;
}

/**
 * Cria um único commit com todos os arquivos informados.
 * Entradas com `delete: true` removem o arquivo do repositório.
 */
export async function commitFiles(files: CommitFile[], message: string) {
  if (files.length === 0) return;
  const { repo, branch } = config();

  // 1. onde o branch está agora
  const ref = await api<{ object: { sha: string } }>(
    `/repos/${repo}/git/ref/heads/${branch}`,
  );
  const parentSha = ref.object.sha;

  const parent = await api<{ tree: { sha: string } }>(
    `/repos/${repo}/git/commits/${parentSha}`,
  );

  // 2. sobe o conteúdo de cada arquivo novo como blob
  const entries = await Promise.all(
    files.map(async (file) => {
      if ("delete" in file) {
        return { path: file.path, mode: "100644", type: "blob", sha: null };
      }
      const blob = await api<{ sha: string }>(`/repos/${repo}/git/blobs`, {
        method: "POST",
        body: JSON.stringify({ content: file.content, encoding: file.encoding }),
      });
      return { path: file.path, mode: "100644", type: "blob", sha: blob.sha };
    }),
  );

  // 3. árvore nova a partir da atual
  const tree = await api<{ sha: string }>(`/repos/${repo}/git/trees`, {
    method: "POST",
    body: JSON.stringify({ base_tree: parent.tree.sha, tree: entries }),
  });

  // 4. commit
  const commit = await api<{ sha: string }>(`/repos/${repo}/git/commits`, {
    method: "POST",
    body: JSON.stringify({ message, tree: tree.sha, parents: [parentSha] }),
  });

  // 5. move o branch (sem force: falha se alguém commitou nesse meio-tempo)
  await api(`/repos/${repo}/git/refs/heads/${branch}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha, force: false }),
  });
}
