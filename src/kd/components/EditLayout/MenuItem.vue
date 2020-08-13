<template>
  <el-submenu
    v-if="menu.type === 'menu'"
    :index="index"
    @dblclick.native="onFocus"
  >
    <template slot="title">
      <div class="edit-input" v-if="editor && menu.edit">
        <el-input
          v-model="menu.name"
          placeholder="请输入目录名称"
          @blur="onBlur"
        />
        <i class="el-icon-close" @click="delSubMenu"></i>
      </div>
      <template v-else>
        <i class="el-icon-folder"></i>
        <span>{{ menu.name }}</span>
      </template>
    </template>
    <template v-for="(subM, i) in menu.children">
      <MenuItem
        :editor="editor"
        :key="`${index}-${i}`"
        :menu="subM"
        :index="`${index}-${i}`"
      />
    </template>
    <div class="flex-center mt-16 btn-box" v-if="editor && menu.name">
      <el-tooltip v-if="level < 2" effect="dark" content="添加目录">
        <el-button
          icon="el-icon-folder-add"
          circle
          @click="addSubmenu('menu')"
        ></el-button>
      </el-tooltip>
      <el-tooltip class="ml-16" effect="dark" content="添加页面">
        <el-button
          icon="el-icon-document-add"
          circle
          @click="addSubmenu('page')"
        ></el-button>
      </el-tooltip>
    </div>
  </el-submenu>
  <el-menu-item
    v-else
    :index="`${index}-${menu.routeName}`"
    @dblclick.native="onFocus"
  >
    <div class="edit-input" v-if="editor && menu.edit">
      <el-input
        v-model="menu.name"
        placeholder="请输入页面名称"
        @blur="onBlur"
      />
      <i class="el-icon-close" @click="delSubMenu"></i>
    </div>
    <template v-else>
      <i class="el-icon-document"></i>
      <span slot="title">{{ menu.name }}</span>
    </template>
  </el-menu-item>
</template>

<script>
/**
 * @desc 递归菜单组件
 */
export default {
  name: 'MenuItem',
  props: {
    menu: {
      type: Object,
      default() {
        return {}
      }
    },
    index: {
      type: String,
      default: ''
    },
    editor: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.level = this.calcLevel()
  },
  methods: {
    calcLevel() {
      let p = this.menu.parent,
        i = 0
      while (p) {
        i++
        p = p.parent
      }
      return i
    },
    addSubmenu(type) {
      this.menu.addChild({
        type,
        name: '',
        show: true,
        edit: true
      })
    },
    delSubMenu() {
      this.menu.remove()
    },
    onBlur() {
      const menu = this.menu
      if (menu.name) {
        const same = menu.parent.children.some(
          m => m !== menu && m.name === menu.name
        )
        if (same) {
          this.$message.warning('同一层级内名称不能重复')
          menu.name = menu.name + '-副本'
        }
        menu.edit = false
      }
    },
    onFocus() {
      this.menu.edit = true
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .btn-box [class^='el-icon-'] {
  vertical-align: baseline;
  margin-right: 0;
  width: auto;
  text-align: center;
  font-size: inherit;
}
// @for $i from 1 through 2 {
//   .level-#{$i} {
//     margin-left: $i * 16 * 1px !important;
//   }
// }
</style>
