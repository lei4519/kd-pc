const { sh, runBuild, getTargetGitPath } = require('commit-git')

const isBCH = process.argv[2] === 'test'
// 打包 KD
const runBuildKD = () =>
  sh(
    `cross-env BUILD_PLATFORM=kd ${
      isBCH ? 'BUILD_MODE=bch' : ''
    } vue-cli-service build --mode ${isBCH ? 'test' : 'production'}`
  )
// 打包 PC
const runBuildPC = () =>
  sh(
    `cross-env BUILD_PLATFORM=pc ${
      isBCH ? 'BUILD_MODE=bch' : ''
    } vue-cli-service build --mode ${isBCH ? 'test' : 'production'}`
  )

;(async function() {
  await Promise.all([runBuildKD(), runBuildPC()])

  const databiDir = getTargetGitPath('databi') + '/application/views/vd_page'

  const { outputDir: kdOutputDir } = require('./kd.config')
  const { outputDir: pcOutputDir } = require('./pc.config')

  const fsExtra = require('fs-extra')

  try {
    fsExtra.copySync(`${kdOutputDir}/index.html`, `${databiDir}/build.html`)
    fsExtra.copySync(`${pcOutputDir}/index.html`, `${databiDir}/preview.html`)

    console.log('移动资源文件完成')
    console.log('databiDir :>> ', databiDir)
    console.log('kdOutputDir :>> ', kdOutputDir)
    console.log('pcOutputDir :>> ', pcOutputDir)

    sh(
      `cd ${databiDir}
      svn status
      svn commit -m 'build'`
    )
  } catch (error) {
    console.error('移动资源文件失败，请重试或者手动移动')
    throw error
  }
})()
