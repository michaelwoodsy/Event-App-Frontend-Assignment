<template>
  <div v-if="dataReady">
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
      <el-col :span="6">
        <div class="grid-content"></div>
        <el-input v-model="searchValue" placeholder="Enter word or phrase" @keyup.enter="searchFilterEvents"
                  :inline="true"></el-input>
      </el-col>
      <el-col :span="4">
        <el-select
            style="margin-left: 20px"
            v-model="categoryFilter"
            multiple
            collapse-tags
            placeholder="Category Filter">
          <el-option
              v-for="category in categories"
              :key="category.name"
              :label="category.name"
              :value="category.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="2" style="margin-left: 10px">
        <div class="grid-content"></div>
        <el-button type="primary" icon="el-icon-search" @click="searchFilterEvents">Search</el-button>
      </el-col>
      <el-col :span="5">
        <div class="grid-content"></div>
      </el-col>
    </el-row>
    <br>

    <el-row>
      <el-col :span="1">
        <div class="grid-content"></div>
      </el-col>
      <el-col :span="22">
        <div class="grid-content"></div>
        <el-table
            :data="pagedTableData"
            :default-sort="{prop: 'date', order: 'ascending'}"
            @sort-change="sortResults"
            @row-click="viewEvent"
            stripe
            style="width: 100%">
          <el-table-column
              prop="eventImage"
              label="Image"
              width="100">
            <template v-slot="scope">
              <img v-if="!scope.row.defaultEventNeeded" :src="scope.row.eventImage" width="50" height="50"/>
              <img v-if="scope.row.defaultEventNeeded" src="../assets/defaultEvent.png" width="50" height="50"/>
            </template>
          </el-table-column>
          <el-table-column
              prop="date"
              label="Date and Time"
              sortable>
          </el-table-column>
          <el-table-column
              prop="title"
              label="Title"
              width="250">
          </el-table-column>
          <el-table-column
              prop="categoryNames"
              label="Categories"
              width="500">
          </el-table-column>
          <el-table-column
              prop="hostImage"
              label="Host"
              width="60">
            <template v-slot="scope">
              <img v-if="!scope.row.defaultHostNeeded" :src="scope.row.hostImage" width="50" height="50"/>
              <img v-if="scope.row.defaultHostNeeded" src="../assets/defaultProfile.jpg" width="50" height="50"/>
            </template>
          </el-table-column>
          <el-table-column
              prop="hostName"
              label=""
              width="150">
          </el-table-column>
          <el-table-column
              prop="numAcceptedAttendees"
              label="Attendance"
              sortable
              align="center"
              width="120">
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="1">
        <div class="grid-content"></div>
      </el-col>
    </el-row>
    <br>

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
  </div>
</template>

<script>
import {Event, EventImage, UserImage} from "../Api";

