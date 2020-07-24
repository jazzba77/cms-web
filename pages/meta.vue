<template>
  <el-container>
    <my-aside>
      <template v-slot:menu-item>
        <el-menu-item index="/meta/collection">
          <span slot="title">数据集</span>
        </el-menu-item>
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

<style scoped lang="scss"></style>
