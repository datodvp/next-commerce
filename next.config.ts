import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // This allows any hostname
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "**", // This allows any hostname for HTTP as well
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
