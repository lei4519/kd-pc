// eslint-disable-next-line @typescript-eslint/no-var-requires
const { var2color } = require('./ColorVarMap') as {
  var2color: {
    [key: string]: {
      color: string
      mix: (color: string) => [string, string, number]
    }
  }
}

export class Theme {
  themeColor: string
  constructor(color: string) {
    this.themeColor = color
    this.updateTheme()
  }
  updateTheme() {
    document.documentElement.style.cssText = Object.entries(var2color).reduce(
      (cssText, [_var, { mix }]) => {
        return cssText + `${_var}: ${this.mix(mix(this.themeColor))};`
      },
      ''
    )
  }
  // 使用JS 实现SASS mix 函数
  mix([color1, color2, tint]: [string, string, number]) {
    const compose = (...fns: Function[]) => (args: any) =>
      fns.reduceRight((args, fn) => fn(args), args)

    const toRGB = (colors: string[]) =>
      colors.map(color => [
        parseInt(color.slice(1, 3), 16),
        parseInt(color.slice(3, 5), 16),
        parseInt(color.slice(5, 7), 16)
      ])

    const _mix = ([[r1, g1, b1], [r2, g2, b2]]: Array<number[]>) => [
      r2 + Math.round((r1 - r2) * tint),
      g2 + Math.round((g1 - g2) * tint),
      b2 + Math.round((b1 - b2) * tint)
    ]

    const toHEX = (rgb: number[]) => `#${rgb.map(s => s.toString(16)).join('')}`

    return compose(toHEX, _mix, toRGB)([color1, color2])
  }
}
