<template>
  <div class="EditPage-wrapper">
    <Draggable
      :group="{ name: 'editor', pull: true, put: false }"
      class="editor-wrap"
    >
      <!-- <div class="comp-wrap" v-for="el in testList" :key="el.id">
        <component :is="pathToComp[el.path]" v-bind="el.props"></component>
      </div>-->
      <div
        v-show="chooseing"
        class="drop-section"
        @drop="onDropEvent('drop', $event)"
        @dragenter="onDropEvent('dragenter', $event)"
        @dragleave="onDropEvent('dragleave', $event)"
      ></div>
    </Draggable>
    <Draggable
      :group="{ name: 'select', pull: 'clone', put: false }"
      @start="onSelectDragEvent('start', ...arguments)"
      @end="onSelectDragEvent('end', ...arguments)"
      @choose="onSelectDragEvent('choose', ...arguments)"
      @unchoose="onSelectDragEvent('unchoose', ...arguments)"
      class="select-component-wrap"
    >
      <div class="comp-wrap" v-for="el in componentList" :key="el.id">
        <el-button>{{ el.zhName }}</el-button>
      </div>
    </Draggable>
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
import Draggable from 'vuedraggable'
import { getComponents, pathToComp } from '../../utils/getComponents'
/**
 *   @desc 编辑区
 *   @params page 当前编辑的页面，Page实例
 */
export default {
  name: 'EditPage',
  components: {
    Draggable
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
      chooseing: false
    }
  },
  created() {
    this.pathToComp = pathToComp
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
    onDropEvent(type, e) {
      const handleEvent = {
        drop: e => {
          console.log('e :>> ', e)
        },
        dragenter: e => {
          e.target.classList.add('enter')
        },
        dragleave: e => {
          e.target.classList.remove('enter')
        }
      }
      handleEvent[type](e)
    },
    onSelectDragEvent(type, evt) {
      const handleEvent = {
        choose: () => {
          this.chooseing = true
        },
        unchoose: () => {
          this.chooseing = false
        },
        start: e => {
          debugger
        },
        end: e => {
          console.log('end :>> ', e)
        }
      }
      handleEvent[type](evt)
    }
  }
}
</script>

<style lang="scss" scoped>
.EditPage-wrapper {
  height: 100%;
  position: relative;
  .select-component-wrap {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 16px;
    border: 3px dashed #409eff;
    border-radius: 8px;
    display: flex;
    padding: 16px;
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
}
</style>
