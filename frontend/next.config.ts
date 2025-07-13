import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: process.env.HOSTNAMES ? process.env.HOSTNAMES.split(',') : [],
  },
};

export default nextConfig;
