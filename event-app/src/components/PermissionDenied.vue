<template>
  <el-row>
    <el-col :span="8">
      <div class="grid-content"></div>
    </el-col>
    <el-col :span="8">
      <div class="grid-content"></div>
      <h2 style="text-align: center">You do not have permission to view this page</h2>
    </el-col>
    <el-col :span="8">
      <div class="grid-content"></div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "PermissionDenied"
}
</script>

<style scoped>

</style>