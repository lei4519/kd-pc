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
        return null
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
    chartType(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.setOption()
      }
    },
    'asideLayout.width': function(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.setOption()
      }
    },
    windowWidth(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.setOption()
      }
    }
  },
  inject: ['asideLayout'],
  mounted() {
    this.chartInstance = echarts.init(this.$el)
    this.setOption()
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
  height: 100%;
}
</style>
