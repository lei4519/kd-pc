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
    // loaderOptions: {
    //   postcss: {
    //     plugins: [
    //       require('autoprefixer')(),
    //       css => {
    //         css.walkDecls(decl => {
    //           if (decl.value === '1px') {
    //             decl.value = '1PX'
    //           }
    //         })
    //       },
    //       require('postcss-pxtorem')({
    //         rootValue: 100,
    //         propList: ['*'],
    //       }),
    //     ],
    //   }
    // }
  },
  devServer: {
    proxy: 'http://localhost:4000'
  }
}
