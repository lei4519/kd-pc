const isDev = process.env.NODE_ENV === 'development'
const { replaceColorToVar } = require('../build/custom-theme-plugin')
const { getTargetGitPath } = require('commit-git')
const databiPath = getTargetGitPath('databi')

module.exports = {
  outputDir: `${databiPath}/application/views/vd_page/preview`,
  publicPath: isDev ? '/' : '/application/views/vd_page/preview',
  filenameHashing: false,
  productionSourceMap: false,
  configureWebpack: config => {
    config.entry = {
      app: ['./src/pc/main.ts']
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
    },
    proxy: {
      '/api': {
        target: 'http://vd.bch.leju.com',
        changeOrigin: true
      }
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
