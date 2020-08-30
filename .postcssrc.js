const { replaceColorToVar } = require('./build/custom-theme-plugin')

module.exports = {
  plugins: [require('autoprefixer')(), replaceColorToVar]
}
