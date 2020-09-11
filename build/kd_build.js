const { spawn } = require('child_process')
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
const moveHtml = () => {
  console.log('项目打包完成，开始移动 HTML 文件至 vd.lejul.com 文件夹')
  try {
    const kdOutputDir = require('./kd.config').outputDir
    const quickBuildPath = path.resolve(
      __dirname,
      '../../../../../../vd.leju.com/branches/application/views/vd_page'
    )
    const pcOutputDir = require('./pc.config').outputDir
    const quickBuildPreviewPath = path.resolve(
      __dirname,
      '../../../../../../vd.leju.com/branches/application/views/template'
    )
    fsExtra.copySync(
      `${kdOutputDir}/index.html`,
      `${quickBuildPath}/index.html`
    )
    fsExtra.copySync(
      `${pcOutputDir}/index.html`,
      `${quickBuildPreviewPath}/index.html`
    )
    console.log('KD HTML path: ', `${quickBuildPath}/index.html`)
    console.log('PC HTML path: ', `${quickBuildPreviewPath}/index.html`)
    console.log('HTML 文件移动成功')
  } catch {
    console.log('HTML 文件移动失败，请手动移动')
  }
}
// 提交 svn
async function commitSvn() {
  // 终端交互
  const inquirer = require('inquirer')
  // 粉笔
  const chalk = require('chalk')
  // res 打包路径
  const outputDir = /(.*)\/.*?$/.exec(require('./kd.config').outputDir)[1]
  // 快搭 html 打包路径
  const quickBuildPath = path.resolve(
    __dirname,
    '../../../../../../vd.leju.com/branches/application/views/vd_page'
  )
  // 预览 html 打包路径
  const quickBuildPreviewPath = path.resolve(
    __dirname,
    '../../../../../../vd.leju.com/branches/application/views/template'
  )
  const resStatus = await new Promise(r => {
    let res = ''
    createShell(`svn status`, {
      stdio: 'pipe',
      cwd: outputDir
    })
      .on('exit', () => r(res))
      .stdout.on('data', str => (res += str))
  })
  resStatus && console.log(chalk.green('res SVN 改动信息 \n', resStatus))
  const qbStatus = await new Promise(r => {
    let res = ''
    createShell(`svn status`, {
      stdio: 'pipe',
      cwd: quickBuildPath
    })
      .on('exit', r)
      .stdout.on('data', str => (res += str))
  })
  qbStatus && console.log(chalk.green('快搭 HTML SVN 改动信息 \n'), qbStatus)
  const qbPreviewStatus = await new Promise(r => {
    let res = ''
    createShell(`svn status`, {
      stdio: 'pipe',
      cwd: quickBuildPreviewPath
    })
      .on('exit', r)
      .stdout.on('data', str => (res += str))
  })
  qbPreviewStatus &&
    console.log(chalk.green('落地页 HTML SVN 改动信息 \n'), qbPreviewStatus)
  if (!resStatus && !qbStatus && !qbPreviewStatus) return Promise.reject()
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: chalk.green('是否提交 SVN 代码')
    }
  ])
  if (!confirm) return Promise.reject()
  const { msg } = await inquirer.prompt([
    {
      type: 'input',
      name: 'msg',
      message: chalk.green('请输入提交信息'),
      validate: name => {
        if (!name.trim()) {
          return chalk.red('提交信息不能为空, 请重新输入')
        }
        return true
      }
    }
  ])
  if (resStatus) {
    console.log(chalk.green('res SVN 提交中...'))
    await new Promise(r => {
      createShell(
        `svn add . --force
        svn commit -m '${msg || '脚本自动提交'}'`,
        {
          cwd: outputDir
        }
      ).on('exit', r)
    })
  }
  if (qbStatus) {
    console.log(chalk.green('快搭 HTML SVN 提交中...'))
    await new Promise(r => {
      createShell(
        `svn add . --force
        svn commit -m '${msg || '脚本自动提交'}'`,
        {
          cwd: quickBuildPath
        }
      ).on('exit', r)
    })
  }
  if (qbPreviewStatus) {
    console.log(chalk.green('落地页 HTML SVN 提交中...'))
    await new Promise(r => {
      createShell(
        `svn add . --force
        svn commit -m '${msg || '脚本自动提交'}'`,
        {
          cwd: quickBuildPreviewPath
        }
      ).on('exit', r)
    })
  }
  console.log(chalk.green('SVN 提交完成'))
}

Promise.all([runBuildKD(), runBuildPC()])
  .then(moveHtml)
  .then(commitSvn)

function createShell(command, options = {}) {
  return spawn(command, {
    stdio: 'inherit',
    shell: true,
    ...options
  })
}
