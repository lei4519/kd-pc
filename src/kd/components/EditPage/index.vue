<template>
  <el-dialog
    :visible="visible"
    fullscreen
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    destroy-on-close
    append-to-body
    custom-class="editpage-fc-dialog"
  >
    <el-container>
      <EditPageAside
        v-if="asideLayout === 'left'"
        :asideLayout="asideLayout"
        :componentList="componentList"
        :pathToComp="pathToComp"
        :page="page"
        :activeTab.sync="activeTab"
        :dragingComponent.sync="dragingComponent"
        @addComponent="addComponent"
      />
      <el-container>
        <el-header height="40px">
          <el-tooltip class="operation" effect="dark" placement="bottom">
            <div
              :class="`toggle-layout ${asideLayout}`"
              @click="handleOperate('toggleLayout')"
            >
              <IconFont type="zuoyoubuju" size="26" />
            </div>
            <div slot="content">切换布局</div>
          </el-tooltip>
          <div class="operate-wrap">
            <el-tooltip class="operation" effect="dark" placement="bottom">
              <div
                class="operate-item"
                :class="{ disabled: undoRedoHistory.currentIndex <= 0 }"
                @click="handleOperate('undo')"
              >
                <IconFont type="undo" />
              </div>
              <div slot="content">
                撤销
                <IconFont class="ml-4" type="command" size="12" />
                + Z
              </div>
            </el-tooltip>
            <el-tooltip class="operation" effect="dark" placement="bottom">
              <div
                class="operate-item"
                :class="{
                  disabled:
                    undoRedoHistory.history.length <=
                    undoRedoHistory.currentIndex + 1
                }"
                @click="handleOperate('redo')"
              >
                <IconFont type="redo" />
              </div>
              <div slot="content">
                重做
                <IconFont class="ml-4" type="command" size="12" />
                + Shift + Z
              </div>
            </el-tooltip>
            <el-tooltip class="operation" effect="dark" placement="bottom">
              <div class="operate-item" @click="handleOperate('preview')">
                <IconFont type="eye" />
              </div>
              <div slot="content">
                预览
                <IconFont class="ml-4" type="command" size="12" />
                + P
              </div>
            </el-tooltip>
            <el-tooltip class="operation" effect="dark" placement="bottom">
              <div class="operate-item" @click="handleOperate('save')">
                <IconFont type="save" />
              </div>
              <div slot="content">
                保存
                <IconFont class="ml-4" type="command" size="12" />
                + S
              </div>
            </el-tooltip>
            <el-tooltip class="operation" effect="dark" placement="bottom">
              <div class="operate-item" @click="handleOperate('exit')">
                <IconFont type="tuichu" />
              </div>
              <div slot="content">退出</div>
            </el-tooltip>
          </div>
        </el-header>
        <el-main>
          <div class="EditPage-wrapper">
            <transition-group tag="div" name="fade" class="components-wrapper">
              <div
                class="transition"
                v-for="(row, rowIndex) in page.rows"
                :key="row.id"
              >
                <Interact
                  class="row-vdr"
                  :edges="['bottom']"
                  :h="row.getStyle().height || 'auto'"
                  @resizeEnd="onResizeEnd(row, ...arguments)"
                >
                  <transition-group
                    tag="div"
                    name="fade"
                    class="clearfix layout-row"
                    :style="row.getStyle()"
                  >
                    <div
                      class="layout-col transition"
                      :style="el.getStyle()"
                      v-for="(el, colIndex) in row.elements"
                      :key="el.id"
                      @click="handleComponentOperate('setting', row, el)"
                    >
                      <CatchEvents
                        draggable
                        @dragstart="onSwapEvent('dragstart', $event)"
                        @dragend="onSwapEvent('dragend', $event)"
                        @drop="onSwapEvent('drop', $event)"
                        @dragover="onSwapEvent('dragover', $event)"
                        @dragenter="onSwapEvent('dragenter', $event)"
                        @dragleave="onSwapEvent('dragleave', $event)"
                        class="component-drag-box"
                        data-type="swap"
                        :data-row_index="rowIndex"
                        :data-col_index="colIndex"
                        :data-min_span="el.minSpan"
                        :data-el_id="el.id"
                        :data-row_free_space="row.getFreeSpace()"
                        :class="{
                          active:
                            page.editingElement &&
                            page.editingElement.id === el.id,
                          swap:
                            swapingComponentInfo &&
                            swapingComponentInfo.id !== el.id
                        }"
                      >
                        <AjaxLoading>
                          <component
                            :is="pathToComp[el.path].ctor"
                            v-bind="el.props"
                          />
                        </AjaxLoading>
                        <OperateList
                          :layout="asideLayout"
                          @click="handleComponentOperate(...arguments, row, el)"
                        />
                        <IconFont type="jiaohuan" />
                      </CatchEvents>
                    </div>
                    <div
                      v-if="row.getFreeSpace()"
                      :key="`drop-${row.id}`"
                      class="col drop-section"
                      :class="{
                        'pos-a': dropPosAbs,
                        show:
                          dragingComponent &&
                          row.getFreeSpace() >= dragingComponent.minSpan
                      }"
                      :data-row_index="rowIndex"
                      @drop="onDropEvent('drop', $event)"
                      @dragover="onDropEvent('dragover', $event)"
                      @dragenter="onDropEvent('dragenter', $event)"
                      @dragleave="onDropEvent('dragleave', $event)"
                    >
                      <i class="el-icon-plus"></i>
                    </div>
                  </transition-group>
                </Interact>
              </div>
              <div
                ref="rowDropDom"
                key="row-drop-section"
                class="row drop-section"
                :class="{
                  show: dragingComponent
                }"
                :data-row_index="page.rows.length"
                @drop="onDropEvent('drop', $event)"
                @dragover="onDropEvent('dragover', $event)"
                @dragenter="onDropEvent('dragenter', $event)"
                @dragleave="onDropEvent('dragleave', $event)"
              >
                <i class="el-icon-plus"></i>
              </div>
            </transition-group>
          </div>
        </el-main>
      </el-container>
      <EditPageAside
        v-if="asideLayout === 'right'"
        :asideLayout="asideLayout"
        :componentList="componentList"
        :pathToComp="pathToComp"
        :page="page"
        :activeTab.sync="activeTab"
        :dragingComponent.sync="dragingComponent"
        @addComponent="addComponent"
      />
    </el-container>
    <el-dialog
      title="预览"
      :visible.sync="visiblePreviewPage"
      fullscreen
      :close-on-click-modal="false"
      append-to-body
      custom-class="editpage-fc-preview-dialog"
    >
      <SinglePageApp v-if="visiblePreviewPage" />
    </el-dialog>
  </el-dialog>
