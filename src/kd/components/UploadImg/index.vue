<template>
  <div class="UploadImg-wrapper">
    <el-upload
      ref="bgiUpload"
      action="#"
      :show-file-list="false"
      :disabled="!multiple && !!singleUrl"
      :auto-upload="false"
      :multiple="false"
      :accept="acceptType"
      :on-change="onFileChange"
      :on-remove="onMultipleFileRemove"
    >
      <template v-if="!multiple">
        <transition
          enter-active-class="animate__animated animate__fadeIn"
          leave-active-class="animate__animated animate__fadeOut"
        >
          <div
            v-show="singleUrl"
            class="upload-img single"
            :style="{ width: w, height: h }"
            @click.stop
          >
            <img :src="singleUrl" v-show="singleUrl" />
            <div class="mask">
              <i class="el-icon-delete" @click.stop="onSingleFileRemove"></i>
            </div>
          </div>
        </transition>
        <div class="upload-card" :style="{ width: w, height: h }">
          <i class="el-icon-plus"></i>
        </div>
      </template>
      <template v-else>
        <transition-group
          tag="div"
          class="file-list"
          enter-active-class="animate__animated animate__fadeIn"
          leave-active-class="animate__animated animate__fadeOut"
        >
          <div
            v-for="(item, i) in multipleUrls"
            :key="'img' + i"
            class="upload-img"
            :style="{ width: w, height: h }"
            @click.stop
          >
            <img :src="item" />
            <div class="mask">
              <i
                class="el-icon-delete"
                @click.stop="onMultipleFileRemove(item)"
              ></i>
            </div>
          </div>
          <div
            key="upload-card"
            class="upload-card"
            :style="{ width: w, height: h }"
          >
            <i class="el-icon-plus"></i>
          </div>
        </transition-group>
      </template>
      <div class="mt-8" style="color: #aaa" slot="tip" v-if="tips">
        {{ tips }}
      </div>
    </el-upload>
    <el-dialog
      class="cropper-dialog"
      title="裁剪图片"
      :show-close="false"
      :visible="cropperShow"
      append-to-body
    >
      <div class="cropper-box">
        <vueCropper
          ref="cropper"
          :img="cropperUrl"
          :outputType="outputType"
          autoCrop
          centerBox
          autoCropWidth="2000"
          autoCropHeight="2000"
          @realTime="realTime"
        />
        <div class="preview-box">
          <div class="show-preview" :style="previews.previewWrapStyle">
            <div :style="previews.div">
              <img :src="cropperUrl" :style="previews.img" />
            </div>
          </div>
          <!-- <div class="rotate-wrap">
            <IconFont
              class="left-rotate csp hover-color"
              type="zuoxuanzhuan"
              size="50"
              @click.native="rotate(-90)"
            />
            <IconFont
              class="right-rotate csp hover-color"
              type="youxuanzhuan"
              size="50"
              @click.native="rotate(90)"
            />
          </div> -->
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onCancelCropper">取 消</el-button>
        <el-button type="primary" @click="onCropper">裁 剪</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
/**
 * @description 图片剪裁上传
 * @property value v-model 值，多选时传入url数组，单选时传入url字符串
 * @property multiple 是否可以上传多张图片 (⚠️这个不是指用户选择文件时可以多选)
 * @property width 组件宽度
 * @property height 组件高度
 * @property accept 接受的上传图片类型
 * @property tips 图片信息提示
 * @property maxSize 接受的上传图片的最大大小
 */
