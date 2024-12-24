import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Add bindings alias
    config.resolve.alias = {
      ...config.resolve.alias,
      bindings: path.resolve(__dirname, 'bindings/src/index.ts'),
    };

    // Add fallbacks for node modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        encoding: false,
        "pino-pretty": false,
      };
    }

    return config;
  },
};

export default nextConfig;
