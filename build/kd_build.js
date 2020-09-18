const { sh, runBuild } = require('commit-git')

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

runBuild([runBuildKD(), runBuildPC()], isBCH)
