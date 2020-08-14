<template>
  <div class="container">
    <el-card>
      <el-page-header :content="row._id ? '编辑' : '添加'" @back="goBack">
      </el-page-header>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form
            ref="rowForm"
            :model="row"
            :rules="rules"
            label-width="100px"
            @submit.native.prevent
          >
            <el-form-item label="标题">
              <el-row type="flex" justify="space-between" align="middle">
                <el-input v-model="row.title"></el-input
                ><el-button
                  class="btn-connect"
                  type="success"
                  round
                  icon="el-icon-connection"
                  size="mini"
                  @click="connect()"
                  >关联</el-button
                >
              </el-row>
            </el-form-item>
            <el-form-item label="图片">
              <el-upload
                v-loading="loading"
                class="uploader"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :http-request="uploadSuccess"
                action=""
              >
                <el-image
                  v-if="
                    !loading && row.img_url && row.img_url.startsWith('http://')
                  "
                  :src="row.img_url"
                  fit="cover"
                />
                <CloudFile
                  v-else-if="
                    !loading &&
                    row.img_url &&
                    row.img_url.startsWith('cloud://')
                  "
                  :id="row.img_url"
                  v-slot="{ url }"
                >
                  <el-image :src="url" fit="cover" />
                </CloudFile>
                <i v-else class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="图片链接" prop="img_url">
              <el-input
                v-model="row.img_url"
                type="textarea"
                autosize
              ></el-input>
            </el-form-item>
            <el-form-item label="关联链接" prop="url">
              <el-input v-model="row.url" type="textarea" autosize></el-input>
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
              <el-button
                type="primary"
                native-type="submit"
                @click="submitForm('rowForm')"
                >确定</el-button
              >
              <el-button type="primary" plain @click="goBack">取消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <transition name="el-zoom-in-top">
            <el-card v-if="showTable" class="table-connect">
              <div slot="header">
                <span>商品列表</span>
              </div>
              <el-row>
                <el-col :span="12">
                  <el-input
                    v-model="keyword"
                    placeholder="请输入关键字"
                    prefix-icon="el-icon-search"
                    @change="keywordChange"
                  >
                  </el-input
                ></el-col>
              </el-row>

              <el-table
                :data="tableData"
                highlight-current-row
                stripe
                :row-key="getRowKey"
                @current-change="currentRowChange"
              >
                <el-table-column
                  type="index"
                  :index="reIndex"
                  label="#"
                  width="50"
                >
                </el-table-column>
                <el-table-column prop="name" label="标题" width="250">
                </el-table-column>
                <el-table-column prop="list_pic_url" label="图片" width="120">
                  <template slot-scope="scope">
                    <!-- <el-image :src="scope.row.img_url" fit="cover" /> -->
                    <el-image
                      v-if="
                        scope.row.list_pic_url &&
                        scope.row.list_pic_url.startsWith('http://')
                      "
                      :src="scope.row.list_pic_url"
                      fit="cover"
                    />
                    <CloudFile
                      v-else-if="
                        scope.row.list_pic_url &&
                        scope.row.list_pic_url.startsWith('cloud://')
                      "
                      :id="scope.row.list_pic_url"
                      v-slot="{ url }"
                    >
                      <el-image :src="url" fit="cover" />
                    </CloudFile>
                  </template>
                </el-table-column>
                <el-table-column label="选择" width="50" align="center">
                  <template slot-scope="scope">
                    <i
                      class="el-icon-success"
                      :class="
                        currentRow && scope.row._id === currentRow._id
                          ? 'i-checked'
                          : ''
                      "
                    ></i>
                  </template>
                </el-table-column>
              </el-table>
              <el-row type="flex" justify="center">
                <el-pagination
                  :current-page="currentPage"
                  layout="prev, pager, next"
                  @current-change="currentPageChange"
                >
                </el-pagination>
              </el-row>
            </el-card>
          </transition>
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
      return {
        row: {
          title: '',
          url: '',
          img_url: '',
          sort_order: 1,
          enabled: 0,
          is_delete: 0,
        },
      }
    }
  },
  data() {
    return {
      currentPage: 1,
      currentRow: null,
      pageSize: 5,
      loading: false,
      keyword: '',
      fileList: [],
      rules: {
        url: [{ required: true, message: '请输入关联链接', trigger: 'blur' }],
        img_url: [
          { required: true, message: '请输入图片链接', trigger: 'blur' },
        ],
      },
      showTable: false,
      tableData: [],
    }
  },

  beforeDestroy() {
    // console.log('beforeDestroy:', this.fileList)
    if (this.fileList.length > 0) {
      this.$deleteFile(this.fileList)
    }
  },

  methods: {
    keywordChange() {
      this.currentPage = 1
      this.getTableData()
    },
    reIndex(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1
    },

    currentPageChange(currentPage) {
      this.currentPage = currentPage
      this.getTableData()
    },

    currentRowChange(currentRow) {
      this.currentRow = currentRow
      this.row.title = currentRow.name
      this.row.img_url = currentRow.list_pic_url
      this.row.url = '/pages/goods/goods?id=' + currentRow.id
      // this.$forceUpdate()
    },

    getRowKey(row) {
      return row._id
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveRow()
        }
      })
    },

    check(row) {
      row.checked = !row.checked
      if (row.checked) {
        this.row.title = row.name
        this.row.img_url = row.list_pic_url
        this.row.url = '/pages/goods/goods?id=' + row.id
      }
    },

    connect() {
      this.showTable = !this.showTable
      this.currentPage = 1
      if (this.showTable) {
        this.getTableData()
      }
    },

    getTableData() {
      this.$callFunction({
        $url: 'goods/get',
        data: {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          keyword: this.keyword,
        },
      }).then((res) => {
        this.tableData = res
      })
    },

    saveRow() {
      let action, msg

      if (this.row._id) {
        action = 'update'
        msg = '更新成功！'
      } else {
        action = 'add'
        msg = '添加成功！'
      }

      this.$callFunction({
        $url: 'banner/' + action,
        data: this.row,
      })
        .then(() => {
          this.$message.success(msg)
          this.fileList = this.fileList.filter((item) => {
            return item !== this.row.img_url
          })
          this.$router.back()
        })
        .catch((err) => {
          this.$message.error(err)
        })
    },

    goBack() {
      this.$router.back()
    },

    beforeUpload(file) {
      const isIMG = [
        'image/jpeg',
        'image/png',
        'image/bmp',
        'image/gif',
      ].includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isIMG) {
        this.$message.error('上传头像图片只能是 JPG、BMP、GIF 或 PNG 格式!')
        return isIMG
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return isLt2M
      }
      this.loading = true
      return true
    },
    uploadSuccess(file) {
      return this.$uploadFile(file, 'shop/banner').then((res) => {
        // console.log('res', res)
        this.row.img_url = res.fileID
        this.fileList.push(res.fileID)
        this.loading = false
        // this.$forceUpdate()
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

// .table-connect {
//   height: 560px;
// }

.btn-connect {
  margin-left: 20px;
}

.el-table {
  width: 100%;
  .el-image {
    width: 80px;
    height: 40px;
  }
  i {
    font-size: 20px;
    color: #8c939d;
    cursor: pointer;
  }
  .i-checked {
    color: #409eff;
  }
}
</style>
