const config = {
  kd: require('./build/kd.config'),
  pc: require('./build/pc.config')
}
module.exports = config[process.env.BUILD_PLATFORM]
