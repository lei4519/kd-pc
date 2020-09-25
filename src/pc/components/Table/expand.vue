<!--
 * @Description:自定义render函数调用
 * @Author: jinlei1@leju.com
 * @Date: 2020-01-13 15:25:14
 * @LastEditTime : 2020-01-14 10:42:51
 * @LastEditors  : jinlei1@leju.com
 * @FilePath: /vue-template/src/components/Table/expand.vue
 -->
<script>
export default {
  name: 'Expand',
  functional: true,
  props: {
    render: {
      type: Function,
      default() {
        return function() {
          //
        }
      }
    },
    props: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  render(c, ctx) {
    return ctx.props.render(c, ctx.props.props)
  }
}
</script>
