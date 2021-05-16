<template>
  <el-container>
    <el-header>

    </el-header>

    <el-divider></el-divider>

    <el-main>
      <el-row>
        <el-col :span="10"><div class="grid-content"></div></el-col>
        <el-col :span="4"><div class="grid-content"></div>
          <h1>Register:</h1>
        </el-col>
        <el-col :span="10"><div class="grid-content"></div></el-col>
      </el-row>

      <el-row>
        <el-col :span="10"><div class="grid-content"></div></el-col>
        <el-col :span="4"><div class="grid-content"></div>
          <label><b>Profile Picture: </b>(Optional)</label>
          <input type="file" @change="onFileSelected">
        </el-col>
        <el-col :span="10"><div class="grid-content"></div></el-col>
      </el-row>

      <el-row>
        <el-col :span="10"><div class="grid-content"></div></el-col>
        <el-col :span="4"><div class="grid-content"></div>
          <label><b>First Name:</b></label>
          <el-input v-model="firstName" placeholder="Enter your First Name" type="text"></el-input>
          <span class="error">{{ errorMsg.firstName }}</span>
        </el-col>
        <el-col :span="10"><div class="grid-content"></div></el-col>
      </el-row>

      <el-row>
        <el-col :span="10"><div class="grid-content"></div></el-col>
        <el-col :span="4"><div class="grid-content"></div>
          <label><b>Last Name:</b></label>
          <el-input v-model="lastName" placeholder="Enter your Last Name" type="text"></el-input>
          <span class="error">{{ errorMsg.lastName }}</span>
        </el-col>
        <el-col :span="10"><div class="grid-content"></div></el-col>
      </el-row>

      <el-row>
        <el-col :span="10"><div class="grid-content"></div></el-col>
        <el-col :span="4"><div class="grid-content"></div>
          <label><b>Email:</b></label>
          <el-input v-model="email" placeholder="Enter your Email" type="email"></el-input>
          <span class="error">{{ errorMsg.email }}</span>
        </el-col>
        <el-col :span="10"><div class="grid-content"></div></el-col>
      </el-row>

      <el-row>
        <el-col :span="10"><div class="grid-content"></div></el-col>
        <el-col :span="4"><div class="grid-content"></div>
          <label><b>Password:</b></label>
          <el-input v-model="password" placeholder="Enter your Password" type="password" show-password></el-input>
          <span class="error">{{ errorMsg.password }}</span>
        </el-col>
        <el-col :span="10"><div class="grid-content"></div></el-col>
      </el-row>

      <el-row id="errors" hidden>
        <el-col :span="10"><div class="grid-content"></div></el-col>
        <el-col :span="4"><div class="grid-content"></div>
          <span class="error">{{ errorMsg.backendChecks }}</span>
        </el-col>
        <el-col :span="10"><div class="grid-content"></div></el-col>
      </el-row>

      <el-row>
        <el-col :span="10"><div class="grid-content"></div></el-col>
        <el-col :span="4"><div class="grid-content"></div>
          <el-button type="primary" v-on:click="register">Create Account</el-button>
        </el-col>
        <el-col :span="10"><div class="grid-content"></div></el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import {Users} from "../Api";

export default {
  name: "Register",

  data() {
    return {
      selectedFile: null,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      errorMsg: {
        'firstName': null,
        'lastName': null,
        'email': null,
        'password': null,
        'backendChecks': null
      },
      check: true,
    }
  },

  methods: {
    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
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

    register() {
      document.getElementById("errors").hidden = true;
      this.checkFirstName()
      this.checkLastName()
      this.checkEmail()
      this.checkPassword()

      if (!this.check) {
        this.check = true
      } else {
        Users.createNew(this.firstName, this.lastName, this.email, this.password)
            .then(() => {
              this.$router.push({name:"events"})
            })
            .catch((error) => {
              this.errorMsg.backendChecks = error.response.statusText.slice(error.response.statusText.indexOf(":") + 2)
              document.getElementById("errors").hidden = false;
            })
      }
    }
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 10px;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.error {
  color: red;
}

</style>