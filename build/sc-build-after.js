const fsExtra = require('fs-extra')
const path = require('path')
const outputDir = `../../../adjs.leju.com/mvvm-project/vue/kd-pc/singlecomponents`
console.log(path.resolve(__dirname, '../dist/singlecomponents'))
try {
  fsExtra.copySync(
    path.resolve(__dirname, '../dist/singlecomponents'),
    outputDir
  )
  console.log('移动资源文件完成')
} catch (error) {
  console.error('移动资源文件失败，请重试或者手动移动')
  throw error
}
