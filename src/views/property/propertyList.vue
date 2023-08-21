<template>
	<section class="app-container">
		<!--工具条-->
    <el-row >
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters" @submit.native.prevent>
          <el-form-item>
            <el-input v-model="filters.number" clearable placeholder="编号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.company" clearable placeholder="物业所属公司"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.property_name" clearable placeholder="物业名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.address" clearable placeholder="地址"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="handleSearch">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-upload ref="upload"
              class="upload-demo"
              :action="upload_url"
              :headers="myHeaders"
              accept=".xls, .xlsx"
              :show-file-list="false"
              :before-upload="uploadBefore"
              :on-success="uploadSuccess"
              :on-error="uploadError">
              <el-button type="primary" :loading="uploadLoading">导入excel</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAdd">新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="exportExcel" :loading="excelDownloadLoading">导出excel</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="exportImage" :loading="imageDownloadLoading">导出图片</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!--列表-->
    <el-table v-loading="loading" :data="data" highlight-current-row style="width: 100%;">
      <el-table-column prop="number" label="编号">
      </el-table-column>
      <el-table-column prop="company" label="物业所属公司">
      </el-table-column>
      <el-table-column prop="property_type" label="物业类别">
      </el-table-column>
      <el-table-column prop="property_name" label="物业名称">
      </el-table-column>
      <el-table-column prop="address" label="地址">
      </el-table-column>
      <el-table-column prop="area" label="经营面积(㎡)">
      </el-table-column>
      <el-table-column prop="term" label="租赁期限">
      </el-table-column>
      <el-table-column prop="rent" label="租金(元/月)">
      </el-table-column>
      <el-table-column prop="notes" label="备注">
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="primary" size="small" @click="handleImageGroup(scope.row)">图片组</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

	  <!--页码-->
    <el-pagination background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page" :page-size="pageSize" :total="total" style="text-align:center;margin-top:10px">
    </el-pagination>

    <!--编辑界面-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :show-close="false" width="50%">
      <el-form :model="editForm" label-width="110px" style="width: 80%">
        <el-form-item label="编号">
          <el-input v-model="editForm.number" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="物业所属公司">
          <el-input v-model="editForm.company" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="物业类别">
          <el-input v-model="editForm.property_type" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="物业名称">
          <el-input v-model="editForm.property_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="editForm.address" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="经营面积(㎡)">
          <el-input v-model="editForm.area" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="租赁期限">
          <el-input v-model="editForm.term" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="租金(元/月)">
          <el-input v-model="editForm.rent" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="editForm.notes" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="resetForm()">取消</el-button>
        <el-button v-if="dialogStatus == 'create'" type="primary" @click="createData" :loading="addIsLoading">新增</el-button>
        <el-button v-else type="primary" @click="updateData" :loading="editIsLoading">修改</el-button>
      </div>
    </el-dialog>

    <!-- 图片组 -->
   <ImageGroup @db-click="submitImageGroup" ref="ImageGroup"></ImageGroup>
	</section>
</template>

<script>
import {
  propertyList,
  addProperty,
  editProperty,
  delProperty,
  exportExcel,
  exportImage
} from '@/api/property'
import { getToken } from '@/utils/auth'
import ImageGroup from '@/components/property/image-group'

export default {
  components: {
    ImageGroup
  },
  data() {
    return {
      filters: {
        number: '',
        company: '',
        property_name: '',
        address: ''
      },
      upload_url: process.env.BASE_API + '/lv/property/uploadFile',
      myHeaders: {
        'X-Token': getToken()
      },
      uploadLoading: false,
      addIsLoading: false,
      editIsLoading: false,
      excelDownloadLoading: false,
      imageDownloadLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      dialogTitle: '',
      editForm: {},
      loading: false,
      data: [],
      page: 1,
      pageSize: 20,
      total: 0
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    // 搜索方法
    handleSearch() {
      this.page = 1
      this.getList()
    },
    createData() {
      const params = Object.assign({}, this.editForm)
      addProperty(params).then(res => {
        this.addIsLoading = false
        if (res.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.dialogFormVisible = false
          this.getList()
        }
      }).catch(() => { this.addIsLoading = false })
    },
    updateData() {
      const params = Object.assign({}, this.editForm)
      editProperty(params).then(res => {
        this.editIsLoading = false
        if (res.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.dialogFormVisible = false
          this.getList()
        }
      }).catch(() => { this.editIsLoading = false })
    },
    handleAdd() {
      this.dialogStatus = 'create'
      this.dialogTitle = '新增数据'
      this.editForm = {
        number: '',
        company: '',
        property_type: '',
        property_name: '',
        address: '',
        area: '',
        term: '',
        rent: '',
        notes: ''
      }
      this.dialogFormVisible = true
    },
    handleEdit(row) {
      this.dialogStatus = 'update'
      this.dialogTitle = '修改数据'
      this.editForm = row
      this.dialogFormVisible = true
    },
    handleDel(row) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delProperty({ id: row.id }).then(res => {
          if (res.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getList()
          }
        })
      }).catch(() => {})
    },
    resetForm() {
      this.dialogFormVisible = false
    },
    getList() {
      const params = Object.assign({}, this.filters)
      params.page = this.page
      params.pageSize = this.pageSize
      this.loading = true
      propertyList(params).then(res => {
        this.loading = false
        if (res.code === 0) {
          this.total = res.total
          this.data = res.data
        }
      }).catch(() => { this.loading = false })
    },
    uploadBefore() {
      this.uploadLoading = true
    },
    // 上传成功后的事件
    uploadSuccess(res, file, fileList) {
      this.uploadLoading = false
      if (res.code === 0) {
        this.getList()
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      } else {
        this.$message.error(res.message)
      }
    },
    // 上传失败
    uploadError() {
      this.uploadLoading = false
      this.$message.error('上传失败')
    },
    exportExcel() {
      const params = Object.assign({}, this.filters)
      this.excelDownloadLoading = true
      exportExcel(params).then(res => {
        this.excelDownloadLoading = false
        if (res.code === 0) {
          window.open(res.excelUrl, '_blank')
        }
      }).catch(() => { this.excelDownloadLoading = false })
    },
    exportImage() {
      const params = Object.assign({}, this.filters)
      this.imageDownloadLoading = true
      exportImage(params).then(res => {
        this.imageDownloadLoading = false
        if (res.code === 0) {
          window.open(res.zip, '_blank')
        }
      }).catch(() => { this.imageDownloadLoading = false })
    },
    handleImageGroup(row) {
      this.$refs['ImageGroup'].handleImageGroup(row)
    },
    submitImageGroup() {
      this.getList()
    }
  },
  mounted() {
    this.getList()
  }
}
</script>
