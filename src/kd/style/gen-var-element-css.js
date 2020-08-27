// /* eslint-disable @typescript-eslint/no-var-requires */
// // 生成 ElementUI CSS变量形式的 CSS文件
// const fs = require('fs')
// const path = require('path')
// const cssPath = path.resolve(
//   __dirname,
//   '../../../node_modules/element-ui/lib/theme-chalk/index.css'
// )

// function getReplaceMap() {
//   const cssVars = fs.readFileSync(
//     path.resolve(__dirname, './css-variables.css'),
//     'utf-8'
//   )
//   const replaceMap = {}
//   const varReg = /(--[A-Za-z0-9_-]+):\s*(#\w+);/gim
//   let item = varReg.exec(cssVars)
//   while (item) {
//     const [_, vars, color] = item
//     replaceMap[color] = vars
//     item = varReg.exec(cssVars)
//   }
//   return replaceMap
// }
// function genVarFile(replaceMap) {
//   let styleText = fs.readFileSync(cssPath, 'utf-8')
//   replaceMap['fonts/'] = '~element-ui/lib/theme-chalk/fonts/'
//   const regs = Object.keys(replaceMap).map(
//     color => (color === 'fonts/' ? 'fonts/' : `\(?:\)\(\\w\+\):${color}\[;}\]`) // `\[{;\]\(\\w\+\):${color}\[;}\]`
//   )
//   styleText = styleText.replace(new RegExp(regs.join('|'), 'igm'), function(
//     match,
//     $1
//   ) {
//     debugger
//     return match === 'fonts/' ? replaceMap[match] : `var(${replaceMap[match]})`
//   })
//   debugger
// }

// genVarFile(getReplaceMap())
// js 实现sass mix 函数
const mix = (color1, color2, tint) => {
  const compose = (...fns) => args =>
    fns.reduceRight((args, fn) => fn(args), args)

  const toRGB = colors =>
    colors.map(color => [
      parseInt(color.slice(1, 3), 16),
      parseInt(color.slice(3, 5), 16),
      parseInt(color.slice(5, 7), 16)
    ])

  const _mix = ([[r1, g1, b1], [r2, g2, b2]]) => [
    r2 + Math.round(tint * (r1 - r2)),
    g2 + Math.round(tint * (g1 - g2)),
    b2 + Math.round(tint * (b1 - b2))
  ]

  const toHEX = rgb => `#${rgb.map(s => s.toString(16)).join('')}`

  return compose(toHEX, _mix, toRGB)([color1, color2])
}
// --color-primary: #409EFF;
// --color-primary-light-9: #ecf5ff;
// color: #3e99f7; 000000 0.97

mix('#409EFF', '#000000', 0.97)
mix('#ffffff', '#409EFF', 0.9)
