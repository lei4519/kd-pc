<template>
  <el-container class="home-wrapper" ref="container">
    <el-header>
      <div class="left">
        <h1 class="logo">
          BI可视化搭建
        </h1>
        <el-menu
          ref="navMenu"
          class="deselect"
          :default-active="menuIndex"
          mode="horizontal"
          @select="handleNavBarSelect"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item
            v-for="(m, i) in project.menu"
            :index="`${i}`"
            :key="i"
            @dblclick.native="onFocus(m)"
          >
            <div class="edit-input" v-if="editor && m.edit">
              <el-input
                v-model="m.name"
                placeholder="目录名称"
                @blur="onBlur(m)"
              />
              <i
                v-if="i !== 0"
                class="el-icon-close"
                @click="delNavbar(m, i)"
              ></i>
            </div>
            <span v-else>{{ m.name }}</span>
          </el-menu-item>
        </el-menu>
        <div class="flex-center ml-12" v-if="editor">
          <el-tooltip effect="dark" content="添加目录">
            <el-button
              icon="el-icon-folder-add"
              circle
              @click="addMenu"
            ></el-button>
          </el-tooltip>
        </div>
      </div>
      <div class="right">
        <ThemePicker />
        <IconFont
          type="expend"
          class="full-screen"
          @click.native="onFullScreen"
          v-show="!fullScreen"
        ></IconFont>
        <IconFont
          type="compress"
          class="full-screen-exit"
          @click.native="onFullScreen"
          v-show="fullScreen"
        ></IconFont>
      </div>
    </el-header>
    <el-container>
      <el-aside>
        <el-menu
          :default-active="activeRouteName"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :default-openeds="openeds"
          @select="handleAsideSelect"
        >
          <div class="flex-center mb-16" v-if="editor && showSubmenuAdd">
            <el-tooltip effect="dark" content="添加目录">
              <el-button
                icon="el-icon-folder-add"
                circle
                @click="addSubmenu('menu')"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="ml-32" effect="dark" content="添加页面">
              <el-button
                icon="el-icon-document-add"
                circle
                @click="addSubmenu('page')"
              ></el-button>
            </el-tooltip>
          </div>
          <template v-for="(m, i) in subMenu">
            <MenuItem
              :editor="editor"
              :key="`${menuIndex}-${i}`"
              :menu="m"
              :index="`${menuIndex}-${i}`"
            />
          </template>
        </el-menu>
      </el-aside>
      <el-main>
        <template v-if="editor">
          <EditPage v-show="editingPage" :page="editingPage" />
        </template>
        <template v-else>
          <el-breadcrumb
            separator-class="el-icon-arrow-right"
            v-if="breadcrumb.length"
          >
            <el-breadcrumb-item v-for="(b, i) in breadcrumb" :key="i">
              {{ b.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
          <transition
            mode="out-in"
            enter-active-class="animate__animated animate__fadeIn animate__faster"
            leave-active-class="animate__animated animate__fadeOut animate__faster"
          >
            <router-view></router-view>
          </transition>
        </template>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import MenuItem from './MenuItem.vue'
import EditPage from '../EditPage/index'
import ThemePicker from '@/kd/components/ThemePicker'
const MAX_NAV = 5
/**
 *   @desc 可编辑的布局组件
 *   @property {} project Project实例
 *   @property {} editor 开启编辑模式
 */
export default {
  name: 'EditLayout',
  components: {
    MenuItem,
    EditPage,
    ThemePicker
  },
  props: {
    project: {
      type: Object,
      default() {
        return {}
      }
    },
    editor: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      menuIndex: '0', // 当前的navbar索引
      activeRouteName: sessionStorage.getItem('activeRouteName'), // 当前的路由名称
      openeds: [], // 打开的目录
      editingPage: null, // 当前编辑的页面
      fullScreen: false // 全屏
    }
  },
  computed: {
    subMenu() {
      // 侧边栏菜单
      return this.project.menu?.[this.menuIndex]?.children || []
    },
    showSubmenuAdd() {
      // 编辑模式：展示侧边栏新增按钮
      return this.project.menu?.[this.menuIndex]?.name
    },
    breadcrumb() {
      return []
      // const item = flatTree.find(_ => _.routeID === +this.activeRouteName)
    }
  },
  created() {
    // 初始化当前选中路由
    this.initIndex()
    // TEST 测试代码
    if (this.editor && this.project.menu.length === 0) {
      this.project.addMenu({
        name: '系统设置',
        show: true,
        edit: true
      })
      this.project.menu[0].addChild({
        type: 'page',
        name: '测试',
        show: true
      })
      this.editingPage = this.project.menu[0].children[0]
    }
  },
  methods: {
    initIndex() {
      if (!this.activeRouteName) {
        let opened = ''
        const routeName = this.$route.meta.menuActiveName
        const find = (children, index) => {
          children.some((child, i) => {
            const id = index ? `${index}-${i}` : `${i}`
            if (child.type === 'menu') {
              return find(child.children, id)
            }
            if (child.routeName === routeName) {
              opened = id
              return true
            }
          })
        }
        find(this.project.menu)
        this.openeds = [opened]
        this.activeRouteName = opened + '-' + routeName
      }
    },
    handleNavBarSelect(key) {
      this.menuIndex = key
    },
    handleAsideSelect(index) {
      if (this.editor) {
        // 编辑模式逻辑
        const path = index.split('-').slice(0, -1)
        let child = this.project.menu[path.shift()]
        while (path.length) {
          child = child.children[path.shift()]
        }
        if (!child.name) return
        this.editingPage = child
        return
      }
      const routeName = index.split('-').pop()
      if (routeName === this.$route.name) return
      this.activeRouteName = index
      sessionStorage.setItem('activeRouteName', index)
      this.$router.push({ name: routeName })
    },
    onFullScreen() {
      ;(this.fullScreen
        ? document.exitFullscreen()
        : this.$refs.container.$el.requestFullscreen()
      ).then(() => {
        this.fullScreen = !this.fullScreen
      })
    },
    // 以下 编辑模式逻辑
    addMenu() {
      if (this.project.menu.length >= MAX_NAV) {
        return this.$message.warning('超出最大限制')
      }
      this.project.addMenu({
        name: '',
        show: true,
        edit: true
      })
    },
    delNavbar(menu, i) {
      this.project.delMenu(menu)
      setTimeout(() => {
        // 聚焦前一个
        this.menuIndex = `${i - 1}`
      })
    },
    addSubmenu(type) {
      this.project.menu[this.menuIndex].addChild({
        type,
        name: '',
        show: true,
        edit: true
      })
    },
    onBlur(menu) {
      if (menu.name) {
        const same = this.project.menu.some(
          m => m !== menu && m.name === menu.name
        )
        if (same) {
          this.$message.warning('同一层级内名称不能重复')
          menu.name = menu.name + '-副本'
        }
        menu.edit = false
      }
    },
    onFocus(menu) {
      menu.edit = true
    }
  }
}
</script>

<style lang="scss" scoped>
$header_height: 60px;
$aside_width: 200px;
.home-wrapper {
  background: #fff;
  .el-header {
    display: flex;
    justify-content: space-between;
    height: $header_height;
    padding: 0;
    background-color: #545c64;
    .left {
      display: flex;
      .logo {
        font-size: 24px;
        color: #fff;
        text-align: center;
        font-family: 'DIN Alternate';
        line-height: $header_height;
        width: $aside_width;
      }
      .el-menu {
        &.el-menu--horizontal {
          border-bottom: none;
        }
      }
      .el-input {
        width: 100px;
      }
    }
    .right {
      display: flex;
      align-items: center;
      margin-right: 20px;
      .full-screen,
      .full-screen-exit {
        font-size: 26px;
        color: #fff;
        cursor: pointer;
        transition: scale $duration;
        &:hover {
          transform: scale(1.2);
        }
        &:active {
          transform: scale(0.9);
        }
      }
    }
  }
  .el-container {
    height: calc(100vh - #{$header_height});
  }
  .el-aside {
    position: relative;
    height: 100%;
    width: $aside_width !important;
    user-select: none;
    .el-menu {
      height: 100%;
      border-right: none;
    }
  }
  .el-main {
    .el-breadcrumb {
      margin-bottom: 24px;
    }
  }
  .edit-input {
    position: relative;
    .el-icon-close {
      position: absolute;
      width: 14px;
      height: 14px;
      font-size: 14px;
      top: 50%;
      transform: translate(5px, -50%);
      color: #fff;
      border-radius: 50%;
      &:hover {
        background-color: rgba(0, 0, 0, 0.4);
      }
    }
  }
}
</style>
