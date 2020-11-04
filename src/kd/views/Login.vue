<template>
  <div class="login-container">
    <div class="login-wrap">
      <!-- <div class="logo">乐居<b>商业BI</b></div> -->
      <img
        class="logo"
        src="https://media.src.leju.com/imp/imp/deal/a9/a5/8/76c08be58063f807a410f54837b_p122_mk169.svg"
        style="width: 3.4rem;
    height: 1rem;"
      />
      <div class="box-shadow">
        <div class="login-content">
          <div class="title-wrap">{{ title }}</div>
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="rules"
            class="login-form"
            autocomplete="on"
            label-position="top"
          >
            <div v-if="type">
              <el-form-item prop="mobile" class="input-box">
                <el-input
                  clearable
                  ref="mobile"
                  v-model="loginForm.mobile"
                  placeholder="请输入手机号"
                  name="mobile"
                  type="text"
                  autocomplete="on"
                >
                  <span class="svg-container" slot="prefix">
                    <icon-font type="phone" :size="20"></icon-font>
                  </span>
                </el-input>
              </el-form-item>

              <el-form-item prop="verifycode">
                <el-input
                  clearable
                  ref="verifycode"
                  class="verifycode"
                  v-model="loginForm.verifycode"
                  type="text"
                  placeholder="输入图形验证码"
                  name="verifycode"
                >
                  <span class="svg-container" slot="prefix">
                    <icon-font type="img-vcode" :size="20"></icon-font>
                  </span>
                </el-input>
                <div class="img-box">
                  <img :src="imgSrc" id="regf_codeimg" />
                  <i class="el-icon-refresh" @click="changeImg"></i>
                </div>
              </el-form-item>

              <el-form-item prop="code">
                <el-input
                  clearable
                  ref="code"
                  class="mobile-code"
                  v-model="loginForm.code"
                  type="text"
                  placeholder="输入手机验证码"
                  name="code"
                >
                  <span class="svg-container" slot="prefix">
                    <icon-font type="guard" :size="20"></icon-font>
                  </span>
                </el-input>
                <el-button
                  class="getcode-btn"
                  type="info"
                  :disabled="getCodeDisabled"
                  :style="{ color: countDown ? '#0298E1' : '' }"
                  @click.native.prevent="getCode"
                >
                  {{ countDown ? `${countDown}s可重发` : '获取验证码' }}
                </el-button>
              </el-form-item>
            </div>
            <div v-else>
              <el-form-item prop="username">
                <el-input
                  clearable
                  ref="username"
                  v-model="loginForm.username"
                  placeholder="请输入账号"
                  name="username"
                  type="text"
                  autocomplete="on"
                >
                  <span class="svg-container" slot="prefix">
                    <icon-font type="user" :size="20"></icon-font>
                  </span>
                </el-input>
              </el-form-item>

              <el-form-item prop="password">
                <el-input
                  clearable
                  :key="passwordType"
                  ref="password"
                  v-model="loginForm.password"
                  :type="passwordType"
                  show-password
                  placeholder="请输入密码"
                  name="password"
                  autocomplete="on"
                  @keyup.enter.native="handleLogin"
                >
                  <span class="svg-container" slot="prefix">
                    <icon-font type="unlock" :size="20"></icon-font>
                  </span>
                </el-input>
              </el-form-item>

              <el-form-item
                prop="verifycode"
                class="input-box"
                v-if="neededVerifycode"
              >
                <el-input
                  clearable
                  ref="verifycode"
                  v-model="loginForm.verifycode"
                  class="verifycode"
                  type="text"
                  placeholder="输入图形验证码"
                  name="verifycode"
                >
                  <span class="svg-container" slot="prefix">
                    <icon-font type="img-vcode" :size="20"></icon-font>
                  </span>
                </el-input>
                <div class="img-box">
                  <img :src="imgSrc" id="regf_codeimg" />
                  <i class="el-icon-refresh" @click="changeImg"></i>
                </div>
              </el-form-item>
            </div>
            <div class="login-btn-warp">
              <el-button
                size="medium"
                :loading="loading"
                type="primary"
                style="width:100%"
                @click.native.prevent="handleLogin"
              >
                登录
              </el-button>
            </div>
          </el-form>
        </div>
        <div class="login-type">
          <el-button type="text" @click="changeLoginTpye">{{
            toggleTitle
          }}</el-button>
        </div>
      </div>
    </div>
    <div class="copyright">
      Copyright © 1996-2020， All Rights Reserved
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      type: true,
      imgSrc: process.env.VUE_APP_LOGIN_API + '/api/user/getverifycode',
      loginForm: {
        username: '',
        password: '',
        mobile: '',
        verifycode: '',
        code: ''
      },
      passwordType: 'password',
      loading: false,
      redirect: undefined,
      otherQuery: {},
      countDown: 0,
      neededVerifycode: false
    }
  },
  computed: {
    title() {
      return this.type ? '手机号登录' : '账号登录'
    },
    toggleTitle() {
      return this.type ? '账号登录' : '手机号登录'
    },
    getCodeDisabled() {
      return this.countDown !== 0
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    this.rules = {
      mobile: [
        { required: true, message: '手机号不能为空!' },
        {
          validator: (rule, val, cb) => {
            this.mobileErrMsg ? cb(this.mobileErrMsg) : cb()
            this.mobileErrMsg = ''
          }
        }
      ],
      verifycode: [
        { required: true, message: '图形验证码不能为空!' },
        {
          validator: (rule, val, cb) => {
            this.verifycodeErrMsg ? cb(this.verifycodeErrMsg) : cb()
            this.verifycodeErrMsg = ''
          }
        }
      ],
      code: [
        { required: true, message: '手机验证码不能为空!' },
        {
          validator: (rule, val, cb) => {
            this.codeErrMsg ? cb(this.codeErrMsg) : cb()
            this.codeErrMsg = ''
          }
        }
      ],
      username: [
        { required: true, message: '账号不能为空!' },
        {
          validator: (rule, val, cb) => {
            this.usernameErrMsg ? cb(this.usernameErrMsg) : cb()
            this.usernameErrMsg = ''
          }
        }
      ],
      password: [
        { required: true, message: '密码不能为空!' },
        {
          validator: (rule, val, cb) => {
            this.passwordErrMsg ? cb(this.passwordErrMsg) : cb()
            this.passwordErrMsg = ''
          }
        }
      ]
    }
  },
  destroyed() {
    clearInterval(this.countDownTimer)
  },
  methods: {
    changeImg() {
      this.$refs.loginForm.clearValidate('verifycode')
      this.imgSrc =
        process.env.VUE_APP_LOGIN_API + '/api/user/getverifycode?' + +new Date()
    },
    countDownStart() {
      this.countDown = 59
      this.countDownTimer = setInterval(() => {
        this.countDown--
        if (this.countDown <= 0) {
          clearInterval(this.countDownTimer)
        }
      }, 1000)
    },
    getCode() {
      this.validateFields(['mobile', 'verifycode']).then(() => {
        this.$ajax
          .jsonp({
            url: `${process.env.VUE_APP_LOGIN_API}/api/user/send_login_code`,
            params: {
              mobile: this.loginForm.mobile,
              verifycode: this.loginForm.verifycode
            }
          })
          .then(res => {
            switch (res.code) {
              case 1000:
                this.countDownStart()
                this.verifycodeErrMsg = ''
                break
              case 2001:
                this.mobileErrMsg = res.msg
                this.validateFields('mobile')
                break
              case 2002:
                this.verifycodeErrMsg = res.msg
                this.changeImg()
                this.validateFields('verifycode')
                break
            }
          })
          .catch(err => {
            console.log(err)
          })
      })
    },
    changeLoginTpye() {
      this.$refs.loginForm.resetFields()
      this.type = !this.type
      this.changeImg()
    },
    handleLogin() {
      // eslint-disable-next-line no-unreachable
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              if (this.redirect) {
                this.$router.push({
                  path: this.redirect,
                  query: this.otherQuery
                })
              } else {
                this.$router.push(this.$route.meta.redirect)
              }
              this.loading = false
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .catch(({ msg = '', code, data, error }) => {
              if (error) {
                // 账号被停用
                this.$message.error(error)
              } else if (this.type) {
                // 手机号登录错误信息
                this.changeImg()
                this.codeErrMsg = msg
                this.validateFields('code')
              } else {
                // 账号登录错误信息
                if (msg.includes('账号不存在')) {
                  this.usernameErrMsg = msg
                  this.validateFields('username')
                } else if (msg.includes('密码错误')) {
                  this.passwordErrMsg = msg
                  this.validateFields('password')
                } else if (msg.includes('图形验证码有误')) {
                  this.verifycodeErrMsg = msg
                  this.changeImg()
                  this.validateFields('verifycode')
                } else {
                  this.usernameErrMsg = msg
                  this.validateFields('username')
                }
                // eslint-disable-next-line camelcase
                this.neededVerifycode = !!data?.is_needed_verifycode
              }
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    validateFields(props) {
      props = Array.isArray(props) ? props : [props]
      return Promise.all(
        props.map(prop => {
          return new Promise((resolve, reject) => {
            this.$refs.loginForm.validateField(prop, err => {
              if (err) {
                reject(err)
              } else {
                resolve()
              }
            })
          })
        })
      )
    }
  }
}
</script>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100vh;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  position: relative;
  background: url(https://src.leju.com/imp/imp/deal/31/d6/e/2f1bef5ed7e0d4a164d8b869ebb_p122_mk169.jpg)
    center / cover;
  ::v-deep .el-button {
    // height: 52px;
  }
  .login-wrap {
    width: 326px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    .logo {
      font-size: 50px;
      color: #fff;
      margin-bottom: 70px;
      font-weight: 200;
      b {
        font-weight: 700;
      }
    }
    .box-shadow {
      background-color: transparent;
      box-shadow: 0px 5px 9px 0px rgba(5, 23, 63, 1);
      border-radius: 7px 7px 0 0;
    }
    .login-content {
      padding: 30px;
      background-color: #fff;
      border-radius: 7px 7px 0 0;
      .title-wrap {
        font-size: 22px;
        color: #1a1a1a;
        margin-bottom: 20px;
      }
    }
    .login-type {
      height: 60px;
      line-height: 60px;
      background: rgba(240, 244, 247, 1);
      border-top: 1px solid rgba(224, 224, 224, 1);
      border-radius: 0px 0px 7px 7px;
      button {
        text-decoration: underline;
      }
    }
    .login-form {
      $height: 32px;
      width: 100%;
      overflow: hidden;
      ::v-deep .el-input__inner {
        // height: 52px;
        // line-height: 52px;
        // padding-left: 15px;
      }
      .mobile-code,
      .verifycode {
        width: calc(100% - 110px);
      }
      .getcode-btn {
        width: 100px;
        vertical-align: top;
        font-size: 14px;
        // padding: 12px 0;
        margin-left: 10px;
      }
      .img-box {
        display: inline-block;
        height: $height;
        width: 100px;
        margin-left: 10px;
        border-radius: 4px;
        vertical-align: top;
        margin-top: 1px;
        img {
          width: 74px;
          height: 100%;
        }
        .el-icon-refresh {
          font-size: 16px;
          margin-left: 10px;
          line-height: $height;
          vertical-align: top;
          cursor: pointer;
          &:hover {
            color: #409eff;
          }
        }
      }
      ::v-deep .el-form-item.is-error .svg-container {
        color: red;
      }
      .svg-container {
        font-size: 20px;
        width: 20px;
        height: 20px;
        line-height: 52px;
        margin-left: 15px;
      }
    }
  }
  .copyright {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
  }
  ::v-deep .el-form-item.is-error {
    margin-bottom: 47px;
    .el-form-item__error {
      padding-top: 10px;
    }
  }
}
.login-btn-warp {
  margin-top: 20px;
}
</style>
