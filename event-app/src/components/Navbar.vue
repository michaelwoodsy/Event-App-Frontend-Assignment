<template>
  <el-menu :router="true" class="el-menu-demo" mode="horizontal">
    <el-menu-item index="1" :route="{name:'events'}">Events</el-menu-item>
    <el-menu-item index="2" :route="{name:'profilePage'}">Profile</el-menu-item>
    <el-menu-item index="3" :route="{name:'login'}">Login</el-menu-item>
    <el-menu-item index="4" :route="{name:'register'}">Register</el-menu-item>
    <el-menu-item index="5" :route="{name:'home'}">Logout</el-menu-item>
  </el-menu>
  <div class="line"></div>
</template>

<script>
export default {
  name: "Navbar",

  data() {
    return {
    };
  },

  methods: {
  }
}
</script>

<style scoped>

</style>