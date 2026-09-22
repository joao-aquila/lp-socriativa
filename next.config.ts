import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // o painel envia a imagem do projeto junto com o formulário
    serverActions: { bodySizeLimit: "8mb" },
  },
};

export default nextConfig;
