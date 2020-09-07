<!--
 * @Author: zijian6@leju.com
 * @Date: 2020-08-21 11:21:35
 * @LastEditors: zijian6@leju.com
 * @LastEditTime: 2020-09-07 16:30:54
 * @FilePath: /res.leju.com/dev/mvvm-project/vue/kd-pc/src/pc/components/Form/form-editor.vue
-->
<template>
  <div>
    <div class="component-btn">
      <el-button
        v-for="(item, index) in components"
        :key="index"
        class="com-btn"
        plain
        @click="addComponent(item)"
      >{{item.name}}</el-button>
    </div>
    <div class="com-setting mt-12" v-if="value.length > 0">
      <h2 class="mb-8">组件配置</h2>
      <el-table :data="value" style="width: 100%">
        <el-table-column prop="name" label="组件名称" align="center" width="80"></el-table-column>
        <el-table-column prop="label" label="标题" show-overflow-tooltip align="center" width="100"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip
              class="ml-4 hover-color click-effect"
              effect="dark"
              content="删除"
              placement="top"
            >
              <el-button icon="el-icon-delete-solid" @click.native="deleteComponent(scope.$index)"></el-button>
            </el-tooltip>
            <el-tooltip
              class="ml-4 hover-color click-effect"
              effect="dark"
              content="编辑"
              placement="top"
            >
              <el-button icon="el-icon-edit" @click.native="editComponent(scope.$index)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div v-for="(item, index) in value" v-bind:key="index" class="mb-8">
        <el-button plain>{{item.label}}</el-button>
      </div>-->
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
        <el-form ref="form" :model="form" size="mini" :rules="rules">
          <el-form-item label="标题" prop="label">
            <el-input v-model="form.label" @change="setProps(form.label, ...arguments)"></el-input>
          </el-form-item>
          <el-form-item label="数据字段名" prop="props.dataField">
            <el-input
              v-model="form.props.dataField"
              @change="setProps(form.props.dataField, ...arguments)"
            ></el-input>
          </el-form-item>
          <el-form-item label="占位文本">
            <el-input
              v-model="form.props.placeholder"
              @change="setProps(form.props.placeholder, ...arguments)"
            ></el-input>
          </el-form-item>
          <el-form-item label="选项数据字段" v-if="currentType === 'select'">
            <el-input v-model="form.props.optionLabel" placeholder="label字段名" class="mr-4"></el-input>
            <el-input v-model="form.props.optionKey" placeholder="value字段名"></el-input>
          </el-form-item>
          <el-form-item label="数据来源" v-if="currentType === 'select'">
            <el-radio-group v-model="form.props.optionRadio">
              <el-radio label="1">自定义</el-radio>
              <el-radio label="2">接口请求</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            class="dataSource"
            label
            v-if="currentType === 'select' && form.props.optionRadio === '2'"
          >
            <el-select v-model="form.dataSourceType">
              <el-option label="自定义" :value="1"></el-option>
              <el-option label="数据源" :value="2" disabled></el-option>
            </el-select>
            <el-input v-model="form.url"></el-input>
            <el-tooltip
              class="csp ml-4 hover-color click-effect"
              effect="dark"
              content="发送请求"
              placement="top"
            >
              <IconFont type="zhihang" size="24" @click.native="fetchData" />
            </el-tooltip>
          </el-form-item>
          <el-form-item
            v-if="currentType === 'select' && form.props.optionRadio === '1'"
            label="选项"
          >
            <div>
              <div v-for="(option, index) in form.options" :key="index" class="select-option mb-4">
                <el-input
                  v-model="option[form.props.optionLabel]"
                  @change="setProps(form.options, ...arguments)"
                  placeholder="label值"
                  class="mr-4"
                ></el-input>
                <el-input
                  v-model="option[form.props.optionKey]"
                  @change="setProps(form.options, ...arguments)"
                  placeholder="value值"
                ></el-input>
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
              </div>
              <el-button class="option-btn" @click="addSelectOption">
                <i class="el-icon-plus"></i>增加选项
              </el-button>
            </div>
          </el-form-item>
          <!-- <el-tooltip effect="dark" :content="item.tips" placement="top">
            <i class="el-icon-info"></i>
          </el-tooltip>-->
          <el-form-item v-if="currentType === 'select' || currentType === 'cascader'" label="是否多选">
            <el-switch
              v-model="form.props.multiple"
              @change="setProps(form.props.multiple, ...arguments)"
            ></el-switch>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { isArray } from 'lodash'

