<template>
  <div v-if="dataReady">
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
              <h1>Edit Profile:</h1>
            </el-form-item>
            <el-form-item>
              <p style="text-align:center;"><img v-if="defaultNeeded" src="../assets/defaultProfile.jpg"
                                                 style="width: 200px; height: 200px" fit="contain" alt=""/></p>
              <p style="text-align:center;"><img v-if="!defaultNeeded" :src="profilePictureDisplay"
                                                 style="width: 200px; height: 200px" fit="contain" alt=""/></p>
              <el-button type="danger" style="text-align: center" v-if="!defaultNeeded" v-on:click="dialogVisible = true">
                Delete Image
              </el-button>
              <el-dialog
                  title="Confirm Delete"
                  v-model="dialogVisible"
                  width="30%"
                  :before-close="handleClose">
                <span>Are you sure you want to delete your profile picture?</span>
                <template #footer>
                <span>
                  <el-button @click="dialogVisible = false">Cancel</el-button>
                  <el-button type="danger" @click="deleteImage">Confirm</el-button>
                </span>
                </template>
              </el-dialog>
            </el-form-item>
            <el-form-item>
              <label><b>First Name:</b></label>
              <el-input v-model="firstName" placeholder="Enter your new First Name" type="text"></el-input>
              <span class="error">{{ errorMsg.firstName }}</span>
            </el-form-item>
            <el-form-item>
              <label><b>Last Name:</b></label>
              <el-input v-model="lastName" placeholder="Enter your new Last Name" type="text"></el-input>
              <span class="error">{{ errorMsg.lastName }}</span>
            </el-form-item>
            <el-form-item>
              <label><b>Email:</b></label>
              <el-input v-model="email" placeholder="Enter your new Email" type="email"></el-input>
              <span class="error">{{ errorMsg.email }}</span>
            </el-form-item>
            <el-form-item>
              <label><b>Current Password:</b></label>
              <el-input v-model="currentPassword" placeholder="Enter your current Password" type="password"
                        show-password></el-input>
              <span class="error">{{ errorMsg.currentPassword }}</span>
            </el-form-item>
            <el-form-item>
              <label><b>New Password:</b></label>
              <el-input v-model="newPassword" placeholder="Enter your new Password" type="password"
                        show-password></el-input>
              <span class="error">{{ errorMsg.newPassword }}</span>
            </el-form-item>
            <el-form-item>
              <label><b>Profile Picture: </b></label>
              <br>
              <input type="file" accept="image/jpeg,image/gif,image/png" @change="setProfilePicture">
              <br>
              <span class="error">{{ errorMsg.profilePicture }}</span>
            </el-form-item>
            <el-form-item>
              <span class="error" id="backendError" hidden>{{ errorMsg.backendChecks }}</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" v-on:click="editProfile">Save Changes</el-button>
              <el-button v-on:click="cancel">Cancel</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="9">
          <div class="grid-content"></div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import PermissionDenied from "./PermissionDenied";
import {User, UserImage} from "../Api";

