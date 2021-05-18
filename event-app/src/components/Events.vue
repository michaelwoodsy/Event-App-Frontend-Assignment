<template>
  <el-row>
    <el-col :span="10">
      <div class="grid-content"></div>
    </el-col>
    <el-col :span="4">
      <div class="grid-content"></div>
      <h1>Event Search:</h1>
    </el-col>
    <el-col :span="10">
      <div class="grid-content"></div>
    </el-col>
  </el-row>

  <el-row>
    <el-col :span="4">
      <div class="grid-content"></div>
    </el-col>
    <el-col :span="3">
      <div class="grid-content"></div>
      <el-button type="primary" @click="createEvent">Create Event</el-button>
    </el-col>
    <el-col :span="8">
      <div class="grid-content"></div>
      <el-input v-model="searchValue" placeholder="Enter word or phrase" @keyup.enter="searchEvents"
                :inline="true"></el-input>
    </el-col>
    <el-col :span="2">
      <div class="grid-content"></div>
      <el-button type="primary" icon="el-icon-search" @click="searchEvents">Search</el-button>
    </el-col>
    <el-col :span="7">
      <div class="grid-content"></div>
    </el-col>
  </el-row>

  <el-row>
    <el-col :span="4">
      <div class="grid-content"></div>
    </el-col>
    <el-col :span="16">
      <div class="grid-content"></div>
      <el-table
          v-loading="loading"
          :data="pagedTableData"
          :default-sort="{prop: 'date', order: 'descending'}"
          row-click=""
          border
          style="width: 100%">
        <el-table-column
            prop="date"
            label="Date"
            sortable>
        </el-table-column>
        <el-table-column
            prop="title"
            label="Title">
        </el-table-column>
        <el-table-column
            prop="categories"
            label="Categories">
        </el-table-column>
        <el-table-column
            prop="organizerFirstName"
            label="Organiser">
        </el-table-column>
        <el-table-column
            prop="numAcceptedAttendees"
            label="Attendance"
            sortable
            width="180">
        </el-table-column>
      </el-table>
    </el-col>
    <el-col :span="4">
      <div class="grid-content"></div>
    </el-col>
  </el-row>

  <el-row>
    <el-col :span="8">
      <div class="grid-content"></div>
    </el-col>
    <el-col :span="8">
      <div class="grid-content"></div>
      <el-pagination
          style="text-align: center"
          background
          layout="prev, pager, next"
          @current-change="setPage"
          :total="events.length">
      </el-pagination>
    </el-col>
    <el-col :span="8">
      <div class="grid-content"></div>
    </el-col>
  </el-row>
</template>

<script>
import {Event} from "../Api";

export default {
  name: 'Events',

  data() {
    return {
      searchValue: "",
      events: [],
      tableEvents: [],
      categories: [],
      pageNum: 1,
      pageSize: 10,
      error: null,
      loading: true,
    }
  },

  mounted() {
    this.loadEvents();
    this.setTableEvents();
  },

  computed: {
    pagedTableData() {
      return this.events.slice(this.pageSize * this.pageNum - this.pageSize, this.pageSize * this.pageNum)
    }
  },

  methods: {

    setPage(val) {
      this.pageNum = val;
    },

    loadEvents() {
      this.events = []
      Event.getEvents()
          .then((response) => {
            this.error = null
            this.events = response.data
            this.loading = false
          })
          .catch((error) => {
            this.error = error
          })
    },

    setTableEvents() {
      for (let i = 0; i < this.events.length; i++) {
        let image = "https://www.nccer.org/images/default-source/Thumbnails/default-thumbnails/default-event-thumb.jpg"
        let date = this.events[i].date
        let title = this.events[i].title
        let categories = this.events[i].categories
        let organizerName = this.events[i].organizerFirstName + " " + this.events[i].organizerLastName
        let organizerImage = "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
        let attendees = this.events[i].numAcceptedAttendees
        let tableEvent = {
          image: image,
          date: date,
          title: title,
          categories: categories,
          organizerName: organizerName,
          organizerImage: organizerImage,
          attendees: attendees
        }
        this.tableEvents.push(tableEvent)
      }
    },

    createEvent() {
      this.$router.push({name: "createEvent"})
    },

    searchEvents() {
      this.events = []
      this.loading = true
      if (this.searchValue === "") {
        Event.getEvents()
            .then((response) => {
              this.error = null
              this.events = response.data
              this.loading = false
            })
            .catch((error) => {
              this.error = error
            })
      } else {
        Event.searchEvents(this.searchValue)
            .then((response) => {
              this.error = null
              this.events = response.data
              this.loading = false
            })
            .catch((error) => {
              this.error = error
            })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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

</style>
