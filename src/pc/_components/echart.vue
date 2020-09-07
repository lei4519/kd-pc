<template>
  <div class="echart"></div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'EchartComponent',
  props: {
    option: {
      type: Object,
      default: () => {
        return {}
      }
    },
    chartType: {
      type: String,
      default: ''
    },
    windowWidth: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      chartInstance: null,
      color: [
        '#488bff',
        '#25ceba',
        '#ffc069',
        '#fd6765',
        '#6c7ee4',
        '#ff9c6e',
        '#81c784',
        '#b47fec',
      ]
    }
  },
  watch: {
    option(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.option && this.setOption()
      }
    }
  },
  mounted() {
    this.chartInstance = echarts.init(this.$el)
    this.option && this.setOption()
  },
  methods: {
    setOption() {
      this.chartInstance.clear()
      this.chartInstance.resize()
      this.chartInstance.setOption(
        Object.assign(this.option, { color: this.color })
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.echart {
  height: 100%;
}
</style>