export default {
  name: 'FormEditor',
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    }
  },
  inject: {
    asideLayout: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
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
        },
        {
          name: '时间选择器',
          type: 'datePicker'
        },
        {
          name: '级联选择器',
          type: 'cascader'
        }
      ],
      currentIndex: 0,
      rules: {
        'props.dataField': [
          { required: true, message: '请选择数据字段名', trigger: 'blur' }
        ],
        label: [{ required: true, message: '请选择标题', trigger: 'blur' }]
      }
    }
  },
  computed: {
    currentType () {
      return this.value[this.currentIndex]?.type || ''
    },
    direction () {
      return this.asideLayout.direction === 'left' ? 'rtl' : 'ltr'
    }
  },
  methods: {
    deleteComponent (index) {
      this.value.splice(index, 1)
      this.$emit('change', this.value)
    },
    editComponent (index) {
      console.log(index)
      this.currentIndex = index
      this.form = this.value[index]
      this.drawer = true
    },
    addComponent ({ type, label }) {
      if (type === 'input') {
        this.value.push({
          label: label || '标题',
          name: '输入框',
          type,
          props: {
            placeholder: '请选择',
            dataField: ''
          }
        })
      } else if (type === 'select') {
        this.value.push({
          label: label || '标题',
          name: '选择器',
          type,
          props: {
            placeholder: '请选择',
            dataField: '',
            optionLabel: 'label',
            optionKey: 'key',
            optionRadio: '1'
          },
          options: [],
          list: []
        })
      } else if (type === 'datePicker') {
        this.value.push({
          label: label || '标题',
          name: '日期选择器',
          type,
          props: {
            placeholder: '请选择',
            dataField: '',
            type: 'daterange',
            'start-placeholder': '开始日期',
            'end-placeholder': '结束日期'
          }
        })
      } else if (type === 'cascader') {
        this.value.push({
          label: label || '标题',
          name: '级联选择器',
          type,
          props: {
            placeholder: '请选择',
            dataField: ''
          },
          list: []
        })
      }
      this.$emit('change', this.value)
      this.currentIndex = this.value.length - 1
    },
    setProps (prop, val) {
      this.value[this.currentIndex][prop] = val
      this.$emit('change', this.value)
    },
    deleteSelectOption (index) {
      this.form.options.splice(index, 1)
      this.$emit('change', this.value)
    },
    addSelectOption () {
      this.form.options.push({
        [this.form.props.optionLabel]: '',
        [this.form.props.optionKey]: ''
      })
      this.$emit('change', this.value)
    },
    onSubmit () {
      Object.assign(this.value[this.currentIndex], this.form)
      console.log(this.value)
      this.drawer = false
      this.$emit('change', this.value)
    },
    fetchData (params = {}) {
      return this.$ajax({
        url: this.form.url,
        method: 'POST',
        params
      }).then(res => {
        if (res.status === 200) {
          const list = res.data.data
          this.form.list = []
          if (!isArray(list)) {
            for (const item in list) {
              const obj = {
                [this.form.props.optionKey]: item,
                [this.form.props.optionLabel]: list[item]
              }
              this.form.list.push(obj)
            }
          } else {
            this.form.list = list
          }
          this.$emit('change', this.value)
        }
      })
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
.el-form-item__content {
  margin-left: 20px !important;
}

.dataSource {
  display: flex;
  .el-select {
    flex: 0 0 86px;
    margin-right: 4px;
  }
  .el-input {
    flex: 1;
  }
}

.component-btn {
  display: flex;
  flex-wrap: wrap;
  .com-btn {
    margin-bottom: 10px;
  }
}
</style>
