<template>
  <div class="editor-component-wrapper">
    <el-collapse value="page-setting">
      <el-collapse-item title="页面设置" name="page-setting">
        <el-form>
          <el-form-item label="主题色设置">
            <el-color-picker
              v-model="project.themeColor"
              @change="updateColor"
            ></el-color-picker>
          </el-form-item>
          <el-form-item label="行间距设置" v-if="element">
            <el-input-number v-model="element.parent.style.marginBottom" />
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
    project: {
      type: Object,
      default() {
        return {}
      }
    },
    element: {
      type: Object,
      default() {
        return null
      }
    }
  },
  methods: {
    updateColor() {
      this.project.updateTheme()
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
