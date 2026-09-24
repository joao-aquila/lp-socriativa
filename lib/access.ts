import "server-only";
import { headers } from "next/headers";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { cf } from "./cloudflare";

/**
 * Autenticação do painel via Cloudflare Access.
 *
 * O Access fica na frente de /admin e só deixa passar quem fez login (código
 * por e-mail). Toda requisição autorizada chega com o cabeçalho
 * `Cf-Access-Jwt-Assertion`, um JWT assinado pelo Access. Validar esse JWT
 * aqui garante que ninguém chega no painel por um caminho que não passe pelo
 * Access (ex.: *.workers.dev) nem forjando o cabeçalho.
 */

export type Admin = { email: string };

const jwksByTeam = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function teamDomain(value?: string) {
  if (!value) return null;
  const withScheme = /^https?:\/\//.test(value) ? value : `https://${value}`;
  // http só para testar com um JWKS local; em produção as chaves vêm por https
  if (withScheme.startsWith("http://") && process.env.NODE_ENV !== "development") return null;
  return withScheme.replace(/\/$/, "");
}

function jwks(team: string) {
  let set = jwksByTeam.get(team);
  if (!set) {
    set = createRemoteJWKSet(new URL(`${team}/cdn-cgi/access/certs`));
    jwksByTeam.set(team, set);
  }
  return set;
}

export async function getAdmin(): Promise<Admin | null> {
  const env = cf();
  const team = teamDomain(env.CF_ACCESS_TEAM_DOMAIN);
  const audience = env.CF_ACCESS_AUD;

  if (!team || !audience) {
    // sem Access configurado, só o `next dev` passa. Em produção, falha fechado.
    return process.env.NODE_ENV === "development" ? { email: "dev@localhost" } : null;
  }

  const token = (await headers()).get("cf-access-jwt-assertion");
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, jwks(team), {
      issuer: team,
      audience,
      // o Access assina com RS256; qualquer outro algoritmo é recusado
      algorithms: ["RS256"],
    });
    const email = typeof payload.email === "string" ? payload.email.toLowerCase() : null;
    if (!email) return null;

    const allowed = (env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);
    if (allowed.length > 0 && !allowed.includes(email)) return null;

    return { email };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) throw new Error("não autorizado");
  return admin;
}

/** Encerra a sessão do Access (vale para todas as aplicações do time). */
export const LOGOUT_URL = "/cdn-cgi/access/logout";
