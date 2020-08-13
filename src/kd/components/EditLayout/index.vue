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
        <svg
          @click="onFullScreen"
          v-show="!fullScreen"
          class="full-screen"
          t="1596693779254"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="9101"
        >
          <path
            d="M290 236.4l43.9-43.9c4.7-4.7 1.9-12.8-4.7-13.6L169 160c-5.1-0.6-9.5 3.7-8.9 8.9L179 329.1c0.8 6.6 8.9 9.4 13.6 4.7l43.7-43.7L370 423.7c3.1 3.1 8.2 3.1 11.3 0l42.4-42.3c3.1-3.1 3.1-8.2 0-11.3L290 236.4zM642.7 423.7c3.1 3.1 8.2 3.1 11.3 0l133.7-133.6 43.7 43.7c4.7 4.7 12.8 1.9 13.6-4.7L863.9 169c0.6-5.1-3.7-9.5-8.9-8.9L694.8 179c-6.6 0.8-9.4 8.9-4.7 13.6l43.9 43.9L600.3 370c-3.1 3.1-3.1 8.2 0 11.3l42.4 42.4zM845 694.9c-0.8-6.6-8.9-9.4-13.6-4.7l-43.7 43.7L654 600.3c-3.1-3.1-8.2-3.1-11.3 0l-42.4 42.3c-3.1 3.1-3.1 8.2 0 11.3L734 787.6l-43.9 43.9c-4.7 4.7-1.9 12.8 4.7 13.6L855 864c5.1 0.6 9.5-3.7 8.9-8.9L845 694.9zM381.3 600.3c-3.1-3.1-8.2-3.1-11.3 0L236.3 733.9l-43.7-43.7c-4.7-4.7-12.8-1.9-13.6 4.7L160.1 855c-0.6 5.1 3.7 9.5 8.9 8.9L329.2 845c6.6-0.8 9.4-8.9 4.7-13.6L290 787.6 423.7 654c3.1-3.1 3.1-8.2 0-11.3l-42.4-42.4z"
            p-id="9102"
            fill="#fff"
          ></path>
        </svg>
        <svg
          @click="onFullScreen"
          v-show="fullScreen"
          class="full-screen-exit"
          t="1596693755817"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="8838"
        >
          <path
            d="M391 240.9c-0.8-6.6-8.9-9.4-13.6-4.7l-43.7 43.7L200 146.3c-3.1-3.1-8.2-3.1-11.3 0l-42.4 42.3c-3.1 3.1-3.1 8.2 0 11.3L280 333.6l-43.9 43.9c-4.7 4.7-1.9 12.8 4.7 13.6L401 410c5.1 0.6 9.5-3.7 8.9-8.9L391 240.9zM401.1 614.1L240.8 633c-6.6 0.8-9.4 8.9-4.7 13.6l43.9 43.9L146.3 824c-3.1 3.1-3.1 8.2 0 11.3l42.4 42.3c3.1 3.1 8.2 3.1 11.3 0L333.7 744l43.7 43.7c4.7 4.7 12.8 1.9 13.6-4.7l18.9-160.1c0.6-5.1-3.7-9.4-8.8-8.8zM622.9 409.9L783.2 391c6.6-0.8 9.4-8.9 4.7-13.6L744 333.6 877.7 200c3.1-3.1 3.1-8.2 0-11.3l-42.4-42.3c-3.1-3.1-8.2-3.1-11.3 0L690.3 279.9l-43.7-43.7c-4.7-4.7-12.8-1.9-13.6 4.7L614.1 401c-0.6 5.2 3.7 9.5 8.8 8.9zM744 690.4l43.9-43.9c4.7-4.7 1.9-12.8-4.7-13.6L623 614c-5.1-0.6-9.5 3.7-8.9 8.9L633 783.1c0.8 6.6 8.9 9.4 13.6 4.7l43.7-43.7L824 877.7c3.1 3.1 8.2 3.1 11.3 0l42.4-42.3c3.1-3.1 3.1-8.2 0-11.3L744 690.4z"
            p-id="8839"
            fill="#fff"
          ></path>
        </svg>
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
          <router-view></router-view>
        </template>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import MenuItem from './MenuItem.vue'
import EditPage from './EditPage.vue'
const MAX_NAV = 5
/**
 *   @desc 可编辑的布局组件
 *   @params project Project实例
 *   @params editor 开启编辑模式
 */
export default {
  name: 'EditLayout',
  components: {
    MenuItem,
    EditPage
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
        width: 24px;
        height: 24px;
        cursor: pointer;
        transition: scale 0.3s;
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
