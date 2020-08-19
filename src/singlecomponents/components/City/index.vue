<template>
   <el-select
  ref="selectCity"
  v-model="city"
  :filterable="filterable"
  collapse-tags
  clearable
  :multiple="multiple"
  :placeholder="placeholder" 
  style="width:100%;height:100%"
  >
    <el-option
      v-for="(label, value) in  (list || data)"
      :key="value"
      :label="label"
      :value="value">
    </el-option>
  </el-select>
</template>

<script>
/*
* 打包时去掉 html页面引入地址
*/
import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import { stringify } from 'uuid';
import { isString, isArray } from 'lodash'
Vue.use(Element)
export default Vue.extend({
  name: 'City',
  zhName: '城市组件',
  props: {
    cityall:{
      type:String,
      default:'all'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    filterable:{
      type:Boolean,
      default:true
    },
    choosevalue:{
      type:String,
      default:''
    },
    placeholder:{
      type:String,
      default:'请选择'
    },
    data: {
      type: Object,
      default() {
        return null
      }
    },

  },
  data() {
    return {
      list:null,
      city: '',
      ismultiple:'',
    }
  },
  mounted(){
    this.ismultiple = this.multiple
    this.city = this.ismultiple ? this.choosevalue.split(','):this.choosevalue
  },
  watch:{
    city(newVal, oldVal) {
      if (isString(newVal) && isArray(oldVal) && newVal === oldVal.join()) {
        return
      }
      if (isString(oldVal) && isArray(newVal) && oldVal === newVal.join()) {
        return
      }
      if (Array.isArray(newVal)) {
        // 多选情况下 选择了全部，只保留全部选项，关闭多选功能
        if (newVal.includes(this.cityall) && this.multiple) {
          this.multiple = false
          this.city = this.cityall
          this.$refs.selectCity.blur()
        } else if (!newVal.includes(this.cityall) && !this.multiple) {
          // 多选情况下，没有全部选项，开启多选功能
          this.multiple = true
          this.city = newVal
        }
      } else {
        // 单选
        if (newVal === this.cityall) {
          // 选择的是全部 关闭多选功能
          if (this.multiple) {
            this.multiple = false
          }
        } else{
          // 否则开启全部功能，将val置为数组
          if(this.ismultiple){

            if (!this.multiple) {
              this.multiple = true
            }
            this.city = [newVal]
          }
        }
      }
      this.callback(this.city)
    }
  },
  methods: {
    cityChange(){
      this.callback(this.city)
    }
  } 
})
</script>

