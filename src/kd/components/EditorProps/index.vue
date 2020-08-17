<template>
  <div class="editor-component-wrapper">
    <el-collapse value="0">
      <el-collapse-item
        v-for="(section, si) in element.getEditorProps()"
        :key="element.id + si"
        :title="section.title"
        :name="`${si}`"
      >
        <EditPropForm :element="element" :list="section.props"></EditPropForm>
      </el-collapse-item>
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
