const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false
    }
    return config
  },
  images: {
    domains: ['arweave.net'], // Add 'arweave.net' to the domains configuration
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'arweave.net',
        port: '',
        pathname: '/sm60z3ecwHoErDNEYGXYarM6FZdMbsOvsJkcbU4tnQI/[number]', // Use [number] as a placeholder
      },
    ],
  }
};

module.exports = nextConfig;
