function sh(command, options = {}) {
  const { spawn } = require('child_process')
  options = {
    stdio: 'inherit',
    shell: true,
    ...options
  }
  return new Promise((resolve, reject) => {
    let data = ''
    const shell = spawn(command, options)
    shell.on('exit', code => {
      code === 0 ? resolve(data) : reject()
    })
    if (options.stdio === 'pipe') {
      shell.stdout.on('data', s => (data += s))
    }
  })
}

async function commitGit(isBCH) {
  const inquirer = require('inquirer')
  const chalk = require('chalk')
  console.log(chalk.green('Git 分支检查'))
  const branchs = await sh(`git branch`, {
    stdio: 'pipe'
  })
  const curBranch = /\*\s(\w+)/gi.exec(branchs)[1]
  if (isBCH && curBranch !== 'bch') {
    console.log(chalk.green('请在bch分支后进行build操作'))
    return process.exit(1)
  }
  if (!isBCH && curBranch !== 'master') {
    console.log(chalk.green('请在master分支后进行build操作'))
    return process.exit(1)
  }
  console.log(chalk.green('Git 改动信息'))
  await sh(
    `git checkout ${isBCH ? 'develop' : 'master'}
      git status`,
    {
      cwd: adjsGitPath
    }
  )
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: chalk.green('是否提交 Git 代码')
    }
  ])
  if (!confirm) return process.exit(0)
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
  console.log(chalk.green('Git 提交中...'))
  await sh(
    `git pull --rebase
    git add .
    git commit -m '${msg || '脚本自动提交'}'
    git push`,
    {
      cwd: adjsGitPath
    }
  )
  console.log(chalk.green('Git 提交完成'))
}

function getTargetGitPath() {
  const cwd = process.cwd()
  return cwd.slice(0, cwd.indexOf('web/')) + 'web/adjs.leju.com'
}

const adjsGitPath = getTargetGitPath()

function runBuild(builds, isBCH) {
  sh(`git checkout ${isBCH ? 'develop' : 'master'}`, {
    cwd: adjsGitPath
  }).then(() => {
    Promise.all(builds).then(() => commitGit(isBCH))
  })
}

module.exports = {
  sh,
  runBuild
}
