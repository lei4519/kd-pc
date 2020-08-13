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
    fs.readdirSync(path.resolve(__dirname, '../src/singlecomponents/components')).forEach(item => {
      config.entry[item] = './src/singlecomponents/components' + '/' + item + '/' + 'index.js'
    })
    config.plugins.push(new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/singlecomponents/index.html')
    }))
  },
  devServer: {
    proxy: 'http://localhost:4000'
  }
}
