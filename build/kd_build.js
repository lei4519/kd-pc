// cross-env BUILD_PLATFORM=kd BUILD_MODE=bch vue-cli-service build --mode test & cross-env BUILD_PLATFORM=pc BUILD_MODE=bch vue-cli-service build --mode test
// cross-env BUILD_PLATFORM=kd vue-cli-service build --mode production & cross-env BUILD_PLATFORM=pc vue-cli-service build --mode production
const createShell = require('./createShell')
const fsExtra = require('fs-extra')
const path = require('path')

const isBCH = process.argv[2] === 'test'
// 打包 KD
const runBuildKD = () => {
  return new Promise((resolve, reject) => {
    createShell(
      `cross-env BUILD_PLATFORM=kd ${
        isBCH ? 'BUILD_MODE=bch' : ''
      } vue-cli-service build --mode ${isBCH ? 'test' : 'production'}`
    ).on('exit', code => {
      code === 0 ? resolve() : reject()
    })
  })
}
// 打包 PC
const runBuildPC = () => {
  return new Promise((resolve, reject) => {
    createShell(
      `cross-env BUILD_PLATFORM=pc ${
        isBCH ? 'BUILD_MODE=bch' : ''
      } vue-cli-service build --mode ${isBCH ? 'test' : 'production'}`
    ).on('exit', code => {
      code === 0 ? resolve() : reject()
    })
  })
}
// 移动 HTML文件至 vd.leju.com
function moveHtml() {
  console.log('项目打包完成，开始移动 HTML 文件至 vd.lejul.com 文件夹')
  try {
    const kdOutputDir = require('./kd.config').outputDir
    const vdKDPath = path.resolve(
      __dirname,
      '../../../../../../vd.leju.com/branches/application/views/vd_page'
    )
    const pcOutputDir = require('./pc.config').outputDir
    const vdPCPath = path.resolve(
      __dirname,
      '../../../../../../vd.leju.com/branches/application/views/template'
    )
    fsExtra.copySync(`${kdOutputDir}/index.html`, `${vdKDPath}/index.html`)
    fsExtra.copySync(`${pcOutputDir}/index.html`, `${vdPCPath}/index.html`)
    console.log('KD HTML path: ', `${vdKDPath}/index.html`)
    console.log('PC HTML path: ', `${vdPCPath}/index.html`)
    console.log('HTML 文件移动成功')
  } catch {
    console.log('HTML 文件移动失败，请手动移动')
  }
}

Promise.all([runBuildKD(), runBuildPC()]).then(moveHtml)
