<template>
  <!-- 树形（普通） -->
  <!-- <roleTree></roleTree> -->

  <!-- 树形（等级） -->
  <!-- <roleLevelTree></roleLevelTree> -->

  <!-- 表格（普通） -->
  <!-- <roleTable></roleTable> -->

  <!-- 表格（等级） -->
  <roleLevelTable></roleLevelTable>
</template>

<script>
import roleTree from './roleTree'
import roleLevelTree from './roleLevelTree'
import roleTable from './roleTable'
import roleLevelTable from './roleLevelTable'

export default {
  name: 'role',
  components: {
    roleTree,
    roleLevelTree,
    roleTable,
    roleLevelTable
  },
  data() {
    return {}
  },
  methods: {},
  mounted() {}
}
</script>
