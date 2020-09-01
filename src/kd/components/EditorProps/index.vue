<template>
  <div class="editor-component-wrapper">
    <el-collapse :value="sectionIdx" ref="collapse">
      <el-collapse-item title="页面设置" name="page-setting">
        <el-form>
          <el-form-item v-if="element">
            <span slot="label">
              下间距
              <template>
                <el-tooltip
                  effect="dark"
                  content="当前元素所在行的下间距"
                  placement="top"
                >
                  <i class="el-icon-info"></i>
                </el-tooltip>
              </template>
            </span>
            <el-input-number
              v-model="element.parent.style.marginBottom"
              controls-position="right"
            />
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <template v-if="element && element.renderComponent">
        <el-collapse-item
          v-for="(section, si) in element.getEditorProps()"
          :key="element.id + si"
          :title="section.title"
          :name="`${si}`"
        >
          <EditPropForm :element="element" :list="section.props"></EditPropForm>
        </el-collapse-item>
      </template>
      <el-alert
        v-else
        class="mt-16 ml-8 mr-8 w-auto"
        title="请先选择组件"
        type="info"
        show-icon
        :closable="false"
      />
    </el-collapse>
  </div>
</template>

<script>
import EditPropForm from './components/EditPropForm'

export default {
  name: 'EditorProps',
  components: {
    EditPropForm
  },
  props: {
    element: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      sectionIdx: '0'
    }
  },
  watch: {
    'element.immediateValidate'(v) {
      if (v) {
        this.sectionIdx = `${v.sectionIdx}`
        if (this.$refs.collapse) {
          this.$refs.collapse.activeNames = [this.sectionIdx]
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-component-wrapper {
  height: 100%;
  .el-tabs {
    height: 100%;
  }
  .sort-layer {
    padding: 16px 0;
    border-bottom: 1px solid #000;
  }
}
</style>
