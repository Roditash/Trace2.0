/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Permite exportar como sitio estático puro (sin servidor).
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
