const { spawn } = require('child_process')

module.exports = function createShell(command, stdio = 'inherit') {
  return spawn(command, {
    stdio,
    shell: true
  })
}
