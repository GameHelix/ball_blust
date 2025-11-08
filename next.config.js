/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-59d41840ad0d44eb94b770747a083587.r2.dev',
      },
    ],
  },
}

module.exports = nextConfig
