<template>
   <el-select
  ref="selectCity"
  v-model="city"
  :filterable="filterable"
  collapse-tags
  clearable
  :multiple="multiple"
  :placeholder="placeholder" 
  @change="cityChange"
  style="width:100%"
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
    }
  },
  watch:{
    city(newVal, oldVal) {
      if ( newVal.includes(this.cityall) && this.multiple) {
          this.multiple = false
          this.city = this.cityall
        } else if (!newVal.includes(this.cityall) && !this.multiple) {
          // 多选情况下，没有全部选项，开启多选功能
          this.multiple = true
           this.city = [newVal]
        }
    }
  },
  methods: {
    cityChange(){
      this.callback(this.city)
    }
  } 
})
</script>

