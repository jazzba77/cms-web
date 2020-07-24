<template>
  <el-container>
    <my-aside>
      <template #menu-item>
        <el-menu-item index="/content/banner">
          <i class="el-icon-picture-outline"></i>
          <span slot="title">广告管理</span>
        </el-menu-item>
        <el-menu-item index="/content/notice">
          <i class="el-icon-bell"></i>
          <span slot="title">公告管理</span>
        </el-menu-item>
        <el-submenu index="goodsMenu">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span slot="title">商品管理 </span>
          </template>
          <el-menu-item index="/content/category">
            <i class="el-icon-s-grid"></i>
            <span slot="title">商品分类</span></el-menu-item
          >
        </el-submenu>
      </template>
    </my-aside>
    <el-main>
      <nuxt-child></nuxt-child>
    </el-main>
  </el-container>
</template>

<script>
import myAside from '~/components/myAside.vue'

export default {
  components: {
    myAside,
  },
  data() {
    return {}
  },
  methods: {},
}
</script>

<style scoped lang="scss">
.el-aside {
  width: 200px;
}
</style>
