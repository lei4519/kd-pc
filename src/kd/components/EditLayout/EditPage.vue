<template>
  <div class="EditPage-wrapper">
    <div
      v-show="dragingComponent"
      class="drop-section"
      @drop="onDropEvent('drop', $event)"
      @dragover="onDropEvent('dragover', $event)"
      @dragenter="onDropEvent('dragenter', $event)"
      @dragleave="onDropEvent('dragleave', $event)"
    ></div>
    <transition-group
      tag="div"
      class="components-wrapper"
      enter-active-class="animate__animated animate__fadeInUp"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <el-row v-for="row in page.rows" :key="row.id">
        <el-col
          tag="transition-group"
          :span="8"
          v-for="el in row.elements"
          :key="el.id + 't'"
          enter-active-class="animate__animated animate__fadeInUp"
          leave-active-class="animate__animated animate__fadeOutUp"
        >
          <CatchEvents :key="el.id">
            <component :is="pathToComp[el.path]" v-bind="el.props" />
          </CatchEvents>
        </el-col>
      </el-row>
    </transition-group>
    <div class="select-component-wrapper">
      <div
        class="component-item"
        v-for="component in componentList"
        :key="component.id"
        draggable
        @dragstart="onDragEvent('start', component, $event)"
        @dragend="onDragEvent('end', component, $event)"
      >
        <IconFont :type="component.iconClass" size="32" />
        <div class="component-name">{{ component.zhName }}</div>
      </div>
    </div>
    <!-- <el-drawer
      :wrapperClosable="false"
      :withHeader="false"
      :visible.sync="drawerVisible"
      :modal="false"
      direction="btt"
    >
    </el-drawer>-->
    <!-- <el-drawer
      :withHeader="false"
      :visible.sync="drawerVisible"
      :modal="false"
      direction="btt"
    >
      <div class="select-wrapper">
        <div class="comp-wrap" v-for="item in componentList" :key="item.id">
          <el-button @click="selectComp(item)">{{ item.zhName }}</el-button>
        </div>
      </div>
    </el-drawer>-->
  </div>
</template>

<script>
import { getComponents, pathToComp } from '../../utils/getComponents'
import { CatchEvents } from '../utils/CatchEvents'
/**
 *   @desc 编辑区
 *   @params page 当前编辑的页面，Page实例
 */
export default {
  name: 'EditPage',
  components: {
    CatchEvents
  },
  props: {
    page: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      drawerVisible: true,
      componentList: [],
      dragingComponent: false
    }
  },
  created() {
    this.pathToComp = pathToComp
    // 拍平找组件
    this.normalList()
  },
  mounted() {
    document
      .querySelector('.el-aside')
      .appendChild(document.querySelector('.select-component-wrapper'))
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
    onDragEvent(type, c, e) {
      console.log('type :>> ', type)
      ;({
        start: () => {
          this.dragingComponent = c
        },
        end: () => {
          this.dragingComponent = null
        }
      }[type]())
    },
    onDropEvent(type, e) {
      console.log('type :>> ', type)
      ;({
        drop: () => {
          e.preventDefault()
          e.target.classList.remove('enter')
          if (!this.page.rows.length) {
            this.page.addRows({
              elements: [this.dragingComponent]
            })
          } else {
            this.page.rows[0].elements.push(this.dragingComponent)
          }
        },
        dragover: () => {
          e.preventDefault()
          e.dataTransfer.dropEffect = 'copy'
        },
        dragenter: () => {
          e.target.classList.add('enter')
        },
        dragleave: () => {
          e.target.classList.remove('enter')
        }
      }[type]())
    }
  }
}
</script>

<style lang="scss" scoped>
.EditPage-wrapper {
  height: 100%;
  position: relative;
}
.select-component-wrapper {
  border-radius: 8px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 16px;
  padding: 8px;
  border: 3px dashed #409eff;
  user-select: none;
  .component-item {
    margin: 8px;
    font-size: 12px;
    text-align: center;
    color: #fff;
    cursor: grab;
    &:active {
      cursor: grabbing;
    }
    .component-name {
      margin-top: 4px;
    }
  }
}
.drop-section {
  width: 100%;
  height: 50px;
  border: 2px dashed rgb(39, 209, 152);
  border-radius: 12px;
  transition: all 0.3s;
  &.enter {
    background-color: rgba(39, 209, 152, 0.5);
  }
}
</style>
