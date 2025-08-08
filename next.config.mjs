/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
    // Disable webpack cache in production
  webpack: (config, { isServer, dev }) => {
    if (!dev) {
      config.cache = false
    }
    return config
  },
    // Disable source maps in production (reduces file size)
  productionBrowserSourceMaps: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  cleanDistDir: true

}

export default nextConfig
