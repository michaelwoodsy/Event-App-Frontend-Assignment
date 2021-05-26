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
              <h1>My Profile:</h1>
            </el-form-item>
            <el-form-item>
              <p style="text-align:center;"><img v-if="defaultNeeded" src="../assets/defaultProfile.jpg"
                                                 style="width: 200px; height: 200px" fit="contain"/></p>
              <p style="text-align:center;"><img v-if="!defaultNeeded" :src="profilePicture"
                                                 style="width: 200px; height: 200px" fit="contain"/></p>
            </el-form-item>
            <el-form-item>
              <label style="margin-right: 5px"><b>Name:</b></label>
              <span>{{ firstName }} {{ lastName }}</span>
            </el-form-item>
            <el-form-item>
              <label style="margin-right: 5px"><b>Email:</b></label>
              <span>{{ email }}</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" v-on:click="editProfile">Edit Profile</el-button>
              <el-button type="primary" v-if="attendingEvents.length > 0 || hostingEvents.length > 0" v-on:click="dialogVisible = true">View your Events</el-button>
              <el-dialog
                  title="My Events:"
                  v-model="dialogVisible"
                  width="90%"
                  :before-close="handleClose">
                <div v-if="attendingEvents.length > 0">
                  <h2 style="text-align: center">Events Attending:</h2>
                  <el-table
                      :data="attendingEvents"
                      :default-sort="{prop: 'date', order: 'ascending'}"
                      @row-click="viewEvent"
                      height="350"
                      stripe>
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
                        label="Date and Time">
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
                        width="100"
                        align="center">
                    </el-table-column>
                  </el-table>
                </div>
                <div v-if="hostingEvents.length > 0">
                  <br>
                  <h2 style="text-align: center">Events Hosting:</h2>
                  <el-table
                      :data="hostingEvents"
                      :default-sort="{prop: 'date', order: 'ascending'}"
                      @row-click="viewEvent"
                      height="350"
                      stripe>
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
                        label="Date and Time">
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
                        width="100"
                        align="center">
                    </el-table-column>
                  </el-table>
                </div>
                <template #footer>
                <span class="dialog-footer">
                  <el-button type="primary" @click="dialogVisible = false">Close</el-button>
                </span>
                </template>
              </el-dialog>
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

import {Event, EventAttendee, EventImage, User, UserImage} from "../Api";
import PermissionDenied from "./PermissionDenied";

export default {
  name: "ProfilePage",
  components: {PermissionDenied},
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      events: [],
      attendingEvents: [],
      hostingEvents: [],
      categories: [],
      sort: 'DATE_ASC',
      error: null,
      hasPermission: false,
      dialogVisible: false,
      profilePicture: 'data:',
      defaultNeeded: true,
      dataReady: false
    }
  },

  mounted() {
    this.checkPermission()
    this.getCategories()
    this.getUserData()
    this.getImageData()
    this.loadEvents()
    setTimeout(this.pageReady, 200)
  },

  computed: {
    userId() {
      return Number(this.$route.params.id)
    }
  },

  methods: {
    handleClose(done) {
      this.$confirm('Are you sure to close this dialog?')
          .then(() => {
            done();
            this.dialogVisible = false
          })
          .catch(() => {
          });
      console.log(this.events)
      console.log(this.myEvents)
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

    pageReady() {
      this.dataReady = true
    },

    checkPermission() {
      this.hasPermission = !!(this.$store.getters.isLoggedIn && Number(this.$route.params.id) === this.$store.state.userId);
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
            console.log(error.response.statusText)
          });
    },

    getImageData() {
      UserImage.getUserImage(this.$store.state.userId)
          .then((response) => {
            this.profilePicture += response.headers['content-type']
            this.profilePicture += ";base64,"
            this.profilePicture += Buffer.from(response.data, 'binary').toString('base64')
            this.defaultNeeded = false
          })
          .catch((error) => {
            console.log(error.response.statusText)
          });
    },

    editProfile() {
      this.$router.push({name: 'editProfile', params: {id: this.$store.state.userId}})
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
              this.events[i].organizerId = response.data.organizerId
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
        for (let j = 0; j < this.events[i].categories.length; j++) {
          for (let k = 0; k < this.categories.length; k++) {
            if (this.events[i].categories[j] === this.categories[k].id) {
              this.events[i].categoryNames.push(" " + this.categories[k].name)
            }
          }
        }
        this.events[i].date = this.events[i].date.slice(0, -8).replace("T", ", ")
        this.events[i].hostName = this.events[i].organizerFirstName + ' ' + this.events[i].organizerLastName

        EventAttendee.getEventAttendees(this.events[i].eventId)
            .then((response) => {
              this.events[i].attendeeList = response.data
              this.events[i].myEvent = ''
              if (this.events[i].organizerId === this.userId) {
                this.events[i].myEvent = true
                this.hostingEvents.push(this.events[i])
              }
              for (const attendee in this.events[i].attendeeList) {
                if (this.events[i].attendeeList[attendee].attendeeId === this.userId && this.events[i].attendeeList[attendee].status === 'accepted') {
                  this.events[i].myEvent = true
                  this.attendingEvents.push(this.events[i])
                }
              }
            })
            .catch((error) => {
              console.log(error.response.statusText)
            });

      }
    },
  }
}
</script>

<style scoped>

</style>