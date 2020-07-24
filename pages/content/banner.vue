<template>
  <div class="container">
    <el-row>
      <el-carousel trigger="click" height="300px">
        <el-carousel-item v-for="item in bannerList" :key="item.index">
          <el-image :src="item.img_url" fit="cover" />
        </el-carousel-item>
      </el-carousel>
    </el-row>
    <el-row>
      <el-card>
        <el-row type="flex" justify="end">
          <el-button type="primary" icon="el-icon-plus">添加广告</el-button>
        </el-row>
        <el-row>
          <el-table
            :data="
              bannerList.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
              )
            "
          >
            <el-table-column type="index" label="#" width="50">
            </el-table-column>
            <el-table-column prop="title" label="标题" width="150">
            </el-table-column>
            <el-table-column prop="img_url" label="图片" width="200">
              <template slot-scope="scope">
                <el-image :src="scope.row.img_url" fit="cover" />
              </template>
            </el-table-column>
            <el-table-column prop="url" label="关联链接" width="300">
            </el-table-column>
            <el-table-column
              prop="sort_order"
              label="排序"
              sortable
              width="100"
            >
            </el-table-column>
            <el-table-column prop="enabled" label="启用状态" width="100">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.enabled"
                  :active-value="1"
                  :inactive-value="0"
                >
                </el-switch>
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
// import Vue from 'vue'

export default {
  data() {
    return {
      bannerList: [],
      currentPage: 1,
      pageSize: 10,
    }
  },
  mounted() {
    this.$callFunction({
      $url: 'banner/get',
    }).then((res) => {
      this.bannerList = res
    })
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
  },
}
</script>

<style scoped lang="scss">
.container {
  padding: 20px;
}
.el-row {
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0px;
  }
}

.el-carousel {
  margin: 0 auto;
  width: 600px;
  .el-image {
    width: 100%;
    height: 100%;
  }
}

.el-table {
  width: 100%;
  .el-image {
    width: 100px;
    height: 50px;
  }
}
</style>
