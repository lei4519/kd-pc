<template>
  <div class="operation-list" :style="`${layout}: 8px`">
    <el-tooltip
      v-if="showDel"
      @click.native.stop="edit('del')"
      class="operation"
      effect="dark"
      placement="right"
      popper-class="operation-popper"
    >
      <i class="el-icon-delete"></i>
      <div slot="content" class="content">
        删除
        <IconFont
          style="margin-left: 0.12rem; line-height: 1"
          type="delete"
          size="22"
          v-if="showShortcut"
        />
      </div>
    </el-tooltip>
    <el-tooltip
      v-if="showCopy"
      @click.native.stop="edit('copy')"
      class="operation"
      effect="dark"
      content="复制"
      placement="right"
    >
      <i class="el-icon-copy-document"></i>
    </el-tooltip>
    <el-tooltip
      @click.native.stop="edit('setting')"
      class="operation"
      effect="dark"
      content="设置"
      placement="right"
    >
      <i class="el-icon-setting"></i>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'OperateList',
  props: {
    layout: {
      type: String,
      default: 'right'
    },
    showDel: {
      type: Boolean,
      default: true
    },
    showCopy: {
      type: Boolean,
      default: true
    },
    showShortcut: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    edit(type, payload) {
      this.$emit('click', { type, payload })
    }
  }
}
</script>

<style lang="scss" scoped>
.operation-list {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 8px;
  z-index: 9999;
  transition: all 0.3s;
  cursor: pointer;
  .operation {
    $size: 28px;
    width: $size;
    height: $size;
    text-align: center;
    line-height: $size;
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    font-size: 16px;
    color: #fff;
    margin-bottom: 8px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.8);
    }
  }
}
</style>
<style>
.operation-popper .content {
  display: flex;
  align-items: center;
}
</style>
