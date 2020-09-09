const isDev = process.env.NODE_ENV === 'development'
const isBCH = process.env.BUILD_MODE === 'bch'
const path = require('path')
const { replaceColorToVar } = require('../build/custom-theme-plugin')

module.exports = {
  outputDir: path.resolve(
    __dirname,
    '../../../../../trunk/mvvm-project/vue/kd-pc/quicklyBuild'
  ),
  publicPath: isDev
    ? '/'
    : `https://res${
        isBCH ? '.bch' : ''
      }.leju.com/mvvm-project/vue/kd-pc/quicklyBuild`,
  filenameHashing: false,
  productionSourceMap: false,
  configureWebpack: config => {
    config.entry = {
      app: ['./src/kd/main.ts']
    }
    if (isDev) {
      config.devtool = 'source-map'
    }
  },
  devServer: {
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
    }
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "~@/kd/style/global-variable.scss";`
      },
      postcss: {
        plugins: [require('autoprefixer')(), replaceColorToVar]
      }
    }
  }
}
