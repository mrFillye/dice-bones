/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-pixi-fiber', 'pixi.js', '@sok/dice'],
  experimental: {
    serverActions: true,
    appDir: true,
  },
  reactStrictMode: false,
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
    })

    return config
  },
}

module.exports = nextConfig
