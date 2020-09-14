<!--
 * @Author: zijian6@leju.com
 * @Date: 2020-05-09 17:56:41
 * @LastEditors: zijian6@leju.com
 * @LastEditTime: 2020-08-12 10:05:41
 * @FilePath: /res.leju.com/dev/mvvm-project/vue/clues-mid/src/components/AjaxLoading/AjaxLoadingGroup.vue
-->
<script>
export default {
  props: {
    tag: {
      type: [String, Object, Function],
      default: 'div'
    },
    getData: {
      type: [Function, Object],
      default: null
    },
    flex: {
      type: Boolean,
      default: true
    }
  },
  provide() {
    return {
      ajaxLoadingGroup: this
    }
  },
  render(c) {
    return c(
      this.tag,
      {
        class: this.flex ? 'flex' : ''
      },
      this.$slots.default
    )
  }
}
</script>
