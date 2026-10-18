/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  // Disable webpack cache in production
  webpack: (config, { dev }) => {
    if (!dev) {
      config.cache = false
    }
    return config
  },
  // Disable source maps in production to reduce the file size
  productionBrowserSourceMaps: false,
  // EmailJS service/template IDs are public identifiers; inline them into the client bundle at build time
  env: {
    EMAIL_SERVICE_ID: process.env.EMAIL_SERVICE_ID ?? '',
    EMAIL_TEMPLATE_ID: process.env.EMAIL_TEMPLATE_ID ?? process.env.EMAIL_TRMPLATE_ID ?? '',
  },
  images: {
    unoptimized: true,
  },
  cleanDistDir: true
}

export default nextConfig