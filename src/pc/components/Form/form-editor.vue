<!--
 * @Author: zijian6@leju.com
 * @Date: 2020-08-21 11:21:35
 * @LastEditors: zijian6@leju.com
 * @LastEditTime: 2020-08-25 18:00:59
 * @FilePath: /res.leju.com/dev/mvvm-project/vue/kd-pc/src/pc/components/Form/form-editor.vue
-->
<template>
  <div>
    <div class="component-btn">
      <el-button v-for="(item, index) in components" v-bind:key="index" plain @click="addComponent(item)">{{item.name}}</el-button>
    </div>
    <div class="com-setting" v-if="value.length > 0">
      <h2>组件配置</h2>
      <div v-for='(item, index) in value' v-bind:key="index">
        <el-button plain @click="changeSetting(index)">{{item.label}}</el-button>
        <el-tooltip
          class="ml-4 hover-color click-effect"
          effect="dark"
          content="删除"
          placement="top"
        >
          <el-button icon="el-icon-delete-solid" @click.native="deleteComponent(index)"></el-button>
        </el-tooltip>
        <el-tooltip
          class="ml-4 hover-color click-effect"
          effect="dark"
          content="编辑"
          placement="top"
        >
          <el-button icon="el-icon-edit" @click.native="editComponent(index)"></el-button>
        </el-tooltip>
      </div>
    </div>

    <el-drawer title="组件配置" :visible.sync="drawer" :direction="direction" :modal="false" :append-to-body='true'>
      <div class="container">
        <el-form ref="form" :model="form" label-width="auto">
          <div v-if="currentType === 'input'">
            <el-form-item label="标题">
              <el-input v-model="form.label"></el-input>
            </el-form-item>
            <el-form-item label="数据字段名">
              <el-input v-model="form.dataField"></el-input>
            </el-form-item>
            <el-form-item label="占位文本">
              <el-input v-model="form.props.placeholder"></el-input>
            </el-form-item>
          </div>
          <div v-if="currentType === 'select'">
            <el-form-item label="选择器标题">
              <el-input v-model="form.label"></el-input>
            </el-form-item>
            <el-form-item label="选项">
              <el-row v-for="(option, index) in form.options" :key="index" class="select-option">
                <el-input v-model="form.options[index]"></el-input>
                <el-tooltip
                  class="ml-4 hover-color click-effect"
                  effect="dark"
                  content="删除"
                  placement="top"
                >
                  <el-button icon="el-icon-remove-outline" @click.native="deleteSelectOption(index)"></el-button>
                </el-tooltip>
              </el-row>
            </el-form-item>
            <el-form-item label="">
              <el-button icon="el-icon-circle-plus-outline" @click.native="addSelectOption">增加选项</el-button>
            </el-form-item>
            <el-form-item label="数据字段名">
              <el-input v-model="form.dataField"></el-input>
            </el-form-item>
            <el-form-item label="占位文本">
              <el-input v-model="form.props.placeholder"></el-input>
            </el-form-item>
            <el-form-item label="是否多选">
              <el-switch
                v-model="form.props.multiple"
                :active-value="'custom'"
                active-color="#13ce66"
                inactive-color="#ff4949"
              >
              </el-switch>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'FormEditor',
  props: {
    value: {
      type: Array,
      default() {
        return [
        ]
      }
    }
  },
  data() {
    return {
      direction: 'rtl',
      drawer: false,
      form: {
        props: {}
      },
      components: [
        {
          name: '输入框',
          type: 'input'
        },
        {
          name: '选择器',
          type: 'select'
        }
      ],
      currentIndex: 0
    }
  },
  computed: {
    currentType() {
      return this.value[this.currentIndex]?.type || ''
    }
  },
  methods: {
    deleteComponent(index) {
      this.value.splice(index, 1)
      this.$emit('change', this.value)
    },
    editComponent(index) {
      this.currentIndex = index
      this.form = this.value[index]
      this.drawer = true
    },
    addComponent({type, label}) {
      this.value.push({
        label: label || '标题',
        type: type,
        props: {
          placeholder: '请选择'
        },
        ...(type === 'select' ? {options: ['选项']} : [])
      })
      this.$emit('change', this.value)
      this.currentIndex = this.value.length - 1
    },
    changeSetting() {
      this.value.push({
        label: '标题',
        type: 'input'
      })
      this.$emit('change', this.value)
      this.drawer = true
    },
    deleteSelectOption(index) {
      this.form.options.splice(index, 1)
    },
    addSelectOption() {
      this.form.options.push('选项')
    },
    onSubmit() {
      Object.assign(this.value[this.currentIndex], this.form)
      console.log(this.value);
      this.drawer = false
      this.$emit('change', this.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
}
.el-input {
  position: relative;
  display: inline-block;
  width: 100%;
}
.select-option {
  width: 100%;
  display: flex;
  align-items: center;
}
</style>