<template>
  <el-container>
    <el-header>
      <el-row type="flex" justify="space-between">
        <el-col class="logo" :span="5">
          <el-image src="/image/logo-w.png" fit="contain" />
          <span>内容管理系统</span></el-col
        >
        <el-col :span="16">
          <!-- <el-menu
            :default-active="'/' + $route.path.split('/')[1]"
            background-color="#352f33"
            text-color="#ffffff"
            mode="horizontal"
            active-text-color="#409EFF"
            @select="menuSelect"
          >
            <el-menu-item index="/content">内容管理</el-menu-item>
            <el-menu-item index="/meta">数据管理</el-menu-item>
            <el-menu-item index="/report">统计报表</el-menu-item>
            <el-menu-item index="/admin">系统管理</el-menu-item>
            <el-menu-item index="/about">关于</el-menu-item>
          </el-menu> -->
        </el-col>
        <el-col class="logout" :span="3">
          <el-dropdown @command="handleCommand">
            <span class="username">
              <i class="el-icon-user"></i> {{ $store.state.user.username }}
              <i class="el-icon-arrow-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-header>
    <nuxt />
  </el-container>
</template>

<script>
export default {
  data() {
    return {}
  },

  methods: {
    handleCommand(command) {
      if (command === 'logout') {
        this.$cookie.remove('token')
        this.$router.push('/login')
      }
    },
    menuSelect(index) {
      this.$router.push(index)
    },
  },
}
</script>

<style scoped lang="scss">
.el-header {
  background-color: #352f33;
  color: white;
  box-shadow: 0 2px 2px gray;

  .logo {
    display: flex;
    align-items: center;
    .el-image {
      width: 50px;
      height: 50px;
      margin-right: 10px;
    }
    span {
      line-height: 60px;
      font-size: 24px;
      font-weight: bold;
    }
  }

  .el-menu.el-menu--horizontal {
    border-bottom: none;
  }

  .el-menu-item {
    font-size: 16px;
  }
  .logout {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 60px;
    .username {
      cursor: pointer;
      color: white;
      .el-icon-user {
        font-size: 20px;
        &:hover {
          color: #409eff;
        }
      }
    }
  }
}

.el-dropdown-menu {
  min-width: 80px;
  text-align: center;
}
</style>
