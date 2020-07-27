<template>
  <div class="container">
    <el-row>
      <el-carousel trigger="click" height="300px">
        <el-carousel-item v-for="(item, index) in imageList" :key="index">
          <el-image :src="item" fit="cover" />
        </el-carousel-item>
      </el-carousel>
    </el-row>
    <el-row>
      <el-card>
        <el-row class="table-top" type="flex" justify="end">
          <el-button class="btn-add" type="primary" icon="el-icon-plus"
            >添加广告</el-button
          >
        </el-row>
        <el-row>
          <el-table
            :data="
              bannerList.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
              )
            "
            @row-click="clickRow"
          >
            <el-table-column type="index" label="#" width="50">
            </el-table-column>
            <el-table-column prop="title" label="标题" width="150">
            </el-table-column>
            <el-table-column prop="img_url" label="图片" width="120">
              <template slot-scope="scope">
                <el-image :src="scope.row.img_url" fit="cover" />
              </template>
            </el-table-column>
            <el-table-column prop="url" label="关联链接" width="300">
            </el-table-column>
            <el-table-column prop="enabled" label="启用状态" width="100">
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
                  :max="bannerList.length"
                  size="small"
                  @change="debouncedChangeSort"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注"> </el-table-column>
            <el-table-column label="操作" width="200">
              <el-button type="primary" size="mini" icon="el-icon-edit"
                >编辑</el-button
              >
              <el-button type="danger" size="mini" icon="el-icon-delete"
                >删除</el-button
              >
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
      currentPage: 1,
      pageSize: 10,
      curRow: null,
    }
  },
  mounted() {
    this.refreshTable()
    this.debouncedChangeSort = utils.debounce(this.changeSort)
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },

    refreshTable() {
      this.$callFunction({
        $url: 'banner/get',
      }).then((res) => {
        this.bannerList = res
        this.imageList = res
          .filter((item) => {
            return item.enabled === 1
          })
          .map((item) => item.img_url)
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

    clickRow(row) {
      this.curRow = row
    },

    changeSort() {
      this.$callFunction({
        $url: 'banner/update',
        data: { _id: this.curRow._id, sort_order: this.curRow.sort_order },
      }).then(() => {
        this.refreshTable()
      })
    },
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
    width: 100%;
    height: 100%;
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

.table-top {
  .btn-add {
    width: 160px;
    margin-right: 30px;
  }
}

.el-pagination {
  margin-top: 10px;
}

.el-input-number {
  width: 100%;
}
</style>
