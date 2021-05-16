<template>
  <div>
    <div>
      <label><b>Email</b></label>
      <input v-model="email" placeholder="Enter your Email" type="email">
      <span>{{ errorMsg.email }}</span>
    </div>

    <div>
      <label><b>Password</b></label>
      <input v-model="password" placeholder="Enter your Password" type="password">
      <span>{{ errorMsg.password }}</span>
    </div>

    <div>
      <button @click="login">Login</button>
    </div>
  </div>
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
        'password': null
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
        this.msg['email'] = null
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
      this.checkEmail()
      this.checkPassword()

      if (!this.check) {
        this.check = true
      } else {
        Users.login(this.email, this.password)
      }
    }
  }
}
</script>

<style scoped>

</style>