<template>
  <div class="container">
    <div class="login-box">
      <div class="title">
        <el-image class="logo" src="/image/logo.png" fit="contain" />
        <h2>内容管理系统</h2>
      </div>
      <el-form
        ref="loginForm"
        class="form"
        :model="user"
        :rules="rules"
        @submit.native.prevent
      >
        <el-form-item prop="username">
          <el-input
            v-model="user.username"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="user.password"
            prefix-icon="el-icon-lock"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button
            type="primary"
            native-type="submit"
            @click="submitForm('loginForm')"
            >登录</el-button
          >
          <el-button @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import Cookie from 'js-cookie'

export default {
  layout: 'blank',
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            pattern: /^[a-z][\w]{2,7}$/,
            message: '用户名要求为3~8位的字母或数字，并以字母开始',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern: /^.*(?=.{6,12})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/,
            message:
              '密码要求为6～12位，包括至少1个大写字母、1个小写字母、1个数字和1个特殊字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.userLogin()
        } else {
        }
      })
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    userLogin() {
      this.$callFunction({
        $url: 'user/login',
        data: this.user,
      }).then((res) => {
        if (res) {
          this.user = res
          this.$cookie.set('token', JSON.stringify(this.user))
          this.$store.commit('setUser', this.user)
          this.$router.push('/')
        } else {
          this.$message.error('用户不存在或密码错误！')
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100vh;
  background-color: mix(#3b343b, #8d655d);
  background-image: url('../static/image/bg.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-box {
  width: 400px;
  margin-bottom: 200px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 15px 25px rgba(0, 0, 0, 0.5);
  .title {
    display: flex;
    flex-direction: column;
    align-items: center;
    .logo {
      width: 100px;
      height: 100px;
    }
  }
  .form {
    margin: 0 20px;
    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
