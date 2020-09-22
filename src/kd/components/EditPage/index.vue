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
        :editPageAsideWidth.sync="editPageAsideWidth"
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
                <el-color-picker
                  v-model="project.themeColor"
                  @change="updateColor"
                  size="mini"
                />
              </div>
              <div slot="content">
                主题换肤
              </div>
            </el-tooltip>
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
          <div class="EditPage-wrapper" id="_EditPageWrapper">
            <transition-group
              tag="div"
              name="fade"
              class="components-wrapper"
              :class="{ dragging: dragingComponent }"
            >
              <div
                class="transition"
                v-for="(row, rowIndex) in page.rows"
                :key="row.id"
              >
                <!-- <Interact
                  class="row-vdr"
                  :edges="['bottom']"
                  :h="row.getStyle().height || 'auto'"
                  :style="{
                    marginBottom: row.getStyle().marginBottom
                  }"
                  @resizeEnd="onResizeEnd(row, ...arguments)"
                > -->
                <transition-group
                  tag="div"
                  name="fade"
                  class="clearfix layout-row"
                  :ref="page.rows.length - 1 === rowIndex ? 'lastRow' : ''"
                  :style="row.getStyle()"
                >
                  <div
                    class="layout-col transition"
                    :style="el.getStyle()"
                    v-for="(el, colIndex) in row.elements"
                    :key="el.id"
                    @click="handleComponentOperate('setting', row, el)"
                  >
                    <transition name="fade" mode="out-in">
                      <div
                        v-if="el.name === 'dropPlaceholder'"
                        key="dropPlaceholder"
                        class="drop-section"
                        :data-row_index="rowIndex"
                        @drop="onDropEvent('drop', $event)"
                        @dragover="onDropEvent('dragover', $event)"
                        @dragenter="onDropEvent('dragenter', $event)"
                        @dragleave="onDropEvent('dragleave', $event)"
                      >
                        <i class="el-icon-plus"></i>
                      </div>
                      <CatchEvents
                        v-else
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
                        <AjaxLoading :key="el.path">
                          <component
                            :key="el.path"
                            :componentID="el.id"
                            ref="componentVMs"
                            @hook:mounted="onAddComponentMounted(el)"
                            :data-row_index="rowIndex"
                            :data-col_index="colIndex"
                            :layouts="page.getLayout(rowIndex, colIndex)"
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
                    </transition>
                  </div>
                </transition-group>
                <!-- </Interact> -->
              </div>
            </transition-group>
            <div
              v-if="page.rows.length === 0"
              key="empty-alert"
              class="empty-alert"
            >
              <IconFont type="kong" />
              请添加组件
            </div>
          </div>
        </el-main>
      </el-container>
      <EditPageAside
        v-if="asideLayout === 'right'"
        :asideLayout="asideLayout"
        :editPageAsideWidth.sync="editPageAsideWidth"
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
// import Interact from '../utils/Interact.vue'
import EditPageAside from './aside.vue'
import SinglePageApp from '@/pc/views/SinglePageApp'
import { readonly, onceEventListener } from '@/kd/utils'
import Vue from 'vue'
import { cloneDeep } from 'lodash'
const theme = Vue.observable({
  color: ''
})
const provideAsideLayout = Vue.observable({
  direction: '',
  width: 'auto'
})
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
    // Interact,
    EditPageAside
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    project: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    saveProject: {
      type: Function,
      default() {
        return () => Promise.resolve()
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
      editPageAsideWidth: localStorage.getItem('editPageAsideWidth') || 300
    }
  },
  computed: {
    undoRedoHistory() {
      return this.$store.state.editor.undoRedoHistory
    },
    page() {
      return this.project.menu[0].children[0]
    }
  },
  watch: {
    asideLayout: {
      handler(v) {
        provideAsideLayout.direction = v
      },
      immediate: true
    },
    editPageAsideWidth: {
      handler(v) {
        provideAsideLayout.width = v
      },
      immediate: true
    },
    'page.editingElement'(v) {
      // 本次事件循环执行时间太长，切分至下次循环
      setTimeout(() => {
        if (v) {
          if (this.activeTab === 'select') {
            this.activeTab = 'setting'
          }
        } else {
          if (this.activeTab === 'setting') {
            this.activeTab = 'select'
          }
        }
      })
    },
    'page.editingElement.immediateValidate'(v) {
      if (v) {
        this.activeTab = 'setting'
      }
    },
    'project.themeColor': {
      handler(color) {
        theme.color = color
      },
      immediate: true
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
      buildMode: true,
      theme,
      asideLayout: provideAsideLayout
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
      // > -1 代表是拖拽触发
      const isDragEvent = rowIndex > -1
      if (!component.disabled) return // 阻止点击事件触发

      let newElement = null
      if (isDragEvent) {
        // 拖拽触发
        // 页面布局信息
        const { counter, layouts } = this.page.getLayout()
        // 当前组件拖拽配置
        const dragConfig = this.pathToComp[component.path].dragConfig
        if (dragConfig) {
          // max 监测
          if (dragConfig.max) {
            const count = counter[component.name] || 0
            count + 1 >= dragConfig.max && (component.disabled = false)
          }
        }
        // 检查同行所有组件 canDrop
        const count = counter[component.name] || 0
        const newLayouts = cloneDeep(layouts)
        newLayouts[rowIndex] = [
          ...newLayouts[rowIndex],
          this.page.createLayoutItem(component)
        ]
        if (
          this.validateRowCanDrop(newLayouts, rowIndex, {
            layouts: newLayouts,
            counter: { ...counter, [component.name]: count + 1 }
          })
        ) {
          return
        }
        const row = this.page.rows[rowIndex]
        newElement = row.replaceDropPlaceholder(component)
      } else {
        // 点击触发
        newElement = this.page.addRows({
          elements: [component]
        })[0].elements[0]
        // 本次事件循环执行时间太长，切分至下次循环
        setTimeout(() => {
          // 滚动到底部
          const [{ $el }] = this.$refs.lastRow
          $el.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
          })
        })
      }
      this.page.setEditingElement(newElement)
    },
    validateRowCanDrop(layouts, rowIndex, info = {}) {
      return layouts[rowIndex]?.some((el, i) => {
        const { dragConfig } = this.pathToComp[el.path]
        return (
          dragConfig?.onDrop?.call(readonly(this), {
            ...info,
            rowIndex,
            colIndex: i
          }) === false
        )
      })
    },
    onAddComponentMounted(el) {
      const componentVMs = this.$refs.componentVMs || []
      const vm = componentVMs.find(e => e.$attrs.componentID === el.id)
      if (vm) {
        el.setRenderComponent(Object.freeze(Object.create(vm)))
      }
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
              this.addComponent(this.dragingComponent, rowIndex)
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
              id,
              el: e.currentTarget
            }
          },
          dragend: () => {
            this.swapingComponentInfo = null
          },
          drop: e => {
            e.preventDefault()
            e.currentTarget.classList.remove('enter')
            // 检查剩余空间是否可以交换
            if (this.swapHandler.canDrop(e.currentTarget.dataset)) {
              const { rowIndex, colIndex, el } = this.swapingComponentInfo
              const { row_index: ri, col_index: ci } = e.currentTarget.dataset
              // 页面布局信息
              const { counter, layouts } = this.page.getLayout()
              // 检查两行组件 dragConfig.canDrop 是否允许交换
              // 拖拽组件元素
              const dragEl = this.page.rows[rowIndex].elements[colIndex]
              // 交换组件元素
              const dropEl = this.page.rows[ri].elements[ci]
              // 构造新的布局信息
              const newLayouts = cloneDeep(layouts)
              // 将交换组件元素 替换成 拖拽组件元素
              newLayouts[ri].splice(ci, 1, this.page.createLayoutItem(dragEl))
              // 将拖拽组件元素 替换成 交换组件元素
              newLayouts[rowIndex].splice(
                colIndex,
                1,
                this.page.createLayoutItem(dropEl)
              )
              // 校验交换行canDrop
              if (
                this.validateRowCanDrop(newLayouts, ri, {
                  counter,
                  layouts: newLayouts
                })
              ) {
                return
              }
              // 校验拖拽行canDrop
              if (
                this.validateRowCanDrop(newLayouts, rowIndex, {
                  counter,
                  layouts: newLayouts
                })
              ) {
                return
              }
              this.page.swapElement({
                formRowIndex: +rowIndex,
                formColIndex: +colIndex,
                toRowIndex: +ri,
                toColIndex: +ci
              })
              if (ri === rowIndex) return
              // 跨行添加交换动画效果 children[0] 是因为animate.css 不能同transtion样式共用，子元素没有transition样式
              // 要交换的元素在上面
              const isDropElAbove = ri < rowIndex
              const dropAnimate = [
                'animate__animated',
                isDropElAbove ? 'animate__fadeInUp' : 'animate__fadeInDown',
                'animate__fast'
              ]
              e.currentTarget.children[0].classList.add(...dropAnimate)
              onceEventListener(
                e.currentTarget.children[0],
                'animationend',
                function() {
                  this.classList.remove(...dropAnimate)
                }
              )
              const dragAnimate = [
                'animate__animated',
                isDropElAbove ? 'animate__fadeInDown' : 'animate__fadeInUp',
                'animate__fast'
              ]
              el.children[0].classList.add(...dragAnimate)
              onceEventListener(el.children[0], 'animationend', function() {
                this.classList.remove(...dragAnimate)
              })
            }
          },
          dragover: e => {
            e.preventDefault()
          },
          dragenter: e => {
            if (this.swapHandler.canDrop(e.currentTarget.dataset)) {
              if (!this.swapAddClassFlag) {
                e.dataTransfer.dropEffect = 'copy'
                e.currentTarget.classList.add('enter')
                this.swapAddClassFlag = true
              }
            }
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
            // 校验行剩余空间
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
          this.page
            .validate()
            .then(() => {
              this.saveProject(this.project).then(() => {
                this.visiblePreviewPage = true
              })
            })
            .catch(() => {
              return Promise.reject()
            })
        },
        save: () => {
          this.page
            .validate()
            .then(() => {
              this.saveProject(this.project)
            })
            .catch(() => {
              return Promise.reject()
            })
        },
        exit: () => {
          this.$emit('update:visible', false)
          this.$router.push({ name: 'SinglePageList' })
        },
        toggleLayout: () => {
          this.asideLayout = this.asideLayout === 'left' ? 'right' : 'left'
          localStorage.setItem('edit-aside-layout', this.asideLayout)
        }
      }[type]())
    },
    updateColor() {
      this.project.updateTheme(document.getElementById('_EditPageWrapper'))
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
  min-height: 100%;
  position: relative;
}
.empty-alert {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: rgba(0, 0, 0, 0.25);

  .iconfont {
    display: block;
    font-size: 120px;
  }
}
.drop-section {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed rgb(39, 209, 152);
  color: rgb(39, 209, 152);
  border-radius: 12px;
  font-size: 40px;
  transition: all $duration;
  flex: 1;
  opacity: 1;
  min-height: 80px;
  height: 100%;
  &.enter {
    color: #fff;
    background-color: rgba(39, 209, 152, 0.5);
  }
  .el-icon-plus {
    pointer-events: none;
  }
}
.row-vdr {
  padding: 8px;
}
.component-drag-box {
  position: relative;
  outline: 2px dashed transparent;
  transition: all $duration;
  cursor: move;
  user-select: none;
  .operation-list {
    opacity: 0;
  }
  &.active {
    transform: scale(0.99);
    outline-style: solid;
    outline-color: $theme-color;
  }
  &:hover {
    .operation-list {
      opacity: 1;
    }
    outline-color: $theme-color;
  }
  &.swap {
    > * {
      // 子元素不会变成鼠标事件的 target
      pointer-events: none;
    }
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
    z-index: 9999;
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
.components-wrapper {
  transition: all $duration;
  transform-origin: top;
  will-change: transform;
  &.dragging {
    transform: scale(0.8);
  }
}
</style>

<style lang="scss">
.editpage-fc-dialog {
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
        align-items: center;
        padding: 8px;
        user-select: none;
        .component-item {
          margin: 8px 16px;
          font-size: 12px;
          text-align: center;
          color: #fff;
          transition: all $duration;
          cursor: not-allowed;
          &.disabled {
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
    .el-main {
      background-color: $mainBgColor;
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
  transition: all $duration;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
