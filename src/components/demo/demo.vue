<template>
  <section>
    <!--编辑界面-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false" :show-close="false" top="50px" width="50%">
      <el-form :model="editForm" label-width="130px" :rules="formRules" ref="form">
        <el-row class="component-form-row">
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input size="mini" v-model="editForm.name" auto-complete="off" placeholder="请输入名称" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      
      <div slot="footer" class="dialog-footer" style="position: absolute; bottom: 30px; width: 100%; right: 20px;">
        <el-button size="mini" @click.native="resetForm()">取消</el-button>
        <el-button size="mini" type="primary" @click="save()">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {
  add,
  detail,
  edit
} from '@/api/demo'
import { getToken } from '@/utils/auth'

export default {
  data() {
    return {
      dialogVisible: false,
      dialogTitle: '',
      upload_url: process.env.BASE_API + '/lv/service/uploadFile',
      myHeaders: {
        'X-Token': getToken()
      },
      id: 0,
      options: {},
      editForm: {},
      formRules: {
        // name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 行双击时给父组件广播事件
    handleRowDblclick(row, event, column) {
      this.$emit('db-click')
      this.dialogVisible = false
    },
    // 接受父事件
    handleComponent(id, options) {
      this.id = id
      this.options = options
      if (this.id === 0) {
        this.dialogTitle = '新增'
        this.editForm = {
          id: 0,
          name: ''
        }
      } else {
        this.dialogTitle = '编辑'
        this.getDetail()
      }
      this.dialogVisible = true
    },
    getDetail() {
      detail({ id: this.id }).then(res => {
        if (res.code === 0) {
          this.editForm = res.data
        }
      }).catch(() => {})
    },
    resetForm() {
      this.dialogVisible = false
      this.$refs['form'].resetFields()
    },
    save() {
      if (this.editForm.id === 0) { // 新建
        add(this.editForm).then(res => {
          if (res.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.handleRowDblclick()
          }
        }).catch(() => {})
      } else { // 编辑
        edit(this.editForm).then(res => {
          if (res.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.handleRowDblclick()
          }
        }).catch(() => {})
      }
    },
    uploadSuccess(res, file, fileList) {
      if (res.code !== 0) {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    }
  }
}
</script>
<style>
  .component-form-row .el-form-item {
    margin-bottom: 10px;
  }
  .avatar-uploader {
    display: inline-block;
    position: absolute;
    margin-left: 10px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>