export default {
  name: 'UploadImg',
  components: {
    VueCropper
  },
  props: {
    value: {
      type: [Array, String],
      default() {
        return ''
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    width: {
      type: [String, Number],
      default: 120
    },
    height: {
      type: [String, Number],
      default: 120
    },
    accept: {
      type: Array,
      default() {
        return ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif']
      }
    },
    tips: {
      type: String,
      default: ''
    },
    maxSize: {
      type: Number,
      default: 1024 * 100000 // 1KB * 100000 = 100MB
    }
  },
  data() {
    return {
      singleUrl: '',
      multipleUrls: [],
      cropperUrl: '',
      cropperShow: false,
      outputType: 'jpeg',
      previews: {
        previewWrapStyle: null,
        div: {},
        img: {}
      }
    }
  },
  computed: {
    w() {
      return parseFloat(this.width) + 'px'
    },
    h() {
      return parseFloat(this.height) + 'px'
    },
    acceptType() {
      return this.accept.join()
    }
  },
  watch: {
    value: {
      handler(v) {
        this.normalValue(v)
      },
      immediate: true
    }
  },
  created() {
    this.mkey = 'J520630085636361'
    this.pkey = 'ca8400249d9f532dac753df40c043ecd'
  },
  beforeDestroy() {
    this.$refs.bgiUpload.clearFiles()
  },
  methods: {
    normalValue(v) {
      if (this.multiple) {
        if (this.multipleUrls !== v) {
          this.multipleUrls = v
        }
      } else {
        if (this.singleUrl !== v) {
          this.singleUrl = Array.isArray(v) ? v[0] || '' : v
        }
      }
    },
    onFileChange(file) {
      if (this.maxSize < file.size) {
        return this.$notify.error({
          title: '图片大小超出限制',
          message: `图片大小不能超过${this.formatSize(
            this.maxSize
          )}，当前图片大小：${this.formatSize(file.size)}`
        })
      }
      const ext = file.name.split('.').pop()
      if (!this.acceptType.includes(ext)) {
        return this.$notify.error({
          title: '图片类型错误',
          message: `只支持上传${this.accept.join(
            ' '
          )}类型图片，当前图片类型：.${ext}`
        })
      }
      const reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = () => {
        this.cropperUrl = reader.result
        this.cropperShow = true
        this.fileName = file.name
        this.outputType = ext === 'jpg' ? 'jpeg' : ext
      }
    },
    onMultipleFileRemove(url) {
      this.multipleUrls.splice(
        this.multipleUrls.findIndex(u => u === url),
        1
      )
      this.$emit('input', this.multipleUrls)
      this.$emit('change', this.multipleUrls)
    },
    onSingleFileRemove() {
      this.singleUrl = ''
      this.$emit('input', '')
      this.$emit('change', '')
    },
    onCropper() {
      if (this.uploadFlag) return
      this.uploadFlag = true
      const loading = this.$message.info('图片上传中...')
      this.$refs.cropper.getCropData(async data => {
        try {
          const {
            data: { code, msg }
          } = await this.upload(data)
          if (code !== 100) {
            return this.$message.error(msg)
          }
          const [{ furl }] = msg
          if (this.multiple) {
            this.multipleUrls.push(furl)
            this.$emit('input', this.multipleUrls)
            this.$emit('change', this.multipleUrls)
          } else {
            this.singleUrl = furl
            this.$emit('input', this.singleUrl)
            this.$emit('change', this.singleUrl)
          }
          loading.close()
          this.$message.success('上传成功')
          this.onCancelCropper()
        } catch {
          loading.close()
          this.$message.error('上传失败，请重试')
        }
        this.uploadFlag = false
      })
    },
    onCancelCropper() {
      this.cropperUrl = ''
      this.fileName = ''
      this.cropperShow = false
      this.outputType = 'jpeg'
    },
    upload(data) {
      return this.$ajax({
        url: 'http://open-yun.leju.com/openapi/v1/resource/upload',
        method: 'POST',
        headers: {
          'x-requested-with': 'XMLHttpRequest'
        },
        formData: {
          filedata: [data],
          filename: [this.fileName],
          XM: this.mkey,
          XP: this.pkey
        }
      })
    },
    realTime({ img, div, w, h }) {
      this.previews.previewWrapStyle = {
        width: w + 'px',
        height: h + 'px',
        overflow: 'hidden',
        zoom: 200 / w
      }
      this.previews.div = div
      this.previews.img = img
    },
    rotate(deg) {
      deg > 0
        ? this.$refs.cropper.rotateRight()
        : this.$refs.cropper.rotateLeft()
    },
    formatSize(size) {
      const kb = (size / 1024) | 0
      return kb < 1024 ? kb + 'KB' : ((kb / 1024) | 0) + 'MB'
    }
  }
}
</script>

<style lang="scss" scoped>
.file-list {
  display: flex;
  flex-wrap: wrap;
  margin: -8px;
  .upload-card {
    margin: 8px;
  }
}
.upload-img {
  position: relative;
  margin: 8px;
  transition: all $duration;
  &.single {
    position: absolute;
    z-index: 1;
    margin: 0;
  }
  img {
    height: 100%;
    width: 100%;
    border-radius: 6px;
  }
  &:hover .mask {
    opacity: 1;
  }
  .mask {
    transition: opacity $duration;
    opacity: 0;
    position: absolute;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    right: 0;
    left: 0;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    cursor: pointer;
    .el-icon-delete {
      transition: all $duration;
      color: #fff;
      &:hover {
        transform: scale(1.2);
      }
    }
  }
}
.upload-card {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  border: 1px dashed;
  border-radius: 6px;
  color: #c0ccda;
  transition: all $duration;
  &:hover {
    color: $theme-color;
  }
}
.cropper-dialog {
  /deep/ .el-dialog {
    width: 60% !important;
    height: 80vh;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto !important;
    .el-dialog__body {
      height: calc(80vh - 150px);
    }
  }
  .cropper-box {
    width: 100%;
    height: 100%;
    display: flex;
    .preview-box {
      position: relative;
      margin-left: 16px;
      flex: 0 0 200px;
      .rotate-wrap {
        position: absolute;
        bottom: 16px;
        width: 100%;
        display: flex;
        justify-content: space-around;
      }
    }
  }
}
</style>
