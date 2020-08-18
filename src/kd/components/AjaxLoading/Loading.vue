<template>
  <div class="loading-wrapper">
    <div
      :class="`loading-item sk-${mode}`"
      :style="{
        '--sk-size': size,
        '--sk-color': color
      }"
    >
      <div
        :class="`sk-${mode}-${classMap[mode].childClass}`"
        v-for="i in classMap[mode].childNum"
        :key="i"
      ></div>
    </div>
  </div>
</template>

<script>
import 'spinkit/spinkit.min.css'
/**
 * @description loading 效果
 * https://tobiasahlin.com/spinkit/
 */
export default {
  name: 'Loading',
  props: {
    mode: {
      type: String,
      default: 'wave'
    },
    size: {
      type: String,
      default: '60px'
    },
    color: {
      type: String,
      // FIXME CSS
      default: '#409eff'
    }
  },
  data() {
    return {
      classMap: {
        chase: {
          childClass: 'dot',
          childNum: 6
        },
        bounce: {
          childClass: 'dot',
          childNum: 2
        },
        wave: {
          childClass: 'rect',
          childNum: 5
        },
        pulse: {
          childClass: 'dot',
          childNum: 0
        },
        flow: {
          childClass: 'dot',
          childNum: 3
        },
        swing: {
          childClass: 'dot',
          childNum: 2
        },
        circle: {
          childClass: 'dot',
          childNum: 12
        },
        'circle-fade': {
          childClass: 'dot',
          childNum: 12
        },
        grid: {
          childClass: 'cube',
          childNum: 9
        },
        fold: {
          childClass: 'cube',
          childNum: 4
        },
        wander: {
          childClass: 'cube',
          childNum: 3
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.loading-wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  background-color: hsla(0, 0%, 100%, 0.9);
}
</style>
