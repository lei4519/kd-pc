<template>
  <Interact
    :edges="[asideLayout === 'left' ? 'right' : 'left']"
    :w="300"
    :maxWidth="500"
    :minWidth="200"
    v-if="page"
  >
    <el-aside>
      <div class="handle handle-mr"></div>
      <el-tabs :value="activeTab" stretch @tab-click="tabClick">
        <el-tab-pane name="select">
          <span slot="label"><i class="el-icon-menu"></i> 组件选择</span>
          <el-alert
            class="mt-16 ml-8 mr-8 w-auto"
            title="点击或拖拽添加组件"
            type="info"
            show-icon
            :closable="false"
          />
          <div class="select-component-wrapper">
            <div
              class="component-item"
              v-for="component in componentList"
              :key="component.id"
              @click="addComponent(component)"
              draggable
              @dragstart="onDragEvent('start', component, $event)"
              @dragend="onDragEvent('end', component, $event)"
            >
              <IconFont :type="component.iconClass" size="32" />
              <div class="component-name">{{ component.zhName }}</div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane name="setting" v-show="false">
          <span slot="label"><i class="el-icon-s-tools"></i> 组件设置</span>
          <EditorProps
            v-if="page.editingElement"
            :element="page.editingElement"
          />
          <el-alert
            v-else
            class="mt-32 ml-8 mr-8 w-auto"
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
import { getComponents } from '../../utils/getComponents'

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
    dragingComponent: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      componentList: [] // 组件列表
    }
  },
  created() {
    // 拍平找组件
    this.normalList()
  },
  methods: {
    normalList() {
      const comps = getComponents()
      const res = []
      while (comps.length) {
        const item = comps.shift()
        if (item.type === 'element') {
          res.push(item)
        }
        if (item.children) {
          comps.unshift(...item.children)
        }
      }
      this.componentList = res
    },
    onDragEvent(type, c) {
      if (!this.dragHandler) {
        this.dragHandler = {
          start: c => {
            this.$emit('update:dragingComponent', c)
          },
          end: () => {
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
