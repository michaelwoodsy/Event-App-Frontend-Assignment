<template>
  <el-row>
    <el-col :span="9">
      <div class="grid-content"></div>
    </el-col>
    <el-col :span="6">
      <div class="grid-content"></div>
      <el-form>
        <el-form-item>
          <h1>Login:</h1>
        </el-form-item>
        <el-form-item>
          <label><b>Email:</b></label>
          <el-input v-model="email" placeholder="Enter your Email" type="email"></el-input>
          <span class="error">{{ errorMsg.email }}</span>
        </el-form-item>
        <el-form-item>
          <label><b>Password:</b></label>
          <el-input v-model="password" placeholder="Enter your Password" type="password"></el-input>
          <span class="error">{{ errorMsg.password }}</span>
        </el-form-item>
        <el-form-item>
          <span class="error" id="backendError" hidden>{{ errorMsg.backendChecks }}</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="login">Login</el-button>
          <el-button v-on:click="cancel">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="9">
      <div class="grid-content"></div>
    </el-col>
  </el-row>
</template>

<script>
import {User} from "../Api";

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

    cancel() {
      this.$router.push({name: "events"})
    },

    login() {
      document.getElementById("backendError").hidden = true;
      this.checkEmail()
      this.checkPassword()

      if (!this.check) {
        this.check = true
      } else {
        User.login(this.email, this.password)
            .then(() => {
              this.$router.push({name: "events"})
            })
            .catch((error) => {
              this.errorMsg.backendChecks = error.response.statusText.slice(error.response.statusText.indexOf(":") + 2)
              document.getElementById("backendError").hidden = false;
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