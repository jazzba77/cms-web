<template>
  <div class="container">
    <el-card>
      <el-page-header
        :content="$route.query.action === 'edit' ? '编辑' : '添加'"
        @back="goBack"
      >
      </el-page-header>
      <el-row>
        <el-col :span="12">
          <el-form
            ref="rowForm"
            :model="row"
            :rules="rules"
            label-width="100px"
            @submit.native.prevent
          >
            <el-form-item label="标题" prop="title">
              <el-input v-model="row.title"></el-input>
            </el-form-item>
            <el-form-item label="关联链接" prop="url">
              <el-input v-model="row.url"></el-input>
            </el-form-item>
            <el-form-item label="启用状态" prop="url">
              <el-switch
                v-model="row.enabled"
                :active-value="1"
                :inactive-value="0"
              >
              </el-switch>
            </el-form-item>
            <el-form-item label="排序" prop="url">
              <el-input-number
                v-model="row.sort_order"
                controls-position="right"
                :min="1"
                :max="99"
                size="small"
              ></el-input-number>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" native-type="submit">确定</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      row: { sort_order: 1, enabled: 0 },
      rules: {
        url: [{ required: true, message: '请输入关联链接', trigger: 'blur' }],
      },
    }
  },
  created() {
    if (this.$route.params.id !== 'new') {
      this.row = this.$route.params.row
    }
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