export default {
  name: "EditProfile",
  components: {PermissionDenied},

  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      hasPermission: false,
      profilePicture: 'data:',
      profilePictureDisplay: '',
      defaultNeeded: true,
      dialogVisible: false,
      errorMsg: {
        'selectedFile': null,
        'firstName': null,
        'lastName': null,
        'email': null,
        'currentPassword': null,
        'newPassword': null,
        'profilePicture': null,
        'backendChecks': null
      },
      check: true,
      dataReady: false
    }
  },

  mounted() {
    this.checkPermission()
    this.getUserData()
    this.getImageData()
    setTimeout(this.pageReady, 200)
  },

  methods: {
    pageReady() {
      this.dataReady = true
    },

    checkPermission() {
      this.hasPermission = !!(this.$store.getters.isLoggedIn && Number(this.$route.params.id) === this.$store.state.userId);
    },

    handleClose(done) {
      this.$confirm('Cancel?')
          .then(() => {
            done();
            this.dialogVisible = false
          })
          .catch(() => {});
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
            this.error = error
            console.log(error.response.statusText)
          })
    },

    getImageData() {
      UserImage.getUserImage(this.$store.state.userId)
          .then((response) => {
            this.profilePicture += response.headers['content-type']
            this.profilePicture += ";base64,"
            this.profilePicture += Buffer.from(response.data, 'binary').toString('base64')
            this.profilePictureDisplay = this.profilePicture
            this.defaultNeeded = false
          })
          .catch((error) => {
            console.log(error.response.statusText)
          });
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
      } catch (error) {
        this.defaultNeeded = true
        this.profilePicture = null
        console.log(error.response.statusText)
      }
    },

    deleteImage() {
      UserImage.getUserImage(this.$store.state.userId)
          .then(() => {
            UserImage.deleteUserImage(Number(this.$route.params.id))
                .then(() => {
                  this.defaultNeeded = true
                  this.profilePicture = null
                  this.dialogVisible = false
                })
          })
          .catch((error) => {
            this.defaultNeeded = true
            this.profilePicture = null
            this.dialogVisible = false
            console.log(error.response.statusText)
          });
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

    checkCurrentPassword() {
      if (this.currentPassword === '' && this.newPassword !== '') {
        this.errorMsg['currentPassword'] = 'Please enter your current password'
        this.check = false
      } else if (this.currentPassword.length < 8 && this.newPassword !== '') {
        this.errorMsg['currentPassword'] = 'Password must be greater than 8 characters'
        this.check = false
      } else {
        this.errorMsg['currentPassword'] = null
      }
    },

    checkNewPassword() {
      if (this.newPassword === '' && this.currentPassword !== '') {
        this.errorMsg['newPassword'] = 'Please enter a new password'
        this.check = false
      } else if (this.newPassword.length < 8 && this.currentPassword !== '') {
        this.errorMsg['newPassword'] = 'Password must be greater than 8 characters'
        this.check = false
      } else {
        this.errorMsg['newPassword'] = null
      }
    },

    cancel() {
      this.$router.push({name: 'profilePage', params: {id: this.$store.state.userId}})
    },

    editProfile() {
      document.getElementById("backendError").hidden = true;
      this.checkFirstName()
      this.checkLastName()
      this.checkEmail()
      this.checkCurrentPassword()
      this.checkNewPassword()

      if (!this.check) {
        this.check = true
      } else {
        if (this.newPassword === '' && this.currentPassword === '') {
          let userData = {
            "firstName": this.firstName,
            "lastName": this.lastName,
            "email": this.email,
          }
          User.editUserData(Number(this.$route.params.id), userData)
              .then(() => {
                if (!this.defaultNeeded) {
                  UserImage.setUserImage(Number(this.$route.params.id), this.profilePicture, this.profilePicture.type)
                      .then(() => {
                        this.$router.push({name: 'profilePage', params: {id: this.$store.state.userId}})
                      })
                } else {
                  this.$router.push({name: 'profilePage', params: {id: this.$store.state.userId}})
                }
              })
              .catch((error) => {
                let errorString = error.response.statusText.slice(error.response.statusText.indexOf(":") + 2)
                this.errorMsg.backendChecks = errorString.charAt(0).toUpperCase() + errorString.slice(1)
                document.getElementById("backendError").hidden = false;
              })
        } else {
          let userData = {
            "firstName": this.firstName,
            "lastName": this.lastName,
            "email": this.email,
            "password": this.newPassword,
            "currentPassword": this.currentPassword
          }
          User.editUserData(Number(this.$route.params.id), userData)
              .then(() => {
                if (!this.defaultNeeded) {
                  UserImage.setUserImage(Number(this.$route.params.id), this.profilePicture, this.profilePicture.type)
                      .then(() => {
                        this.$router.push({name: 'profilePage', params: {id: this.$store.state.userId}})
                      })
                } else {
                  this.$router.push({name: 'profilePage', params: {id: this.$store.state.userId}})
                }
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
}
</script>

<style scoped>
.error {
  color: red;
}

</style>