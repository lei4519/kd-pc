<style lang="scss">
.radios {
  border-radius: 50%;
}
</style>
<template>
  <div>
    <label for>{{ textContent }}</label>
  </div>
</template>
<script>
export default {
  name: 'TextComponent',
  zhName: '文本',
  iconClass: 'wenzi',
  needParentStyle: false,
  minSpan: 24,
  maxSpan: 24,
  // needParentStyle: false,
  commonSetting: {
    font: true
  },
  props: {
    textContent: {
      type: String,
      default: '编辑文字'
    }
  },
  editorProps() {
    return [
      {
        title: '文字设置',
        props: [
          {
            label: '内容',
            prop: 'textContent',
            type: 'input'
          }
        ]
      }
      // {
      //     title:'字体设置',
      //     props:[
      //         {
      //             label:'字体颜色',
      //             prop:`fontset.color`,
      //             type:'colorPicker'
      //         }
      //     ]
      // }
    ]
  }
}
</script>
