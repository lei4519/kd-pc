<template>
  <div>
    <el-button type="text" @click="dialogVisible = true">视屏上传</el-button>
    <el-dialog  :title="title" :visible.sync="dialogVisible" width="30%" center>
      <div class="li-warp">
        <span class="marg30">视频名称</span>
        <div class="flex1">
          <el-input v-model="vidotitle" placeholder="请输入内容" style="width:250px"></el-input>
        </div>
      </div>
      <div class="li-warp">
        <span class="marg30">图片上传: </span> 
        <div class="flex1">
          <el-upload
          class="upload-demo"
          ref="imgUpload"
          action="https://res.leju.com"
          :limit=1
          :auto-upload="false"
          accept=".jpg,.jpeg,.png"
          :on-change="imgfilechange">
          <el-button slot="trigger" size="small" >选取文件</el-button>
          <span slot="tip" class="el-upload__tip margl10">支持格式：.jpg、.png</span>
        </el-upload>
        </div>
      </div>
      <div class="li-warp">
        <span class="marg30">视频上传:</span> 
        <div class="flex1">  
          <el-upload
          class="upload-demo"
          ref="elUpload"
          action="https://res.leju.com"
          :auto-upload="false"
          :limit=1
          accept=".mp4"
          :on-change="vidofilechange">
          <el-button slot="trigger" size="small">选取文件</el-button>
            <span slot="tip" class="el-upload__tip margl10">支持格式：.mp4</span>
          </el-upload>
        </div>
      </div>
      <div class="li-warp" style="margin-left:100px;">
          <el-button @click="uploadfn">开始上传</el-button>
          <el-progress :percentage="percentage" :text-inside="true" :stroke-width="14" status="success" style="flex:1;margin-left:10px;" v-show="ispertageshow"></el-progress>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogclosed">取 消</el-button>
        <el-button type="primary" @click="submitfn">确 定</el-button>
      </span>
  </el-dialog>
  </div>
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

import { uploadFile }from './upload_noui_online_v2.0.1.min.js'
import { Message } from 'element-ui';
Vue.use(Element)
export default Vue.extend({
  name: 'Upload',
  zhName: '上传组件',
  props: {
   dialogVisible:{
     type:Boolean,
     default:false
   },
   partner:{
     type:String,
     default:''
   },
   title:{
     type:String,
     default:''
   }
  },
  data() {
    return {
      vidotitle:'',
      resultobj:'',
      imgfile:'',
      vidofile:'',
      percentage:0,
      ispertageshow:false,
    }
  },
  methods: {
    dialogclosed(){
      this.vidotitle=''
      this.resultobj=''
      this.imgfile=''
      this.vidofile=''
      this.percentage=0
      this.ispertageshow = false
      this.$refs.imgUpload.clearFiles()
      this.$refs.elUpload.clearFiles()
      this.dialogVisible = false
    },
    submitfn(){
      this.vidotitle=''
      this.resultobj=''
      this.imgfile=''
      this.vidofile=''
      this.percentage=0
      this.ispertageshow = false
      this.$refs.imgUpload.clearFiles()
      this.$refs.elUpload.clearFiles()
      this.callback(this.resultobj)
      this.dialogVisible = false
    },
    imgfilechange(file,fileList){
      const extension = file.name.split('.')[1]
      const extensionList = ["jpg",'jpeg','png']
      if (fileList.length > 1) {
        fileList.splice(0, 1)
      }
      if(extensionList.indexOf(extension) < 0){
        this.$message({
          message:'视频格式错误',
          type:'error'  
        });
        return
      }
      this.imgfile = file
    },
    vidofilechange(file,fileList){
      const extension = file.name.split('.')[1]
      const extensionList = ["mp4"]
      if (fileList.length > 1) {
        fileList.splice(0, 1)
      }
      if(extensionList.indexOf(extension) < 0){
        this.$message({
          message:'视频格式错误',
          type:'error'  
        });
        return
      }
      this.vidofile = file
    },
    uploadfn(){
      if(!this.vidotitle.trim()){
        this.$message({
          message:'视频名称不能为空',
          type:'error'
        })
        return
      }
      if(!this.imgfile){
        this.$message({
          message:'图片不能为空',
          type:'error'
        })
        return
      }
      if(!this.vidofile){
        this.$message({
          message:'视频不能为空',
          type:'error'
        })
        return
      }
      console.log(uploadFile)
      const	uploadObj	=	new	uploadFile({
            partner:	this.partner,//业务⽅id
            videoFile:	this.vidofile.raw,
            coverFile:this.imgfile.raw,
            title:	this.vidotitle,
            success: (retJson)	=> {
                console.log('aaaa',retJson);
               this.$message({
                message:'上传成功',
                type:'success'  
              });
              this.resultobj = retJson
            },
            process:	(result)	=> {
                //定义上传进度回调⽅法
                this.ispertageshow= true
                this.percentage = parseFloat(result)
            },
            fail:	(result)	=> {
                //上传失败回调
                console.log(result);
            }
      }).upload()
    }
  }
})
</script>
<style lang="scss" scoped>
.li-warp {
  display: flex;
  justify-content: center;
  align-items: baseline;
  margin-bottom:20px;
  .marg30{
    margin-right: 30px;
    width: 30%;
    text-align: right;
  }
  .margl10{
    margin-left: 10px;;
  }
  .flex1{
    flex:1
  }
}:last-child{
  margin-bottom: 0;
}
</style>