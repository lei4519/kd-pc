<template>
  <el-color-picker
    v-model="theme"
    :predefine="[
      '#409EFF',
      '#1890ff',
      '#304156',
      '#212121',
      '#11a983',
      '#13c2c2',
      '#6959CD',
      '#f5222d'
    ]"
    class="theme-picker"
    popper-class="theme-picker-dropdown"
  />
</template>

<script>
// 通过postcss 替换成 css变量，组件运行期间进行主题色修改。
const PRIMARY = '#409EFF'
export default {
  data() {
    return {
      // 主题色
      theme: PRIMARY
    }
  },
  watch: {
    theme(val) {
      const oldVal = this.theme ? this.theme : PRIMARY
      if (typeof val !== 'string') return
      const themeCluster = this.getThemeCluster(val.replace('#', ''))
      const originalCluster = this.getThemeCluster(oldVal.replace('#', ''))
      this.updateStyle('', originalCluster, themeCluster)
      this.$emit('change', val)
    }
  },

  methods: {
    updateStyle(style, oldCluster, newCluster) {
      let newStyle = style
      oldCluster.forEach((color, index) => {
        newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index])
      })
      return newStyle
    },
    mix(color1, color2, tint) {
      // js 实现sass mix 函数
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
    },
    getThemeCluster(theme) {
      // 十种主色调计算 根据主色调 进行 10% - 90% 混合生成
      const tintColor = (color, tint) => {
        let red = parseInt(color.slice(0, 2), 16)
        let green = parseInt(color.slice(2, 4), 16)
        let blue = parseInt(color.slice(4, 6), 16)

        if (tint === 0) {
          // 主色调 rgb 形式
          return [red, green, blue].join(',')
        } else {
          red += Math.round(tint * (255 - red))
          green += Math.round(tint * (255 - green))
          blue += Math.round(tint * (255 - blue))

          red = red.toString(16)
          green = green.toString(16)
          blue = blue.toString(16)

          return `#${red}${green}${blue}`
        }
      }
      // 按钮 active 颜色计算
      const shadeColor = (color, shade) => {
        let red = parseInt(color.slice(0, 2), 16)
        let green = parseInt(color.slice(2, 4), 16)
        let blue = parseInt(color.slice(4, 6), 16)

        red = Math.round((1 - shade) * red)
        green = Math.round((1 - shade) * green)
        blue = Math.round((1 - shade) * blue)

        red = red.toString(16)
        green = green.toString(16)
        blue = blue.toString(16)

        return `#${red}${green}${blue}`
      }

      const clusters = [theme]
      for (let i = 0; i <= 9; i++) {
        clusters.push(tintColor(theme, Number((i / 10).toFixed(2))))
      }
      clusters.push(shadeColor(theme, 0.1))
      return clusters
    }
  }
}
</script>
