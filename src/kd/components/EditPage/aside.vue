<template>
  <Interact
    :edges="[asideLayout === 'left' ? 'right' : 'left']"
    :w="editPageAsideWidth"
    :maxWidth="600"
    :minWidth="200"
    @resizeEnd="onResizeEnd"
    v-if="page"
  >
    <el-aside>
      <div class="handle handle-mr"></div>
      <el-tabs :value="activeTab" stretch @tab-click="tabClick">
        <el-tab-pane name="select" key="select">
          <span slot="label"><i class="el-icon-menu"></i> 组件选择</span>
          <el-alert
            class="mt-16 ml-8 mr-8 w-auto"
            title="点击或拖拽添加组件"
            type="info"
            show-icon
            :closable="false"
          />
          <div class="select-component-wrapper">
            <el-tooltip
              v-for="component in componentList"
              :key="component.id"
              class="item"
              effect="dark"
              :content="
                `当前页面只允许放置 ${pathToComp[component.path].dragConfig &&
                  pathToComp[component.path].dragConfig.max} 个${
                  component.zhName
                }`
              "
              :disabled="component.draggable"
              placement="top"
            >
              <div
                class="component-item"
                :class="{ draggable: component.draggable }"
                @click="addComponent(component)"
                :draggable="component.draggable"
                @dragstart="onDragEvent('start', component, $event)"
                @dragend="onDragEvent('end', component, $event)"
              >
                <IconFont :type="component.iconClass" size="32" />
                <div class="component-name">{{ component.zhName }}</div>
              </div>
            </el-tooltip>
          </div>
        </el-tab-pane>
        <el-tab-pane name="setting" key="setting">
          <span slot="label"><i class="el-icon-s-tools"></i> 组件设置</span>
          <EditorProps
            v-if="page.editingElement"
            :element="page.editingElement"
          />
          <el-alert
            v-else
            class="mt-16 ml-8 mr-8 w-auto"
            title="请先选择组件"
            type="info"
            show-icon
            :closable="false"
          />
        </el-tab-pane>
      </el-tabs>
    </el-aside>
  </Interact>
</template>

<script>
import Interact from '../utils/Interact.vue'
import EditorProps from '../EditorProps/index'

export default {
  name: 'EditPageAside',
  components: {
    Interact,
    EditorProps
  },
  props: {
    asideLayout: {
      type: String,
      default: ''
    },
    activeTab: {
      type: String,
      default: ''
    },
    page: {
      type: Object,
      default() {
        return null
      }
    },
    componentList: {
      type: Array,
      default() {
        return []
      }
    },
    pathToComp: {
      type: Object,
      default() {
        return null
      }
    },
    dragingComponent: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      editPageAsideWidth: localStorage.getItem('editPageAsideWidth') || 300
    }
  },
  methods: {
    onResizeEnd({ width }) {
      localStorage.setItem('editPageAsideWidth', `${width | 0}px`)
    },
    onDragEvent(type, c) {
      if (!this.dragHandler) {
        this.dragHandler = {
          start: c => {
            this.page.addDropPlaceholder(c)
            this.$emit('update:dragingComponent', c)
          },
          end: () => {
            this.page.removeDropPlaceholder()
            this.$emit('update:dragingComponent', null)
          }
        }
      }
      this.dragHandler[type](c)
    },
    tabClick(tab) {
      this.$emit('update:activeTab', tab.name)
    },
    addComponent(c) {
      this.$emit('addComponent', c)
    }
  }
}
</script>
