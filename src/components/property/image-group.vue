<template>
  <section>
    <el-dialog title="图片组" :visible.sync="dialogVisible" width="60%">
      <el-row style="margin-bottom: 20px;">
        <el-upload
          style="display: block;"
          class="avatar-uploader"
          :action="upload_url"
          :headers="myHeaders"
          accept=".jpg, .png, .jpeg"
          multiple
          :show-file-list="false"
          :on-success="uploadSuccess">
          <el-button type="primary" style="width: 100%;">上传图片</el-button>
        </el-upload>
      </el-row>

      <el-row :gutter="20">
        <draggable v-model="images">
          <transition-group>
            <el-col :span="3" v-for="(item, index) in images" :key="index" style="position: relative;">
              <div class="image-box">
                <el-image class="image-item" :src="item" :preview-src-list="images"></el-image>
                <i class="el-icon-error icon-close-btn" @click="deleteImage(index)"></i>
              </div>
            </el-col>
          </transition-group>
        </draggable>
      </el-row>

      <el-row style="text-align: right; margin-top: 10px;">
        <el-button type="primary" @click="resetForm()">取消</el-button>
        <el-button type="primary" @click="saveImage()" :loading="loading">确认</el-button>
      </el-row>
    </el-dialog>
  </section>
</template>

<script>
import draggable from 'vuedraggable'
import { getToken } from '@/utils/auth'
import { saveImage } from '@/api/property'

export default {
  components: {
    draggable
  },
  data() {
    return {
      dialogVisible: false,
      upload_url: process.env.BASE_API + '/lv/property/uploadImage',
      myHeaders: {
        'X-Token': getToken()
      },
      id: 0,
      images: [],
      loading: false
    }
  },
  methods: {
    // 行双击时给父组件广播事件
    handleRowDblclick(row, event, column) {
      this.$emit('db-click')
      this.dialogVisible = false
    },
    // 接受父事件
    handleImageGroup(row) {
      this.resetForm()
      this.id = row.id
      this.images = row.images
      this.dialogVisible = true
    },
    resetForm() {
      this.id = 0
      this.images = []
      this.dialogVisible = false
    },
    uploadSuccess(res, file, fileList) {
      if (res.code === 0) {
        this.images.push(res.file)
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    },
    deleteImage(index) { // 删除图片
      this.images.splice(index, 1)
    },
    saveImage() {
      this.$confirm('确认提交？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        const params = {
          id: this.id,
          images: this.images
        }
        saveImage(params).then(res => {
          this.loading = false
          if (res.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.handleRowDblclick()
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        }).catch(() => { this.loading = false })
      }).catch(() => {})
    }
  }
}
</script>
<style>
  .el-dialog__body{
    padding: 20px 20px;
  }
  .image-box {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 100%;
    margin-bottom: 20px;
  }
  .image-item {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 1px solid #EBEEF5;
    border-radius: 5px;
    cursor: pointer;
  }
  .icon-close-btn{
    color: red;
    position: absolute;
    top: 0;
    left: 100%;
    font-size: 20px;
    margin: -5px 0 0 -15px;
    cursor: pointer;
  }
</style>
