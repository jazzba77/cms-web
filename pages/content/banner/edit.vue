<template>
  <div class="container">
    <el-card>
      <el-page-header @back="goBack"> </el-page-header>

      {{ row }}
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      row: null,
    }
  },
  created() {
    this.row = this.$route.query.row
  },
  methods: {
    goBack() {
      this.$router.back()
    },
  },
}
</script>

<style scoped lang="scss">
.container {
  padding: 20px;
}
</style>