</template>

<script>
import { getComponents, pathToComp } from '@/kd/utils/getComponents'
import { CatchEvents } from '../utils/CatchEvents'
import OperateList from '../OperateList/index'
import Interact from '../utils/Interact.vue'
import EditPageAside from './aside.vue'
import SinglePageApp from '@/pc/SinglePageApp.vue'
import { readonly } from '@/kd/utils'

/**
 *   @desc 编辑区
 *   @property {} page 当前编辑的页面，Page实例
 */
export default {
  name: 'EditPage',
  components: {
    SinglePageApp,
    CatchEvents,
    OperateList,
    Interact,
    EditPageAside
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    undoRedoHistory: {
      type: Object,
      default() {
        return {}
      }
    },
    page: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      visiblePreviewPage: false,
      asideLayout: localStorage.getItem('edit-aside-layout') || 'left',
      activeTab: 'select', // 当前选中的tab
      dragingComponent: null, // 正在从组件列表中拖拽的组件
      swapingComponentInfo: null, // 正在交换位置的组件
      dropPosAbs: false // 元素添加和拖放区域提示冲突 以此flag控制动画效果
    }
  },
  watch: {
    'page.editingElement'(v) {
      if (v) {
        if (this.activeTab === 'select') {
          this.activeTab = 'setting'
        }
      } else {
        if (this.activeTab === 'setting') {
          this.activeTab = 'select'
        }
      }
    }
  },
  created() {
    this.normalList()
    this.pathToComp = pathToComp
    window.addEventListener('keydown', this.onShortcutKey)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.onShortcutKey)
  },
  provide() {
    return {
      buildMode: true
    }
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
    addComponent(component, rowIndex = -1) {
      if (!component.draggable) return // 阻止点击事件触发

      const dragConfig = this.pathToComp[component.path].dragConfig
      if (dragConfig) {
        const { counter, layouts, dropRowIndx } = this.page.getLayout(rowIndex)

        if (rowIndex > -1) {
          if (
            dragConfig.onDrop?.call(readonly(this), {
              counter,
              layouts,
              dropRowIndx
            }) === false
          ) {
            return
          }
        }

        if (dragConfig.max) {
          const count = counter[component.name] || 0
          count + 1 >= dragConfig.max && (component.draggable = false)
        }
      }

      let element = null
      if (rowIndex > -1) {
        // 拖拽触发
        const row = this.page.rows[rowIndex]
        if (row) {
          // 添加元素前先将drop区域变成绝对定位 不然两者会冲突导致换行
          this.dropPosAbs = true
          this.$nextTick(() => {
            this.page.setEditingElement(row.addElements(component)[0])
          })
          // 动画结束恢复相对定位
          setTimeout(() => {
            this.dropPosAbs = false
          }, this.$store.state.theme.duration)
        } else {
          element = this.page.addRows({
            elements: [component]
          })[0].elements[0]
        }
      } else {
        // 点击触发
        element = this.page.addRows({
          elements: [component]
        })[0].elements[0]
        setTimeout(() => {
          this.$refs.rowDropDom.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
          })
        }, this.$store.state.theme.duration)
      }
      element && this.page.setEditingElement(element)
    },
    onDropEvent(type, e) {
      if (!this.dropHandler) {
        this.dropHandler = {
          drop: e => {
            e.preventDefault()
            const dropDom = e.currentTarget
            dropDom.classList.remove('enter')
            if (this.dragingComponent) {
              const { row_index: rowIndex } = dropDom.dataset
              // dropDom.addEventListener('transitionend', () => {
              //   debugger
              // })
              this.addComponent(this.dragingComponent, rowIndex, dropDom)
            }
          },
          dragover: e => {
            e.preventDefault()
            e.dataTransfer.dropEffect = 'copy'
          },
          dragenter: e => {
            e.currentTarget.classList.add('enter')
          },
          dragleave: e => {
            e.currentTarget.classList.remove('enter')
          }
        }
      }
      this.dropHandler[type](e)
    },
    onSwapEvent(type, e) {
      if (!this.swapHandler) {
        this.swapHandler = {
          dragstart: e => {
            e.stopPropagation()
            const {
              row_index: rowIndex,
              col_index: colIndex,
              min_span: minSpan,
              row_free_space: freeSpace,
              el_id: id
            } = e.currentTarget.dataset
            this.swapingComponentInfo = {
              rowIndex,
              colIndex,
              minSpan,
              freeSpace,
              id
            }
          },
          dragend: () => {
            this.swapingComponentInfo = null
          },
          drop: e => {
            e.preventDefault()
            if (this.swapHandler.canDrop(e.currentTarget.dataset)) {
              const { rowIndex, colIndex } = this.swapingComponentInfo
              const { row_index: ri, col_index: ci } = e.currentTarget.dataset
              this.page.swapElement({
                formRowIndex: +rowIndex,
                formColIndex: +colIndex,
                toRowIndex: +ri,
                toColIndex: +ci
              })
              e.currentTarget.classList.remove('enter')
            }
          },
          dragover: e => {
            e.preventDefault()
            if (this.swapHandler.canDrop(e.currentTarget.dataset)) {
              if (!this.swapAddClassFlag) {
                e.dataTransfer.dropEffect = 'copy'
                e.currentTarget.classList.add('enter')
                this.swapAddClassFlag = true
              }
            }
          },
          dragenter: () => {
            //
          },
          dragleave: ({ currentTarget }) => {
            if (this.swapingComponentInfo) {
              currentTarget.classList.remove('enter')
              this.swapAddClassFlag = false
            }
          },
          canDrop: ({
            /* 交互元素元素数据 */
            row_index: ri,
            col_index: ci,
            min_span: mi,
            row_free_space: fs
          }) => {
            if (this.swapingComponentInfo) {
              const {
                /* 拖拽元素数据 */
                rowIndex,
                colIndex,
                minSpan,
                freeSpace
              } = this.swapingComponentInfo
              // 同一元素
              if (rowIndex === ri && colIndex === ci) return false
              // 跨行，并且两元素minSpan不一致,校验两行是否都有足够的剩余空间来存放对方
              if (ri !== rowIndex && mi !== minSpan) {
                // 两交换元素最大的minSpan
                const maxMinSpan = Math.max(mi, minSpan)
                // 相对行的剩余空间
                const maxFreeSpace =
                  mi > minSpan ? minSpan + freeSpace : mi + fs
                return maxFreeSpace >= maxMinSpan
              }
              return true
            }
          }
        }
      }
      this.swapHandler[type](e)
    },
    onResizeEnd(row, { height }) {
      row.setStyle({ height: `${height | 0}px` })
    },
    handleComponentOperate(type, row, element) {
      ;({
        del: () => {
          row.delElement(element, this.componentList)
        },
        copy: () => {
          this.addComponent(element)
        },
        setting: () => {
          this.page.setEditingElement(element)
        }
      }[type]())
    },
    handleOperate(type) {
      ;({
        undo: () => {
          this.undoRedoHistory.undo()
        },
        redo: () => {
          this.undoRedoHistory.redo()
        },
        preview: () => {
          this.handleOperate('save')
          this.visiblePreviewPage = true
        },
        save: () => {
          localStorage.setItem('page', JSON.stringify(this.page))
          this.$message.success('保存成功')
        },
        exit: () => {
          this.$emit('update:visible', false)
          this.$router.replace({ name: 'SinglePageList' })
        },
        toggleLayout: () => {
          this.asideLayout = this.asideLayout === 'left' ? 'right' : 'left'
          localStorage.setItem('edit-aside-layout', this.asideLayout)
        }
      }[type]())
    },
    onShortcutKey(e) {
      const { metaKey, shiftKey, ctrlKey, keyCode } = e
      const commandKey = metaKey || ctrlKey
      // console.log({ shiftKey, altKey, commandKey, keyCode })
      if (keyCode === 90 && commandKey && !shiftKey) {
        // ctrl + z 撤销
        e.preventDefault()
        this.handleOperate('undo')
      } else if (keyCode === 90 && commandKey && shiftKey) {
        // ctrl + shift + z 反撤销
        e.preventDefault()
        this.handleOperate('redo')
      } else if (keyCode === 8 && !commandKey && !shiftKey) {
        // del 删除
        const el = this.page.editingElement
        const tagName = e.target.tagName
        if (el && !/INPUT|TEXTAREA/i.test(tagName)) {
          e.preventDefault()
          this.handleComponentOperate('del', el.parent, el)
        }
      } else if (keyCode === 83 && commandKey && !shiftKey) {
        // ctrl + s 保存
        e.preventDefault()
        this.handleOperate('save')
      } else if (keyCode === 80 && commandKey && !shiftKey) {
        // ctrl + p 预览
        e.preventDefault()
        this.handleOperate('preview')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.EditPage-wrapper {
  height: 100%;
  position: relative;
}
.drop-section {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0 dashed rgb(39, 209, 152);
  color: rgb(39, 209, 152);
  border-radius: 12px;
  font-size: 40px;
  transition: all $duration;
  &.row {
    height: 0;
    opacity: 0;
  }
  &.col {
    flex: 1;
    max-width: 0;
    opacity: 0;
    height: auto;
  }
  &.show {
    border-width: 2px;
    &.row {
      height: 80px;
      opacity: 1;
    }
    &.col {
      opacity: 1;
      max-width: inherit;
    }
  }
  &.enter {
    color: #fff;
    background-color: rgba(39, 209, 152, 0.5);
  }
}
.row-vdr {
  padding: 8px;
  .component-drag-box {
    padding: 8px;
  }
}
.component-drag-box {
  position: relative;
  border: 2px dashed transparent;
  border-radius: 8px;
  transition: all $duration;
  cursor: move;
  user-select: none;
  .operation-list {
    opacity: 0;
  }
  &.active {
    transform: scale(0.99);
    border-style: solid;
    border-color: $theme-color;
  }
  &:hover {
    .operation-list {
      opacity: 1;
    }
    border-color: $theme-color;
  }
  &.swap {
    /deep/ .iconfont {
      opacity: 1;
      transform: scale(1);
    }
  }
  /deep/ .iconfont {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40px;
    color: $theme-color;
    opacity: 0;
    transform: scale(0);
    transition: all $duration;
    z-index: 9999;
  }
  &.enter::after {
    opacity: 1;
  }
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #40a0ff9c;
    opacity: 0;
    transition: all $duration;
  }
}
</style>

<style lang="scss">
.editpage-fc-dialog {
  --animate-duration: $duration;
  .el-dialog__header,
  .el-dialog__body {
    padding: 0;
  }

  .el-container {
    overflow: hidden;
    height: 100vh;
    .el-header,
    .el-aside {
      color: #fff;
      background-color: #545c64;
    }
    .el-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .toggle-layout {
        cursor: pointer;
        &.right {
          transform: rotateY(180deg);
        }
        &:hover {
          color: $theme-color;
        }
      }
      .operate-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
        .operate-item {
          margin: 0 18px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #fff;
          font-size: 12px;
          cursor: pointer;
          .iconfont {
            font-size: 28px;
          }
          &:hover {
            color: $theme-color;
          }
          &.disabled {
            cursor: not-allowed;
            color: #ccc;
          }
        }
      }
    }
    .el-aside {
      width: 100% !important;
      height: 100%;
      .el-tabs {
        .el-tabs__header {
          margin: 0;
        }
        .el-tabs__active-bar {
          min-width: 50%;
          max-width: 50%;
        }
        .el-tabs__nav {
          .el-tabs__item {
            padding: 0;
            text-align: center;
            color: #fff;
            font-size: 14px;
            &.is-active {
              color: $theme-color;
            }
          }
        }
      }
      .el-collapse {
        border-color: transparent;
        .el-collapse-item__header {
          background-color: transparent;
          padding: 0 16px;
          color: #fff;
          border-color: transparent;
          &:hover {
            background-color: rgba(0, 0, 0, 0.05);
          }
        }
        .el-collapse-item__wrap {
          background-color: rgba(0, 0, 0, 0.2);
          padding: 0;
          border-color: transparent;
        }
        .el-collapse-item__content {
          padding: 16px;
          color: #fff;
        }
        .el-form-item__label {
          color: #fff;
        }
      }
      .title {
        text-align: center;
        height: 60px;
        line-height: 60px;
        font-size: 20px;
      }
      .select-component-wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        padding: 8px;
        user-select: none;
        .component-item {
          margin: 8px;
          font-size: 12px;
          text-align: center;
          color: #fff;
          transition: all $duration;
          cursor: not-allowed;
          &.draggable {
            cursor: grab;
            &:hover {
              color: $theme-color;
              transform: scale(1.1);
            }
            &:active {
              cursor: grabbing;
            }
          }
          .component-name {
            margin-top: 4px;
          }
        }
      }
    }
  }
}
.editpage-fc-preview-dialog .el-dialog__body {
  height: 100%;
}
</style>
<style lang="scss">
.fade-enter-active,
.fade-leave-active,
.transition-item {
  transition: all 1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: scale(0);
}
</style>
