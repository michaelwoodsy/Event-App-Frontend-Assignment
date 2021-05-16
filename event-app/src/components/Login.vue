<template>
  <el-container>
    <el-header>

    </el-header>

    <el-divider></el-divider>

    <el-main>
      <el-row>
        <el-col :span="10">
          <div class="grid-content"></div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content"></div>
          <h1>Login:</h1>
        </el-col>
        <el-col :span="10">
          <div class="grid-content"></div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="10">
          <div class="grid-content"></div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content"></div>
          <label><b>Email:</b></label>
          <el-input v-model="email" placeholder="Enter your Email" type="email"></el-input>
          <span class="error">{{ errorMsg.email }}</span>
        </el-col>
        <el-col :span="10">
          <div class="grid-content"></div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="10">
          <div class="grid-content"></div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content"></div>
          <label><b>Password:</b></label>
          <el-input v-model="password" placeholder="Enter your Password" type="password"></el-input>
          <span class="error">{{ errorMsg.password }}</span>
        </el-col>
        <el-col :span="10">
          <div class="grid-content"></div>
        </el-col>
      </el-row>

      <el-row id="errors" hidden>
        <el-col :span="10">
          <div class="grid-content"></div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content"></div>
          <span class="error">{{ errorMsg.backendChecks }}</span>
        </el-col>
        <el-col :span="10">
          <div class="grid-content"></div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="10">
          <div class="grid-content"></div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content"></div>
          <el-button type="primary" @click="login">Login</el-button>
        </el-col>
        <el-col :span="10">
          <div class="grid-content"></div>
        </el-col>
      </el-row>

    </el-main>
  </el-container>
</template>

<script>
import {Users} from "../Api";

export default {
  name: "Login",

  data() {
    return {
      email: '',
      password: '',
      error: null,
      errorMsg: {
        'email': null,
        'password': null,
        'backendChecks': null
      },
      check: true
    }
  },

  methods: {
    checkEmail() {
      if (this.email === '') {
        this.errorMsg['email'] = 'Please enter an email'
        this.check = false
      } else {
        this.errorMsg['email'] = null
      }
    },

    checkPassword() {
      if (this.password === '') {
        this.errorMsg['password'] = 'Please enter a password'
        this.check = false
      } else {
        this.errorMsg['password'] = null
      }
    },

    login() {
      document.getElementById("errors").hidden = true;
      this.checkEmail()
      this.checkPassword()

      if (!this.check) {
        this.check = true
      } else {
        Users.login(this.email, this.password)
            .then(() => {
              this.$router.push({name: "events"})
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