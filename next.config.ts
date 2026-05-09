import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

nextConfig.experimental = {
  cpus: 1,
  workerThreads: true,
};

export default nextConfig;
