<template>
  <div class="container">
    <el-card>
      <el-page-header :content="row._id ? '编辑' : '添加'" @back="goBack">
      </el-page-header>
      <el-row>
        <el-col ref="rowForm" :span="12">
          <el-form
            :model="row"
            :rules="rules"
            label-width="100px"
            @submit.native.prevent
          >
            <el-form-item label="图片" prop="title">
              <el-upload
                class="uploader"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :http-request="uploadSuccess"
                action=""
              >
                <!-- <el-image v-if="row.img_url" :src="row.img_url" fit="cover" /> -->
                <CloudFile v-if="fileID !== ''" :id="fileID" v-slot="{ url }">
                  {{ url }}
                  <!-- <el-image :src="url" fit="cover" /> -->
                </CloudFile>
                <i v-if="fileID === ''" class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="标题" prop="title">
              <el-input v-model="row.title"></el-input>
            </el-form-item>
            <el-form-item label="关联链接" prop="url">
              <el-input v-model="row.url"></el-input>
            </el-form-item>
            <el-form-item label="启用状态">
              <el-switch
                v-model="row.enabled"
                :active-value="1"
                :inactive-value="0"
              >
              </el-switch>
            </el-form-item>
            <el-form-item label="排序">
              <el-input-number
                v-model="row.sort_order"
                controls-position="right"
                :min="1"
                :max="99"
                size="small"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="row.remark"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" native-type="submit">确定</el-button>
              <el-button type="primary" plain @click="goBack">取消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import utils from '~/utils/utils'

export default {
  asyncData({ params, req }) {
    // console.log('banner ', utils.getCookies(req, 'banner'))

    if (params.id !== 'new') {
      return { row: params.row || JSON.parse(utils.getCookies(req, 'banner')) }
    } else {
      return { row: { sort_order: 1, enabled: 0 } }
    }
  },
  data() {
    return {
      fileID: '',
      rules: {
        url: [{ required: true, message: '请输入关联链接', trigger: 'blur' }],
      },
    }
  },

  methods: {
    goBack() {
      this.$router.back()
    },
    beforeUpload(file) {
      const isIMG = ['image/jpeg', 'image/png'].includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isIMG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!')
        return isIMG
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return isLt2M
      }
      return true
    },
    uploadSuccess(file) {
      return this.$uploadFile(file, 'shop/banner').then((res) => {
        this.row.fileID = res.fileID
        this.fileID = res.fileID
        this.$forceUpdate()
      })
    },
  },
}
</script>

<style scoped lang="scss">
.container {
  padding: 20px;
}

.el-form {
  .uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    width: 320px;
    height: 170px;
    &:hover {
      border-color: #409eff;
    }
    .el-image {
      width: 300px;
      height: 150px;
      margin: 10px;
    }
    i {
      top: 0;
      font-size: 28px;
      color: #8c939d;
      text-align: center;
      width: 320px;
      height: 170px;
      line-height: 170px;
    }
  }
}
</style>
