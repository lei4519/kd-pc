<template>
  <el-form
    ref="form"
    class="edit-props-form-wrapper"
    label-width="0"
    size="small"
  >
    <el-form-item
      v-for="(item, i) in list"
      :key="i"
      :prop="item.prop"
      v-bind="item.formItemProps"
    >
      <span slot="label" v-if="item.label || item.tips">
        {{ item.label }}
        <template v-if="item.tips">
          <template v-if="typeof item.tips === 'string'">
            <el-tooltip effect="dark" :content="item.tips" placement="top">
              <i class="el-icon-info"></i>
            </el-tooltip>
          </template>
          <template v-else>
            <i
              class="el-icon-info hover csp"
              @click="showDialog(item.prop)"
            ></i>
            <el-dialog
              :title="item.label"
              :visible.sync="dialogVisibles[item.prop]"
              custom-class="editprop-help-dialog"
              append-to-body
            >
              <template v-if="typeof item.tips === 'string'">
                {{ item.tips }}
              </template>
              <template v-else>
                <Expand :render="item.tips" :props="item" />
              </template>
            </el-dialog>
          </template>
        </template>
      </span>
      <el-input
        v-if="item.type === 'input'"
        v-model="form[item.prop]"
        @change="setElementProps(i, item.prop, ...arguments)"
      >
      </el-input>
      <div class="dataSource" v-else-if="item.type === 'dataSource'">
        <el-select v-model="form.dataSourceType">
          <el-option label="自定义" :value="1"> </el-option>
          <el-option label="数据源" :value="2" disabled> </el-option>
        </el-select>
        <el-input
          v-model="form[item.prop]"
          @change="setElementProps(i, item.prop, ...arguments)"
        ></el-input>
      </div>
      <el-input-number
        v-else-if="item.type === 'inputNumber'"
        controls-position="right"
        v-model="form[item.prop]"
        @change="setElementProps(i, item.prop, ...arguments)"
      >
      </el-input-number>
      <el-radio-group
        v-else-if="item.type === 'radio'"
        v-model="form[item.prop]"
        @change="setElementProps(i, item.prop, ...arguments)"
      >
        <el-radio
          v-for="opt in item.options"
          :key="opt.value"
          :label="opt.value"
          >{{ opt.label }}</el-radio
        >
      </el-radio-group>
      <el-select
        v-else-if="item.type === 'select'"
        v-model="form[item.prop]"
        @change="setElementProps(i, item.prop, ...arguments)"
      >
        <el-option
          v-for="opt in item.options"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        >
        </el-option>
      </el-select>
      <el-switch
        v-else-if="item.type === 'switch'"
        v-model="form[item.prop]"
        @change="setElementProps(i, item.prop, ...arguments)"
      >
      </el-switch>
      <el-slider
        v-else-if="item.type === 'slider'"
        v-model="form[item.prop]"
        v-bind="item.formCompProps"
        @change="setElementProps(i, item.prop, ...arguments)"
      >
      </el-slider>
      <component
        v-else-if="item.custom"
        :is="item.component"
        v-model="form[item.prop]"
        @change="setElementProps(i, item.prop, ...arguments)"
      ></component>
    </el-form-item>
  </el-form>
</template>

<script>
import Expand from './Expand'

export default {
  name: 'EditPropForm',
  components: {
    Expand
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    element: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      form: {},
      dialogVisibles: {}
    }
  },
  created() {
    this.initForm()
  },
  methods: {
    initForm() {
      // 受控表单 需要以下处理
      this.form = this.list.reduce(
        (form, { prop, defaultValue }) => {
          form[prop] = this.element.props[prop] || defaultValue
          // 控制dialog显示
          this.$set(this.dialogVisibles, prop, false)
          return form
        },
        { dataSourceType: 1 }
      )
    },
    showDialog(prop) {
      this.dialogVisibles[prop] = true
    },
    setElementProps(index, prop, value) {
      const item = this.list[index]
      if (typeof item.formatValue === 'function') {
        value = item.formatValue(value)
      }
      this.element.setProps({
        [prop]: value
      })
    }
  }
}
</script>

<style lang="scss">
.edit-props-form-wrapper {
  .el-form-item {
    display: flex;
    margin: 0;
    + .el-form-item {
      margin-top: 8px;
    }
    .el-form-item__label {
      width: auto !important;
    }
    .el-form-item__content {
      flex: 1;
      .el-select {
        width: 100%;
      }
      .el-slider {
        margin: 0 10px 0 8px;
      }
    }
    .dataSource {
      display: flex;
      .el-select {
        flex: 0 0 86px;
        margin-right: 4px;
      }
    }
    .el-icon-info {
      &.hover:hover {
        color: $theme-color;
      }
    }
  }
}
.editprop-help-dialog {
  .el-dialog__header {
    padding: 16px;
    border-bottom: 1px solid #ddd;
  }
  .el-dialog__body {
    padding: 16px;
  }
}
</style>
