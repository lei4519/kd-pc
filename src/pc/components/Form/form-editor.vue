<!--
 * @Author: zijian6@leju.com
 * @Date: 2020-08-21 11:21:35
 * @LastEditors: zijian6@leju.com
 * @LastEditTime: 2020-09-01 16:57:49
 * @FilePath: /res.leju.com/dev/mvvm-project/vue/kd-pc/src/pc/components/Form/form-editor.vue
-->
<template>
  <div>
    <div class="component-btn">
      <el-button
        v-for="(item, index) in components"
        v-bind:key="index"
        plain
        @click="addComponent(item)"
        >{{ item.name }}</el-button
      >
    </div>
    <div class="com-setting" v-if="value.length > 0">
      <h2>组件配置</h2>
      <div v-for="(item, index) in value" v-bind:key="index">
        <el-button plain>{{
          item.label
        }}</el-button>
        <el-tooltip
          class="ml-4 hover-color click-effect"
          effect="dark"
          content="删除"
          placement="top"
        >
          <el-button
            icon="el-icon-delete-solid"
            @click.native="deleteComponent(index)"
          ></el-button>
        </el-tooltip>
        <el-tooltip
          class="ml-4 hover-color click-effect"
          effect="dark"
          content="编辑"
          placement="top"
        >
          <el-button
            icon="el-icon-edit"
            @click.native="editComponent(index)"
          ></el-button>
        </el-tooltip>
      </div>
    </div>

    <el-drawer
      title="组件配置"
      :visible.sync="drawer"
      :direction="direction"
      :modal="false"
      :append-to-body="true"
      :with-header="false"
    >
      <div class="container">
        <!-- <h2>组件配置</h2> -->
        <el-form ref="form" :model="form" label-width="auto" size="mini">
          <el-form-item>
            <el-row>
              <el-col :span="4">
                <span>标题</span>
              </el-col>
              <el-col :span="20">
                <el-input v-model="form.label" @change="setProps(form.label, ...arguments)"></el-input> 
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-col :span="4">
                <span>数据字段名</span>
              </el-col>
              <el-col :span="20">
                <el-input v-model="form.dataField" @change="setProps(form.dataField, ...arguments)"></el-input> 
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-col :span="4">
                <span>占位文本</span>
              </el-col>
              <el-col :span="20">
                <el-input v-model="form.props.placeholder" @change="setProps(form.dataField, ...arguments)"></el-input> 
              </el-col>
            </el-row>
          </el-form-item>
          <el-row class="mt-20" v-if="currentType === 'select'">
            <el-form-item v-for="(option, index) in form.options" :key="index" class="select-option">
              <el-row>
                <el-col :span="4">
                  <span>{{'选项' + (index + 1)}}</span>
                </el-col>
                <el-col :span="20">
                  <el-row>
                    <el-col :span="20">
                      <el-input v-model="form.options[index]"></el-input>
                    </el-col>
                    <el-col :span="4">
                      <el-tooltip
                        class="ml-4 hover-color click-effect"
                        effect="dark"
                        content="删除"
                        placement="top"
                      >
                        <el-button
                          class="del-option-btn"
                          icon="el-icon-remove-outline"
                          @click.native="deleteSelectOption(index)"
                        ></el-button>
                      </el-tooltip>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-form-item>
            <el-row>
              <el-col :offset="6">  
                <div
                  class="option-btn"
                  icon="el-icon-circle-plus-outline"
                  @click="addSelectOption"
                  >
                  <i class="el-icon-plus"></i>增加选项
                </div>
              </el-col>
            </el-row>
          </el-row>
          <el-form-item v-if="currentType === 'select'">
            <el-row>
              <el-col :span="4">
                <span>是否多选</span>
              </el-col>
              <el-col :span="20">
                <el-switch
                  v-model="form.props.multiple"
                  :active-value="'custom'"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                >
                </el-switch>
              </el-col>
            </el-row>
          </el-form-item>
          <!-- <el-form-item>
            <el-button type="primary" @click="onSubmit">确定</el-button>
          </el-form-item> -->
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
        return []
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
    addComponent({ type, label }) {
      this.value.push({
        label: label || '标题',
        type: type,
        props: {
          placeholder: '请选择'
        },
        ...(type === 'select' ? { options: ['选项'] } : [])
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
    setProps(prop, val) {
      this.value[this.currentIndex][prop] = val
      this.$emit('change', this.value)
    },
    deleteSelectOption(index) {
      this.form.options.splice(index, 1)
      this.$emit('change', this.value)
    },
    addSelectOption() {
      this.form.options.push('选项')
      this.$emit('change', this.value)
    },
    onSubmit() {
      Object.assign(this.value[this.currentIndex], this.form)
      console.log(this.value)
      this.drawer = false
      this.$emit('change', this.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 36px;
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
.el-form-item__content {
  margin-left: 20px;
}
.option-btn {
  width: 83px;
  height: 28px;
  background: #fff;
  border-radius: 3px;
  border: 1px solid #6398ee;
  text-align: center;
  line-height: 28px;
  font-size: 12px;
  color: #6398ee;
  margin-top: 10px;
  cursor: pointer;
  margin-left: 100px;
}
.el-form-item__content {
  margin-left: 20px !important;
}
</style>
