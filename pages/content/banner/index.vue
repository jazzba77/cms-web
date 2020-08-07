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
        <el-row type="flex" justify="end">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="goEdit()"
            >添加</el-button
          >
          <el-button plain type="primary" size="small" icon="el-icon-upload2"
            >导入</el-button
          >
          <el-button plain type="primary" size="small" icon="el-icon-download"
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
        <el-row>
          <el-table
            ref="elTable"
            :data="
              bannerList.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
              )
            "
            highlight-current-row
            stripe
            :row-key="getRowKey"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" reserve-selection width="50">
            </el-table-column>
            <el-table-column type="index" label="#" width="50">
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
            :total="bannerList.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </el-row>
      </el-card>
    </el-row>
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
      loading: false,
    }
  },
  mounted() {
    this.refreshTable()
    this.debouncedChangeSort = utils.debounce(this.changeSort)
  },
  methods: {
    getRowKey(row) {
      return row._id
    },

    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },

    handleSelectionChange(val) {
      this.selection = val.map((item) => item._id)
    },

    refreshTable() {
      this.loading = true
      this.$callFunction({
        $url: 'banner/get',
      }).then((res) => {
        this.bannerList = res
        this.imageList = res
          .filter((item) => {
            return item.enabled === 1
          })
          .map((item) => item.img_url)
        this.loading = false
      })
    },

    enableRow(row) {
      this.$callFunction({
        $url: 'banner/update',
        data: { _id: row._id, enabled: row.enabled },
      }).then(() => {
        this.refreshTable()
      })
    },

    // clickRow(row) {
    //   this.$refs.elTable.setCurrentRow(row)
    // },

    changeSort(row) {
      this.$callFunction({
        $url: 'banner/update',
        data: { _id: row._id, sort_order: row.sort_order },
      }).then(() => {
        this.refreshTable()
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

    // remove(row) {
    //   this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //   })
    //     .then(() => {
    //       // console.log('remove', row)
    //       this.removeRow([row._id])
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: 'info',
    //         message: '已取消删除',
    //       })
    //     })
    // },
  },
}
</script>

<style scoped lang="scss">
.container {
  padding: 20px;
}
// .el-row {
//   margin-bottom: 10px;
//   &:last-child {
//     margin-bottom: 0px;
//   }
// }

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
</style>
