import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: { unoptimized: true },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/:slug*',
  //       destination: 'http://localhost:3001/:slug*',
  //     },
  //   ]
  // },
}

export default nextConfig
