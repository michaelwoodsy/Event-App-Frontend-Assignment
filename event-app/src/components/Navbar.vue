<template>
  <el-menu :router="true" class="el-menu-demo" mode="horizontal">
    <el-menu-item index="1" :route="{name:'events'}">Events</el-menu-item>
    <el-menu-item index="2" v-if="isLoggedIn" :route="{path: `users/${profileRoute}`}">Profile</el-menu-item>
    <el-menu-item index="3" v-if="!isLoggedIn" :route="{name:'login'}">Login</el-menu-item>
    <el-menu-item index="4" v-if="!isLoggedIn" :route="{name:'register'}">Register</el-menu-item>
    <el-menu-item index="5" v-if="isLoggedIn" @click="logout" :route="{name:'home'}">Logout</el-menu-item>
  </el-menu>
  <div class="line"></div>
</template>

<script>
import {User} from "../Api";

export default {
  name: "Navbar",

  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn
    },

    profileRoute() {
      if (this.isLoggedIn) {
        return this.$store.state.userId
      } else {
        return ''
      }
    }
  },

  methods: {
    logout () {
      User.logout()
          .then(() => {
            this.$store.dispatch("logout")
          })
    }
  }
}
</script>

<style scoped>

</style>