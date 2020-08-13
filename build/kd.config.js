const isDev = process.env.NODE_ENV === 'development'
module.exports = {
  outputDir: 'dist/kd',
  chainWebpack: config => {
    config
      .entry('app')
      .clear()
      .add('./src/kd/main.ts')
      .end()
  },
  configureWebpack: config => {
    if (isDev) {
      config.devtool = 'source-map'
    }
  },
  devServer: {
    proxy: 'http://localhost:4000'
  }
}
