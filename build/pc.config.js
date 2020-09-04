const isDev = process.env.NODE_ENV === 'development'
module.exports = {
  outputDir: 'dist/pc',
  chainWebpack: config => {
    config
      .entry('app')
      .clear()
      .add('./src/h5/main.ts')
      .end()
  },
  configureWebpack: config => {
    if (isDev) {
      config.devtool = 'source-map'
    }
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "~@/kd/style/global-variable.scss";`
      }
    }
  },
  devServer: {
    disableHostCheck: true
  }
}
