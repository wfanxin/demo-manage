<template>
	<section class="app-container">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" @submit.native.prevent>
				<el-form-item>
					<el-input v-model="filters.user_name" placeholder="操作人员账号" clearable></el-input>
				</el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="select_time"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-cascader
            :options="permissionOptions"
            :clearable=true
            change-on-select
            @change="handleItemChange"
            @active-item-change="handleItemChange"
            placeholder="权限名称"
            style="width: 300px;"
          ></el-cascader>
        </el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="handleSearch">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table v-loading="loading" :data="logs" highlight-current-row style="width: 100%;">
			<el-table-column prop="user_name" label="操作人员账号">
			</el-table-column>
      <!-- <el-table-column prop="op_uid" label="操作人员id">
			</el-table-column> -->
      <el-table-column prop="ip" label="操作人员ip">
			</el-table-column>
      <el-table-column prop="request.name" label="操作权限">
			</el-table-column>
      <el-table-column prop="response" label="操作结果">
        <template slot-scope="scope">
          <div v-html="formatterResponse(scope.row)"></div>
        </template>
			</el-table-column>
			<el-table-column prop="created_at" label="操作时间">
			</el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="detail(scope.$index, scope.row)">查看详情</el-button>
        </template>
			</el-table-column>
		</el-table>

    <el-dialog title="详情" :visible.sync="dialogTableVisible">
      <el-table :data="detailData" style="width: 100%">
        <el-table-column prop="request" label="请求信息" style="width: 50%">
          <template slot-scope="scope">
            <div>{{ scope.row.request.url }}</div>
            <div>{</div>
            <div v-for="(item, index) in scope.row.request.param" :key="index" style="padding-left: 2em;">{{ index }}: {{ item === null ? 'null' : item }}</div>
            <div>}</div>
          </template>
        </el-table-column>
        <el-table-column prop="response" label="返回结果" style="width: 50%">
          <template slot-scope="scope">
            <div>{</div>
            <div v-for="(item, index) in scope.row.response" :key="index" style="padding-left: 2em;">{{ index }}: {{ item === null ? 'null' : item }}</div>
            <div>}</div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
		<!--页码-->
    <el-pagination background layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="text-align:center;margin-top:10px">
    </el-pagination>
	</section>
</template>

<script>
import {
  getLogListPage
} from '@/api/log-table'
import {
  getTotal as getPermissionTotal
} from '@/api/permission-table'

export default {
  data() {
    return {
      dialogTableVisible: false,
      loading: true,
      select_time: '',
      permissionOptions: [],
      detailData: [],
      filters: {
        user_name: '',
        permission: ''
      },
      logs: [],
      total: 0,
      page: 1
    }
  },
  methods: {
    handleSearch() {
      this.page = 1
      this.getLogs()
    },
    detail(index, row) {
      this.dialogTableVisible = true

      this.detailData = []
      var tmp = []
      tmp['request'] = row.request
      tmp['response'] = row.response
      this.detailData.push(tmp)
    },
    formatterResponse(row, column, cellValue, index) {
      var str = ''
      if (parseInt(row['response']['code']) === 200) {
        str += '成功'
      } else {
        str += '<span style="color:#F56C6C;">失败</span><br/>'
        str += '原因：' + row['response']['message']
      }

      return str
    },
    // 获取列表
    handleCurrentChange(val) {
      this.page = val
      this.getLogs()
    },
    getLogs() {
      const para = {
        page: this.page,
        user_name: this.filters.user_name,
        select_time: this.select_time,
        permission: this.filters.permission
      }
      getLogListPage(para).then(res => {
        this.total = res.total
        this.logs = res.logs
        this.loading = false
      }).catch(() => { this.loading = false })
    },
    initPermission: function(e) {
      var permissionOptions = []
      for (var i = 0; i < e.length; i++) {
        var tmp = []
        tmp['value'] = e[i].id_path === '' ? e[i].id : e[i].id_path + '|' + e[i].id
        tmp['label'] = e[i].name

        if (e[i].children !== null && e[i].children !== undefined) {
          var children = this.initPermission(e[i].children, i)
          tmp['children'] = children
        }
        permissionOptions[i] = tmp
      }

      return permissionOptions
    },
    handleItemChange(e) {
      var index = e.length - 1
      this.filters.permission = e[index]
    },
    getSelect() {
      getPermissionTotal().then(res => {
        var permissions = res.list
        this.permissionOptions = this.initPermission(permissions)
      }).catch(() => {

      })
    }
  },
  mounted() {
    this.getSelect()

    this.getLogs()
  }
}
</script>

<style scoped>
.el-form-permisson-item{
  max-height: 300px;
  overflow-y: scroll;
}
</style>