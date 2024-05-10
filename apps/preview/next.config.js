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
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g|mov)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            publicPath: '/_next/static/sounds/', // Путь, куда будут скопированы аудиофайлы
            outputPath: 'static/sounds/', // Путь для сохранения аудиофайлов в сборке
          },
        },
      ],
    })
    return config
  },
}

module.exports = nextConfig
