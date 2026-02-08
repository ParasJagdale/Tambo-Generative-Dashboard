/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  env: {
    NEXT_PUBLIC_APP_NAME: "AI Life Dashboard",
  },
  images: {
    domains: ["api.openweathermap.org"],
  },
};

module.exports = nextConfig;
