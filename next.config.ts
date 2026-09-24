import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

/** Domínio público do bucket R2 com as artes do portfólio. */
const imagesHost = process.env.IMAGES_BASE_URL || "https://img.socriativaestudio.com.br";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // ninguém embute o site num iframe (clickjacking no painel)
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [new URL(`${imagesHost.replace(/\/$/, "")}/**`)],
  },
  experimental: {
    // o painel envia a imagem do projeto junto com o formulário
    serverActions: { bodySizeLimit: "8mb" },
  },
};

export default nextConfig;

// bindings do wrangler.jsonc (D1, R2) disponíveis no `next dev`, em versão local
initOpenNextCloudflareForDev();
