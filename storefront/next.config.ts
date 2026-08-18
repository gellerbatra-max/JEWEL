import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // The Manage dashboard uploads jewellery photos through Server Actions.
    // Raise the default 1MB cap so several high-resolution photos can be saved
    // in a single submission.
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
