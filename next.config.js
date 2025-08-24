/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'popup-dist',
  assetPrefix: './',
  images: {
    unoptimized: true
  },
  // Disable client-side JavaScript for Chrome extension CSP compliance
  experimental: {
    disableOptimizedLoading: true
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    // For Chrome extension compatibility, we need to avoid inline scripts
    if (!isServer) {
      // Disable runtime chunk to prevent inline scripts
      config.optimization.runtimeChunk = false;
      
      // Minimize chunks to reduce CSP issues
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 0,
        cacheGroups: {
          default: false,
          vendors: false,
          main: {
            name: 'main',
            chunks: 'all',
            enforce: true
          }
        }
      };
    }
    
    return config;
  }
};

module.exports = nextConfig;