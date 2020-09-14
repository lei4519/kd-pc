const config = {
  kd: require('./build/kd.config'),
  pc: require('./build/pc.config'),
  sc: require('./build/singlecomponents.config')
}
module.exports = config[process.env.BUILD_PLATFORM]
