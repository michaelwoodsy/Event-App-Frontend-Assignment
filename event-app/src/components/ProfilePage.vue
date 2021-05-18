<template>
  <permission-denied v-if="hasPermission"></permission-denied>
  <div v-else>

  </div>
</template>

<script>

import {User} from "../Api";
import PermissionDenied from "./PermissionDenied";

export default {
  name: "ProfilePage",
  components: {PermissionDenied},
  data() {
    return {
      user: [],
      error: null,
      hasPermission: true
    }
  },

  mounted() {
    this.getUserData()
  },

  methods: {
    getUserData() {
      User.getUserData(this.$route.params.id)
          .then((response) => {
            this.error = null
            this.user = response.data
          })
          .catch((error) => {
            this.error = error
          })
    }
  }
}
</script>

<style scoped>

</style>