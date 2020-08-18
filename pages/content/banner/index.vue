<template>
  <div class="container">
    <el-row>
      <el-carousel trigger="click" height="300px">
        <el-carousel-item v-for="(item, index) in imageList" :key="index">
          <transition name="el-zoom-in-center">
            <el-image
              v-if="!loading && item.startsWith('http://')"
              :src="item"
              fit="cover"
            />
            <CloudFile
              v-else-if="!loading && item.startsWith('cloud://')"
              :id="item"
              v-slot="{ url }"
            >
              <el-image :src="url" fit="cover" />
            </CloudFile>
          </transition>
        </el-carousel-item>
      </el-carousel>
    </el-row>
    <el-row>
      <el-card>
        <el-row type="flex" justify="space-between">
          <el-col :span="4" :push="1">
            <el-row type="flex" justify="start">
              <el-input
                v-model="keyword"
                placeholder="请输入关键字"
                prefix-icon="el-icon-search"
                @change="keywordChange"
              >
              </el-input>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row type="flex" justify="end">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-plus"
                @click="goEdit()"
                >添加</el-button
              >
              <el-button
                plain
                type="primary"
                size="small"
                icon="el-icon-upload2"
                @click="dialogVisible = true"
                >导入</el-button
              >
              <el-button
                plain
                type="primary"
                size="small"
                icon="el-icon-download"
                @click="export2CSV"
                >导出</el-button
              >
              <el-button
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="remove(selection)"
                >删除</el-button
              >
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-table
            ref="elTable"
            :data="bannerList"
            highlight-current-row
            stripe
            :row-key="getRowKey"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" reserve-selection width="50">
            </el-table-column>
            <el-table-column type="index" :index="reIndex" label="#" width="50">
            </el-table-column>
            <el-table-column prop="title" label="标题" width="250">
            </el-table-column>
            <el-table-column prop="img_url" label="图片" width="120">
              <template slot-scope="scope">
                <!-- <el-image :src="scope.row.img_url" fit="cover" /> -->
                <el-image
                  v-if="
                    scope.row.img_url && scope.row.img_url.startsWith('http://')
                  "
                  :src="scope.row.img_url"
                  fit="cover"
                />
                <CloudFile
                  v-else-if="
                    scope.row.img_url &&
                    scope.row.img_url.startsWith('cloud://')
                  "
                  :id="scope.row.img_url"
                  v-slot="{ url }"
                >
                  <el-image :src="url" fit="cover" />
                </CloudFile>
              </template>
            </el-table-column>
            <el-table-column prop="url" label="关联链接" width="250">
            </el-table-column>
            <el-table-column prop="enabled" label="启用状态" width="80">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.enabled"
                  :active-value="1"
                  :inactive-value="0"
                  @change="enableRow(scope.row)"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column
              prop="sort_order"
              label="排序"
              sortable
              width="120"
            >
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.sort_order"
                  controls-position="right"
                  :min="1"
                  :max="99"
                  size="small"
                  @change="debouncedChangeSort(scope.row)"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注"> </el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="goEdit(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="remove([scope.row._id])"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row type="flex" justify="end">
          <el-pagination
            small
            :current-page="currentPage"
            :page-sizes="[10, 20, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </el-row>
      </el-card>
    </el-row>
    <el-dialog
      :visible.sync="dialogVisible"
      action=""
      center
      top="30vh"
      width="30%"
      @close="handleDialogClose"
      @open="handleDialogOpen"
    >
      <el-row type="flex" justify="center">
        <el-upload
          v-loading="loading"
          drag
          class="uploader"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :http-request="uploadSuccess"
          action=""
          :disabled="loaded"
        >
          <i class="el-icon-upload"></i>
          <div v-if="!loaded" class="el-upload__text">
            将文件拖到此处，或<em>点击选择待导入文件</em>
          </div>
          <div v-else class="el-upload__text">
            <div>已选择待导入文件</div>
            <div>{{ fileName }}</div>
          </div>
        </el-upload>
      </el-row>
      <el-row type="flex" justify="center">
        <el-radio v-model="importType" label="1">覆盖</el-radio>
        <el-radio v-model="importType" label="2">追加</el-radio>
      </el-row>
      <span slot="footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button
          size="mini"
          :disabled="!loaded"
          type="primary"
          @click="import2Db"
          >导 入</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import utils from '~/utils/utils'

export default {
  data() {
    return {
      bannerList: [],
      imageList: [],
      selection: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      keyword: '',
      dialogVisible: false,
      fileList: [],
      fileName: '',
      loading: false,
      loaded: false,
      importType: '1',
      tableName: 'shop_banner',
    }
  },
  mounted() {
    this.refreshTable()
    this.refeshImageList()
    this.debouncedChangeSort = utils.debounce(this.changeSort)
  },
  methods: {
    async import2Db() {
      try {
        await this.$callFunction({
          $url: 'import',
          data: {
            fileID: this.fileList[0],
            importType: this.importType,
            tableName: this.tableName,
          },
        })
        this.fileList = []
        this.dialogVisible = false

        this.$message({
          type: 'success',
          message: '导入成功!',
        })
        this.refreshTable()
        this.refeshImageList()
      } catch (err) {
        this.$message({
          type: 'error',
          message: '导入失败! ' + err,
        })
      }
    },

    beforeUpload(file) {
      const isCSV = ['text/csv'].includes(file.type)

      if (!isCSV) {
        this.$message.error('导入文件只能是 CSV 格式!')
        return isCSV
      }
      this.loading = true

      return true
    },

    handleDialogClose() {
      // console.log('fileList', this.fileList)
      if (this.fileList.length > 0) {
        this.$deleteFile(this.fileList)
      }
    },

    handleDialogOpen() {
      this.loaded = false
      this.loading = false
      this.fileList = []
      this.fileName = ''
      this.importType = '1'
    },

    uploadSuccess(file) {
      return this.$uploadFile(file, 'shop/csv').then((res) => {
        this.loading = false
        this.loaded = true
        this.fileName = file.file.name
        this.fileList = [res.fileID]
        // console.log('file', file)
        // console.log('res', res)
      })
    },

    async export2CSV() {
      const jsonData = await this.$callFunction({
        $url: 'export',
        data: { tablename: 'shop_banner' },
      })

      const fields = [
        '_id',
        'title',
        'img_url',
        'url',
        'remark',
        'enabled',
        'sort_order',
        'is_delete',
      ]

      const res = await utils.export2CSV(jsonData, 'banner', fields)
      if (res !== '') {
        this.$message({
          type: 'info',
          message: res,
        })
      }
    },

    keywordChange() {
      this.currentPage = 1
      this.refreshTable()
    },

    reIndex(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1
    },

    getRowKey(row) {
      return row._id
    },

    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.refreshTable()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.refreshTable()
    },

    handleSelectionChange(val) {
      this.selection = val.map((item) => item._id)
    },

    refeshImageList() {
      this.loading = true
      this.$callFunction({
        $url: 'banner/get/enabled',
      }).then((res) => {
        this.imageList = res
        this.loading = false
      })
    },

    refreshTable() {
      this.$callFunction({
        $url: 'banner/get',
        data: {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          keyword: this.keyword,
        },
      }).then((res) => {
        this.bannerList = res.data
        this.total = res.total
      })
    },

    enableRow(row) {
      this.$callFunction({
        $url: 'banner/update',
        data: { _id: row._id, enabled: row.enabled },
      }).then(() => {
        this.refreshTable()
        this.refeshImageList()
      })
    },

    changeSort(row) {
      this.$callFunction({
        $url: 'banner/update',
        data: { _id: row._id, sort_order: row.sort_order },
      }).then(() => {
        this.refreshTable()
        this.refeshImageList()
      })
    },

    async remove(ids) {
      if (ids.length === 0) {
        this.$message({
          type: 'info',
          message: '请先选择记录',
        })
        return
      }

      try {
        await this.$confirm(
          '此操作将删除 ' + ids.length + ' 条记录, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )

        await this.$callFunction({
          $url: 'banner/remove',
          data: { ids },
        })

        this.$message({
          type: 'success',
          message: '删除成功!',
        })

        this.refreshTable()
        this.refeshImageList()
      } catch (err) {
        this.$message({
          type: 'info',
          message: '已取消删除: ' + err,
        })
      }
    },

    goEdit(row = { _id: 'new' }) {
      this.$cookie.set('banner', JSON.stringify(row))
      this.$router.push({
        name: 'content-banner-id',
        params: { id: row._id, row },
      })
    },
  },
}
</script>

<style scoped lang="scss">
.container {
  padding: 20px;
}

.el-carousel {
  margin: 0 auto;
  width: 600px;
  .el-image {
    width: 600px;
    height: 300px;
  }
}

.el-card {
  margin-top: 20px;
}

.el-table {
  width: 100%;
  .el-image {
    width: 100px;
    height: 50px;
  }
}

.el-pagination {
  margin-top: 10px;
}

.el-input-number {
  width: 100%;
}

.el-row {
  padding: 10px;
}

.el-upload__text {
  line-height: 30px;
}
</style>
