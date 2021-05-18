<template>
  <permission-denied v-if="hasPermission"></permission-denied>
  <div v-else>

  </div>
</template>

<script>
import PermissionDenied from "./PermissionDenied";
import Events from "./Events";

export default {
  name: "EventDetails",
  components: {PermissionDenied},
  data() {
    return {
      user: [],
      error: null,
      hasPermission: true
    }
  },

  mounted() {
    this.getEventData()
  },

  methods: {
    getUserData() {
      Events.getEventData(this.$route.params.id)
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