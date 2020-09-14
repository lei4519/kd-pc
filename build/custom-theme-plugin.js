const { var2color } = require('../src/kd/modules/ColorVarMap')
// 颜色 -> css 变量 postcss 插件替换时使用
const color2var = Object.entries(var2color).reduce(
  (obj, [$var, { color }]) => ((obj[color.toLowerCase()] = $var), obj),
  {}
)

/**
 * @description 将主题色替换成css变量，以供js后续修改
 */
function replaceColorToVar(css) {
  // 遍历所有的选择器
  css.walkRules(rule => {
    // 遍历所有的css语句：color: #FFF;
    rule.walkDecls(decl => {
      const _var = color2var[decl.value.toLowerCase()]
      if (_var) {
        // 保留旧属性兼容ie
        decl.cloneAfter({ prop: decl.prop, value: `var(${_var})` })
      }
    })
  })
}
module.exports = {
  var2color,
  replaceColorToVar
}
