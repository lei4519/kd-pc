const isDev = process.env.NODE_ENV === 'development'
const fs = require('fs')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  filenameHashing: false,
  outputDir: 'dist/singlecomponents',
  configureWebpack: config => {
    if (isDev) {
      config.devtool = 'source-map'
    }
    config.entry = {}
    fs.readdirSync(
      path.resolve(__dirname, '../src/singlecomponents/components')
    ).forEach(item => {
      config.entry[item] =
        './src/singlecomponents/components' + '/' + item + '/' + 'index.js'
    })
    config.plugins.push(
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '../src/singlecomponents/index.html')
      })
    )
    if (!isDev) {
      config.plugins.push({
        apply(compiler) {
          compiler.hooks.done.tap('editFontPath', compilation => {
            const js = fs.readFileSync(
              path.resolve(
                __dirname,
                '../dist/singlecomponents/js/chunk-vendors.js'
              ),
              'utf-8'
            )
            fs.writeFileSync(
              path.resolve(
                __dirname,
                '../dist/singlecomponents/js/chunk-vendors.js'
              ),
              js.replace(
                /i\.p\+"fonts\//g,
                '"https://adjs.bch.leju.com/mvvm-project/vue/kd-pc/singlecomponents/fonts/'
              )
            )
          })
        }
      })
    }
  },
  css: {
    extract: false
  }
}
