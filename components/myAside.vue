<template>
  <el-aside :width="asideWidth">
    <div class="aside-ctrl" @click="asideCtrl">|||</div>
    <el-menu
      :default-active="
        '/' + $route.path.split('/')[1] + '/' + $route.path.split('/')[2]
      "
      background-color="#535353"
      text-color="#fff"
      active-text-color="#409eff"
      :collapse="!asideShow"
      @select="menuSelect"
    >
      <slot name="menu-item" />
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  data() {
    return { asideWidth: '250px', asideShow: true }
  },
  methods: {
    asideCtrl() {
      this.asideShow = !this.asideShow
      this.asideWidth = this.asideShow ? '250px' : '64px'
    },

    menuSelect(index) {
      this.$router.push(index)
    },
  },
}
</script>

<style scoped lang="scss">
.el-aside {
  background-color: #535353;
  color: white;
  height: calc(100vh - 60px);
}

.el-menu {
  border-right: none;
}

.aside-ctrl {
  height: 25px;
  line-height: 20px;
  text-align: center;
  font-size: 18px;
  cursor: pointer;
  letter-spacing: 0.1em;
  color: white;
  background-color: #787878;
  &:hover {
    color: #409eff;
  }
}
</style>
