/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['prisma', '@prisma/client'],
  webpack: (config) => {
    config.externals.push({
      'prisma': 'prisma',
      '@prisma/client': '@prisma/client',
    })
    return config
  },
}

module.exports = nextConfig