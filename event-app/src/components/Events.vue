<template>
  <div>
    <input id="search"
           v-model="searchValue"
           placeholder="Enter word or phrase"
           type="search"
           @keyup.enter="searchEvents">
    <div>
      <button type="button" @click="searchEvents">Search</button>
    </div>
  </div>
</template>

<script>
import {Events} from "../Api";

export default {
  name: 'Events',

  data() {
    return {
      searchValue: "",
      events: [],
      error: null
    }
  },

  methods: {
    searchEvents() {
      this.events = []
      Events.getEvents(this.searchValue)
          .then((response) => {
            this.error = null
            this.events = response.data
          })
          .catch((error) => {
            this.error = error
          })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
