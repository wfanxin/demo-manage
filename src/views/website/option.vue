<template>
	<section class="app-container">
    <div style="text-align: center; font-weight: bold; margin: 20px 0 30px 0;">选项配置</div>
    <el-form :model="editForm" label-width="150px" ref="form" style="padding-right: 100px;">
      <el-form-item :label="item.name" v-for="(item, index) in editForm" :key="index">
        <el-input type="textarea" v-model="item.value" rows="2" auto-complete="off" :placeholder="'请输入'+item.name+'词语之间逗号隔开'" style="width: 100%;"></el-input>
      </el-form-item>

      <div style="text-align: center; margin-top: 30px;">
        <el-button type="primary" @click="save()">保存</el-button>
      </div>
    </el-form>
	</section>
</template>

<script>
import {
  detail,
  edit
} from '@/api/website/option'
import {
  fun_getRole
} from '@/utils/common'

export default {
  data() {
    return {
      roleKey: '',
      filters: {},
      editForm: {}
    }
  },
  methods: {
    getDetail() {
      const params = Object.assign({}, this.filters)
      detail(params).then(res => {
        if (res.code === 0) {
          this.editForm = res.data
        }
      }).catch(() => {})
    },
    save() {
      edit(this.editForm).then(res => {
        if (res.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        }
      }).catch(() => {})
    }
  },
  mounted() {
    this.roleKey = fun_getRole()
    this.getDetail()
  }
}
</script>
<style>

</style>
