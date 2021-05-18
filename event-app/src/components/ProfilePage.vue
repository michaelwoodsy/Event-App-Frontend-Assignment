<template>
  <permission-denied v-if="!hasPermission"></permission-denied>
  <div v-else>
    <el-row>
      <el-col :span="9">
        <div class="grid-content"></div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content"></div>
        <el-form>
          <el-form-item>
            <h1>My Profile:</h1>
          </el-form-item>
          <el-form-item>
            <p style="text-align:center;"><img v-if="defaultNeeded" src="../assets/defaultProfile.jpg"
                                               style="width: 200px; height: 200px" fit="contain"/></p>
            <p style="text-align:center;"><img v-if="!defaultNeeded" :src="profilePicture"
                                               style="width: 200px; height: 200px" fit="contain"/></p>
          </el-form-item>
          <el-form-item>
            <label style="margin-right: 5px"><b>Name:</b></label>
            <span>{{ firstName }} {{ lastName }}</span>
          </el-form-item>
          <el-form-item>
            <label style="margin-right: 5px"><b>Email:</b></label>
            <span>{{ email }}</span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="editProfile">Edit Profile</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="9">
        <div class="grid-content"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import {User, UserImage} from "../Api";
import PermissionDenied from "./PermissionDenied";

export default {
  name: "ProfilePage",
  components: {PermissionDenied},
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      error: null,
      hasPermission: false,
      profilePicture: 'data:',
      defaultNeeded: true,
    }
  },

  mounted() {
    this.checkPermission()
    if (this.hasPermission === true) {
      this.getUserData()
      this.getImageData()
    }
  },

  methods: {
    checkPermission() {
      this.hasPermission = !!(this.$store.getters.isLoggedIn && Number(this.$route.params.id) === this.$store.state.userId);
    },

    getUserData() {
      User.getUserData(Number(this.$route.params.id))
          .then((response) => {
            this.error = null
            this.firstName = response.data.firstName
            this.lastName = response.data.lastName
            this.email = response.data.email
          })
          .catch((error) => {
            console.log(error.response.statusText)
          });
    },

    getImageData() {
      UserImage.getUserImage(this.$store.state.userId)
          .then((response) => {
            this.profilePicture += response.headers['content-type']
            this.profilePicture += ";base64,"
            this.profilePicture += Buffer.from(response.data, 'binary').toString('base64')
            this.defaultNeeded = false
          })
          .catch((error) => {
            console.log(error.response.statusText)
          });
    },

    editProfile() {
      this.$router.push({name: 'editProfile', params: {id: this.$store.state.userId}})
    }
  }
}
</script>

<style scoped>

</style>