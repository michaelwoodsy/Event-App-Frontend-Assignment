<template>
  <permission-denied v-if="hasPermission"></permission-denied>
  <div v-else>
    <el-row>
      <el-col :span="9">
        <div class="grid-content"></div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content"></div>
        <el-form>
          <el-form-item>
            <h1>Register:</h1>
          </el-form-item>
          <el-form-item>
            <p style="text-align:center;"><img v-if="defaultNeeded" src="../assets/defaultProfile.jpg"
                                               style="width: 200px; height: 200px" fit="contain"/></p>
            <p style="text-align:center;"><img v-if="!defaultNeeded" :src="profilePictureDisplay"
                                               style="width: 200px; height: 200px" fit="contain"/></p>
          </el-form-item>
          <el-form-item>
            <label><b>First Name:</b></label>
            <el-input v-model="firstName" placeholder="Enter your First Name" type="text"></el-input>
            <span class="error">{{ errorMsg.firstName }}</span>
          </el-form-item>
          <el-form-item>
            <label><b>Last Name:</b></label>
            <el-input v-model="lastName" placeholder="Enter your Last Name" type="text"></el-input>
            <span class="error">{{ errorMsg.lastName }}</span>
          </el-form-item>
          <el-form-item>
            <label><b>Email:</b></label>
            <el-input v-model="email" placeholder="Enter your Email" type="email"></el-input>
            <span class="error">{{ errorMsg.email }}</span>
          </el-form-item>
          <el-form-item>
            <label><b>Password:</b></label>
            <el-input v-model="password" placeholder="Enter your Password" type="password" show-password></el-input>
            <span class="error">{{ errorMsg.password }}</span>
          </el-form-item>
          <el-form-item>
            <label><b>Profile Picture: </b>(Optional)</label>
            <input type="file" accept="image/jpeg,image/gif,image/png" @change="setProfilePicture">
            <br>
            <span class="error">{{ errorMsg.profilePicture }}</span>
          </el-form-item>
          <el-form-item>
            <span class="error" id="backendError" hidden>{{ errorMsg.backendChecks }}</span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="register">Create Account</el-button>
            <el-button v-on:click="cancel">Cancel</el-button>
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
  name: "Register",
  components: {PermissionDenied},

  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      profilePicture: null,
      profilePictureDisplay: '',
      defaultNeeded: true,
      hasPermission: false,
      errorMsg: {
        'selectedFile': null,
        'firstName': null,
        'lastName': null,
        'email': null,
        'password': null,
        'profilePicture': null,
        'backendChecks': null
      },
      check: true,
    }
  },

  mounted() {
    this.checkPermission()
  },

  methods: {
    checkPermission() {
      this.hasPermission = !!this.$store.getters.isLoggedIn;
    },

    setProfilePicture(event) {
      try {
        const image = event.target.files[0]
        if (image.size <= 20e6) {
          this.profilePicture = image
          this.defaultNeeded = false
          this.profilePictureDisplay = URL.createObjectURL(this.profilePicture)
          this.errorMsg['profilePicture'] = ""
        } else {
          this.profilePicture = null
          this.defaultNeeded = true
          this.errorMsg['profilePicture'] = "Image is too large, please select another"
        }
      } catch (e) {
        this.defaultNeeded = true
        this.profilePicture = null
      }
    },

    checkFirstName() {
      if (this.firstName === '') {
        this.errorMsg['firstName'] = 'Please enter a first name'
        this.check = false
      } else {
        this.errorMsg['firstName'] = null
      }
    },

    checkLastName() {
      if (this.lastName === '') {
        this.errorMsg['lastName'] = 'Please enter a last name'
        this.check = false
      } else {
        this.errorMsg['lastName'] = null
      }
    },

    checkEmail() {
      if (this.email === '') {
        this.errorMsg['email'] = 'Please enter a email'
        this.check = false
      } else if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.email)) {
        this.errorMsg['email'] = 'Please enter a valid email'
        this.check = false
      } else {
        this.errorMsg['email'] = null
      }
    },

    checkPassword() {
      if (this.password === '') {
        this.errorMsg['password'] = 'Please enter a password'
        this.check = false
      } else if (this.password.length < 8) {
        this.errorMsg['password'] = 'Password must be greater than 8 characters'
        this.check = false
      } else {
        this.errorMsg['password'] = null
      }
    },

    cancel() {
      this.$router.push({name: "events"})
    },

    register() {
      document.getElementById("backendError").hidden = true;
      this.checkFirstName()
      this.checkLastName()
      this.checkEmail()
      this.checkPassword()

      if (!this.check) {
        this.check = true
      } else {
        User.createNew(this.firstName, this.lastName, this.email, this.password)
            .then(() => {
              User.login(this.email, this.password)
                  .then((response) => {
                    this.$store.commit("updateToken", response.data.token)
                    this.$store.commit("updateUser", response.data.userId)

                    if (!this.defaultNeeded) {
                      UserImage.setUserImage(response.data.userId, this.profilePicture, this.profilePicture.type)
                          .then(() => {
                            this.$router.push({name: 'profilePage', params: {id: this.$store.state.userId}})
                          })
                    } else {
                      this.$router.push({name: 'profilePage', params: {id: this.$store.state.userId}})
                    }
                  })
            })
            .catch((error) => {
              let errorString = error.response.statusText.slice(error.response.statusText.indexOf(":") + 2)
              this.errorMsg.backendChecks = errorString.charAt(0).toUpperCase() + errorString.slice(1)
              document.getElementById("backendError").hidden = false;
            })
      }
    }
  }
}
</script>

<style scoped>
.error {
  color: red;
}

</style>