export default {
  name: 'Events',

  data() {
    return {
      searchValue: "",
      events: [],
      categoryFilter: [],
      categories: [],
      pageNum: 1,
      pageSize: 10,
      sort: "DATE_ASC",
      error: null,
      dataReady: false
    }
  },

  mounted() {
    this.getCategories()
    this.loadEvents()
    setTimeout(this.pageReady, 200)
  },

  computed: {
    pagedTableData() {
      return this.events.slice(this.pageSize * this.pageNum - this.pageSize, this.pageSize * this.pageNum)
    },
  },

  methods: {
    pageReady() {
      this.dataReady = true
    },

    sortResults(sortProps) {
      if (sortProps.prop === null && sortProps.order === null) {
        this.sort = "DATE_ASC"
      } else if (sortProps.prop === 'date' && sortProps.order === 'descending') {
        this.sort = "DATE_DESC"
      } else if (sortProps.prop === 'date' && sortProps.order === 'ascending') {
        this.sort = "DATE_ASC"
      } else if (sortProps.prop === 'numAcceptedAttendees' && sortProps.order === 'ascending') {
        this.sort = "ATTENDEES_ASC"
      } else if (sortProps.prop === 'numAcceptedAttendees' && sortProps.order === 'descending') {
        this.sort = "ATTENDEES_DESC"
      }
      this.searchFilterEvents()
    },

    setPage(val) {
      this.pageNum = val;
    },

    viewEvent(row) {
      this.$router.push({name: 'eventDetails', params: {id: row.eventId}})
    },

    getCategories() {
      Event.getCategories()
          .then((response) => {
            this.error = null
            this.categories = response.data
          })
          .catch((error) => {
            console.log(error.response.statusText)
          })
    },

    loadEvents() {
      Event.getEvents(this.sort)
          .then((response) => {
            this.tabulateResults(response.data)
          })
          .catch((error) => {
            console.log(error.response.statusText)
          })
    },

    tabulateResults(data) {
      this.error = null
      this.events = data
      for (let i = 0; i < this.events.length; i++) {
        EventImage.getEventImage(this.events[i].eventId)
            .then((response) => {
              this.events[i].eventImage = 'data:'
              this.events[i].eventImage += response.headers['content-type']
              this.events[i].eventImage += ";base64,"
              this.events[i].eventImage += Buffer.from(response.data, 'binary').toString('base64')
              this.events[i].defaultEventNeeded = false
            })
            .catch((error) => {
              this.events[i].defaultEventNeeded = true
              console.log(error.response.statusText)
            });

        Event.getEventData(this.events[i].eventId)
            .then((response) => {
              UserImage.getUserImage(response.data.organizerId)
                  .then((response) => {
                    this.events[i].hostImage = 'data:'
                    this.events[i].hostImage += response.headers['content-type']
                    this.events[i].hostImage += ";base64,"
                    this.events[i].hostImage += Buffer.from(response.data, 'binary').toString('base64')
                    this.events[i].defaultHostNeeded = false
                  })
                  .catch(() => {
                    this.events[i].defaultHostNeeded = true
                    console.log(this.events[i].hostImage)
                  });
            })
            .catch((error) => {
              console.log(error.response.statusText)
            });

        this.events[i].categoryNames = []
        for (let j = 0; j < this.events[i].categories.length; j++){
          for (let k = 0; k < this.categories.length; k++) {
            if (this.events[i].categories[j] === this.categories[k].id) {
              this.events[i].categoryNames.push(" " + this.categories[k].name)
            }
          }
        }
        this.events[i].date = this.events[i].date.slice(0, -8).replace("T", ", ")
        this.events[i].hostName = this.events[i].organizerFirstName + ' ' + this.events[i].organizerLastName
      }
    },


    createEvent() {
      this.$router.push({name: "createEvent"})
    },

    searchFilterEvents() {
      this.events = []
      if (this.searchValue === "" && this.categoryFilter.length === 0) {
        Event.getEvents(this.sort)
            .then((response) => {
              this.tabulateResults(response.data)
            })
            .catch((error) => {
              console.log(error.response.statusText)
            })
      } else if (this.searchValue !== "" && this.categoryFilter.length === 0) {
        Event.searchEvents(this.searchValue, this.sort)
            .then((response) => {
              let searchResponse = []
              for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].title.toLowerCase().includes(this.searchValue.toLowerCase())) {
                  searchResponse.push(response.data[i])
                }
              }
              this.tabulateResults(searchResponse)
            })
            .catch((error) => {
              console.log(error.response.statusText)
            })
      } else if (this.searchValue === "" && this.categoryFilter.length !== 0) {
        Event.filterEvents(this.categoryFilter, this.sort)
            .then((response) => {
              this.tabulateResults(response.data)
            })
            .catch((error) => {
              console.log(error.response.statusText)
            })
      } else {
        Event.searchFilterEvents(this.searchValue, this.categoryFilter, this.sort)
            .then((response) => {
              let searchResponse = []
              for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].title.toLowerCase().includes(this.searchValue.toLowerCase())) {
                  searchResponse.push(response.data[i])
                }
              }
              this.tabulateResults(searchResponse)
            })
            .catch((error) => {
              console.log(error.response.statusText)
            })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
