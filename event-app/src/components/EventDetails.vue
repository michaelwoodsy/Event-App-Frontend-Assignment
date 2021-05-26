<template>
  <div v-if="dataReady">
    <event-exist v-if="!eventExists"></event-exist>
    <div v-else>
      <el-row>
        <el-col :span="4">
          <div class="grid-content">
            <el-button v-if="requestAttendance && !inPast && isLoggedIn" @click="requestDialogVisible = true"
                       style="float: right" type="success">
              Request Attendance
            </el-button>
            <el-dialog
                title="Confirm Request"
                v-model="requestDialogVisible"
                width="30%"
                :before-close="handleClose">
              <span>Are you sure you want to request attendance to this event?</span>
              <template #footer>
                <span>
                  <el-button @click="requestDialogVisible = false">Cancel</el-button>
                  <el-button type="success" @click="attendEvent">Confirm</el-button>
                </span>
              </template>
            </el-dialog>
            <el-button v-if="requestAttendance && !inPast && !isLoggedIn" @click="loginDialogVisible = true"
                       style="float: right" type="success">
              Request Attendance
            </el-button>
            <el-dialog
                title="Login Required"
                v-model="loginDialogVisible"
                width="30%"
                :before-close="handleClose">
              <span>You must be logged in to attend an event.</span>
              <template #footer>
                <span>
                  <el-button type="primary" @click="loginDialogVisible = false">Close</el-button>
                </span>
              </template>
            </el-dialog>
            <el-button v-if="attending && !inPast && isLoggedIn" @click="removeDialogVisible = true"
                       style="float: right" type="danger">Remove Attendance
            </el-button>
            <el-dialog
                title="Confirm Removal"
                v-model="removeDialogVisible"
                width="30%"
                :before-close="handleClose">
              <span>Are you sure you want to remove attendance?</span>
              <template #footer>
                <span>
                  <el-button @click="removeDialogVisible = false">Cancel</el-button>
                  <el-button type="danger" @click="removeAttendance">Confirm</el-button>
                </span>
              </template>
            </el-dialog>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content"></div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content"></div>
          <el-form>
            <el-form-item>
              <h1><span>{{ title }}</span></h1>
            </el-form-item>
            <el-form-item>
              <p style="text-align:center;"><img v-if="defaultEventNeeded" src="../assets/defaultEvent.png"
                                                 style="width: 200px; height: 200px" fit="contain"/></p>
              <p style="text-align:center;"><img v-if="!defaultEventNeeded" :src="eventImage"
                                                 style="width: 200px; height: 200px" fit="contain"/></p>
            </el-form-item>
            <el-form-item style="text-align: center">
              <el-button v-if="!inPast && hasPermission" @click="editEvent" type="primary">
                Edit Event
              </el-button>
              <el-button v-if="!inPast && hasPermission" @click="deleteDialogVisible = true" type="danger">Delete
                Event
              </el-button>
              <el-dialog
                  title="Confirm Delete"
                  v-model="deleteDialogVisible"
                  width="30%"
                  :before-close="handleClose">
                <span>Are you sure you want to delete this event?</span>
                <template #footer>
                <span>
                  <el-button @click="deleteDialogVisible = false">Cancel</el-button>
                  <el-button type="danger" @click="deleteEvent">Confirm</el-button>
                </span>
                </template>
              </el-dialog>
            </el-form-item>
            <el-form-item>
              <label><b>Description:</b></label>
              <br>
              <span>{{ description }}</span>
            </el-form-item>
            <el-form-item>
              <label style="margin-right: 5px"><b>Date and Time:</b></label>
              <span>{{ date }}</span>
            </el-form-item>
            <el-form-item>
              <label style="margin-right: 5px"><b>Categories:</b></label>
              <span>{{ categoryNames }}</span>
            </el-form-item>
            <el-form-item>
              <label style="margin-right: 5px"><b>Organizer:</b></label>
              <el-button type="text" @click="organizerDialogVisible = true">
                <span>{{ organizerFirstName }} {{ organizerLastName }}</span></el-button>
              <el-dialog
                  title="Organizer Details:"
                  v-model="organizerDialogVisible"
                  width="30%"
                  :before-close="handleClose">
                <el-form>
                  <el-form-item>
                    <p style="text-align:center;"><img v-if="defaultUserNeeded" src="../assets/defaultProfile.jpg"
                                                       style="width: 200px; height: 200px" fit="contain"/></p>
                    <p style="text-align:center;"><img v-if="!defaultUserNeeded" :src="organizerImage"
                                                       style="width: 200px; height: 200px" fit="contain"/></p>
                  </el-form-item>
                  <el-form-item>
                    <label style="margin-right: 5px"><b>Name:</b></label>
                    <span>{{ organizerFirstName }} {{ organizerLastName }}</span>
                  </el-form-item>
                </el-form>
                <template #footer>
                <span class="dialog-footer">
                  <el-button type="primary" @click="organizerDialogVisible = false">Close</el-button>
                </span>
                </template>
              </el-dialog>
            </el-form-item>
            <el-form-item>
              <label style="margin-right: 5px"><b>Capacity:</b></label>
              <span>{{ maxCapacity }}</span>
            </el-form-item>
            <el-form-item>
              <label style="margin-right: 5px"><b>Attendees:</b></label>
              <span>{{ attendees }}</span>
              <el-button style="margin-left: 20px" v-if="attendees!==0" type="primary"
                         @click="attendeeDialogVisible = true">View Attendees
              </el-button>
              <el-dialog
                  title="Event Attendees:"
                  v-model="attendeeDialogVisible"
                  width="50%"
                  :before-close="handleClose">
                <span style="margin: auto">Number of attendees:
                  <span v-if="maxCapacity === 'No Capacity Limit'">{{ attendees }} (No Capacity Limit)</span>
                  <span v-else>{{ attendees }}/{{ maxCapacity }}</span>
                </span>
                <el-table
                    height="300"
                    :data="attendeeList"
                    :default-sort="{prop: 'dateOfInterest', order: 'descending'}"
                    stripe
                    style="width: 100%">
                  <el-table-column
                      prop="image"
                      width="100">
                    <template v-slot="scope">
                      <img v-if="scope.row.image === 'default'" src="../assets/defaultProfile.jpg" width="50"
                           height="50"/>
                      <img v-else :src="scope.row.image" width="50" height="50"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                      prop="name"
                      label="Name">
                  </el-table-column>
                  <el-table-column
                      prop="type"
                      label="Type">
                  </el-table-column>
                </el-table>
                <template #footer>
                <span class="dialog-footer">
                  <el-button type="primary" @click="attendeeDialogVisible = false">Close</el-button>
                </span>
                </template>
              </el-dialog>
            </el-form-item>
            <el-form-item>
              <label style="margin-right: 5px"><b>URL:</b></label>
              <span v-if="eventUrl==='No Event URL'">{{ eventUrl }}</span>
              <el-link v-else :underline="false" :href="eventUrl"><span>{{ eventUrl }}</span></el-link>
            </el-form-item>
            <el-form-item>
              <label style="margin-right: 5px"><b>Venue:</b></label>
              <span>{{ venue }}</span>
            </el-form-item>
            <el-form-item>
              <label style="margin-right: 5px"><b>Fee:</b></label>
              <span v-if="fee==='Free'">{{ fee }}</span>
              <span v-else>${{ fee }}</span>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4">
          <div class="grid-content"></div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content"></div>
          <el-button style="text-align: right" v-if="!inPast && hasPermission" @click="manageRequests" type="primary">
            Manage Attendees
          </el-button>
        </el-col>
      </el-row>
      <div v-if="similarEvents.length===0">
        <el-row>
          <el-col :span="8">
            <div class="grid-content"></div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content"></div>
            <h2 style="text-align: center; color: #909399">No Similar Events Available</h2>
          </el-col>
          <el-col :span="8">
            <div class="grid-content"></div>
          </el-col>
        </el-row>
      </div>
      <div v-else>
        <el-row>
          <el-col :span="8">
            <div class="grid-content"></div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content"></div>
            <h1 type="danger" style="text-align: center">Similar Events:</h1>
          </el-col>
          <el-col :span="8">
            <div class="grid-content"></div>
          </el-col>
        </el-row>
        <br>
        <el-row>
          <el-col :span="3">
            <div class="grid-content"></div>
          </el-col>
          <el-col :span="18">
            <div class="grid-content"></div>
            <el-table
                height="500"
                :data="similarEvents"
                :default-sort="{prop: 'date', order: 'descending'}"
                stripe
                @row-click="viewEvent"
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
                  width="400">
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
          <el-col :span="3">
            <div class="grid-content"></div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>

import {Event, EventAttendee, EventImage, User, UserImage} from "../Api";
import EventExist from "./EventExist";

export default {
  name: "EventDetails",
  components: {EventExist},

  data() {
    return {
      inPast: false,
      organizerDialogVisible: false,
      deleteDialogVisible: false,
      attendeeDialogVisible: false,
      requestDialogVisible: false,
      loginDialogVisible: false,
      removeDialogVisible: false,
      error: null,
      defaultEventNeeded: true,
      defaultUserNeeded: true,
      eventExists: true,
      hasPermission: false,
      similarEvents: [],
      attendeeList: [],
      title: '',
      categories: '',
      categoryIds: '',
      categoryNames: [],
      date: '',
      description: '',
      maxCapacity: '',
      isOnline: '',
      eventUrl: '',
      venue: '',
      controlAttendanceStatus: '',
      attendees: '',
      fee: '',
      organizerId: '',
      organizerFirstName: '',
      organizerLastName: '',
      organizerImage: 'data:',
      eventImage: 'data:',
      eventImageDisplay: '',
      dataReady: false,
      requestAttendance: true,
      attending: false,
    }
  },

  mounted() {
    this.checkExists()
    if (this.eventExists === true) {
      this.getCategories()
      this.getEventData()
      this.getImageData()
      this.getAttendeeData()
      setTimeout(this.pageReady, 200)
    }
  },

  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn
    },
  },

  methods: {
    pageReady() {
      this.dataReady = true
    },

    checkPermission() {
      this.hasPermission = !!(this.$store.getters.isLoggedIn && Number(this.organizerId) === this.$store.state.userId);
    },

    editEvent() {
      this.$router.push({name: 'editEvent', params: {id: this.$route.params.id}})
    },

    manageRequests() {
      this.$router.push({name: 'manageRequests', params: {id: this.$route.params.id}})
    },

    deleteEvent() {
      Event.deleteEvent(this.$route.params.id)
          .then(() => {
            this.$router.push({name: 'events'})
          })
          .catch((error) => {
            console.log(error.response.statusText)
          });
    },

    handleClose(done) {
      this.$confirm('Are you sure to close this dialog?')
          .then(() => {
            done();
            this.dialogVisible = false
          })
          .catch(() => {
          });
    },

    viewEvent(row) {
      this.$router.push({name: 'eventDetails', params: {id: row.eventId}})
    },


    getSimilarEvents() {
      Event.filterEvents(this.categoryIds)
          .then((response) => {
            this.tabulateResults(response)
          })
          .catch((error) => {
            console.log(error.response.statusText)
          })
    },

    tabulateResults(response) {
      this.error = null
      this.similarEvents = response.data
      for (let i = 0; i < this.similarEvents.length; i++) {
        if (this.similarEvents[i].eventId === Number(this.$route.params.id)) {
          this.similarEvents.splice(i, 1)
        }
      }
      for (let i = 0; i < this.similarEvents.length; i++) {
        EventImage.getEventImage(this.similarEvents[i].eventId)
            .then((response) => {
              this.similarEvents[i].eventImage = 'data:'
              this.similarEvents[i].eventImage += response.headers['content-type']
              this.similarEvents[i].eventImage += ";base64,"
              this.similarEvents[i].eventImage += Buffer.from(response.data, 'binary').toString('base64')
              this.similarEvents[i].defaultEventNeeded = false
            })
            .catch((error) => {
              this.similarEvents[i].defaultEventNeeded = true
              console.log(error.response.statusText)
            });

        Event.getEventData(this.similarEvents[i].eventId)
            .then((response) => {
              UserImage.getUserImage(response.data.organizerId)
                  .then((response) => {
                    this.similarEvents[i].hostImage = 'data:'
                    this.similarEvents[i].hostImage += response.headers['content-type']
                    this.similarEvents[i].hostImage += ";base64,"
                    this.similarEvents[i].hostImage += Buffer.from(response.data, 'binary').toString('base64')
                    this.similarEvents[i].defaultHostNeeded = false
                  })
                  .catch(() => {
                    this.similarEvents[i].defaultHostNeeded = true
                    console.log(this.similarEvents[i].hostImage)
                  });
            })
            .catch((error) => {
              console.log(error.response.statusText)
            });
        let currentDate = new Date()
        if (this.similarEvents[i].date < currentDate) {
          this.inPast = true
        }
        this.similarEvents[i].date = this.similarEvents[i].date.slice(0, -8).replace("T", ", ")
        this.similarEvents[i].hostName = this.similarEvents[i].organizerFirstName + ' ' + this.similarEvents[i].organizerLastName
      }
    },

    checkExists() {
      Event.getEventData(Number(this.$route.params.id))
          .then(() => {
            this.eventExists = true
          })
          .catch((error) => {
            console.log(error.response.statusText)
            this.eventExists = false
          });
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

    getEventData() {
      Event.getEventData(Number(this.$route.params.id))
          .then((response) => {
            this.error = null
            this.title = response.data.title
            this.categoryIds = response.data.categories
            for (let j = 0; j < this.categoryIds.length; j++) {
              for (let k = 0; k < this.categories.length; k++) {
                if (this.categoryIds[j] === this.categories[k].id) {
                  this.categoryNames.push(this.categories[k].name)
                }
              }
            }
            let now = new Date()
            let eventDate = new Date(response.data.date)
            if (eventDate < now) {
              this.inPast = true
            }
            this.categoryNames = this.categoryNames.join(', ')
            this.date = response.data.date.slice(0, -8).replace("T", ", ")
            this.description = response.data.description
            this.maxCapacity = response.data.capacity
            this.isOnline = response.data.isOnline
            this.eventUrl = response.data.url
            this.venue = response.data.venue
            this.controlAttendanceStatus = response.data.requiresAttendanceControl
            this.fee = response.data.fee
            this.attendees = response.data.attendeeCount
            this.organizerId = response.data.organizerId
            this.checkPermission()
            if (this.fee === null || Number(this.fee) === 0) {
              this.fee = 'Free'
            }
            if (this.eventUrl === null) {
              this.eventUrl = 'No Event URL'
            } else {
              this.eventUrl = 'https://' + this.eventUrl
            }
            if (this.venue === null || this.isOnline === 1) {
              this.venue = 'No Venue (Online)'
            }
            if (this.maxCapacity === null) {
              this.maxCapacity = 'No Capacity Limit'
            }
            if (this.attendees === null) {
              this.attendees = 0
            }
            this.getHostData()
            this.getSimilarEvents()
          })
          .catch((error) => {
            console.log(error.response.statusText)
          });
    },

    getImageData() {
      EventImage.getEventImage(this.$route.params.id)
          .then((response) => {
            this.eventImage += response.headers['content-type']
            this.eventImage += ";base64,"
            this.eventImage += Buffer.from(response.data, 'binary').toString('base64')
            this.defaultEventNeeded = false
          })
          .catch((error) => {
            console.log(error.response.statusText)
          });
    },

    getHostData() {
      User.getUserData(this.organizerId)
          .then((response) => {
            this.error = null
            this.organizerFirstName = response.data.firstName
            this.organizerLastName = response.data.lastName
            this.getOrganizerImageData()
          })
          .catch((error) => {
            this.error = error
            console.log(error.response.statusText)
          })
    },

    getOrganizerImageData() {
      UserImage.getUserImage(this.organizerId)
          .then((response) => {
            this.organizerImage += response.headers['content-type']
            this.organizerImage += ";base64,"
            this.organizerImage += Buffer.from(response.data, 'binary').toString('base64')
            this.defaultUserNeeded = false
          })
          .catch((error) => {
            console.log(error.response.statusText)
          });
    },

    attendEvent() {
      EventAttendee.requestAttendance(this.$route.params.id)
          .then(() => {
            this.$router.go(0)
          })
          .catch((error) => {
            this.error = error
            console.log(error.response.statusText)
          })
    },

    removeAttendance() {
      EventAttendee.removeAttendance(this.$route.params.id)
          .then(() => {
            this.$router.go(0)
          })
          .catch((error) => {
            this.error = error
            console.log(error.response.statusText)
          })
    },

    getAttendeeData() {
      EventAttendee.getEventAttendees(this.$route.params.id)
          .then((response) => {
            let attendeeData = response.data
            for (let i = 0; i < attendeeData.length; i++) {
              if (attendeeData[i].attendeeId === this.$store.state.userId) {
                this.requestAttendance = false
                if (attendeeData[i].status !== "rejected") {
                  this.attending = true
                }
              }
              if (attendeeData[i].status === "accepted") {
                UserImage.getUserImage(attendeeData[i].attendeeId)
                    .then((response) => {
                      attendeeData[i].image = 'data:'
                      attendeeData[i].image += response.headers['content-type']
                      attendeeData[i].image += ";base64,"
                      attendeeData[i].image += Buffer.from(response.data, 'binary').toString('base64')
                    })
                    .catch((error) => {
                      attendeeData[i].image = 'default'
                      console.log(error.response.statusText)
                    });
                attendeeData[i].name = attendeeData[i].firstName + ' ' + attendeeData[i].lastName
                this.attendeeList.push(attendeeData[i])
              }
            }
            if (this.attendeeList.length === this.maxCapacity) {
              this.requestAttendance = false
            }
            Event.getEventData(this.$route.params.id)
                .then((response) => {
                  for (let i = 0; i < this.attendeeList.length; i++) {
                    if (this.attendeeList[i].attendeeId === response.data.organizerId) {
                      this.attendeeList[i].type = 'Organizer'
                    } else {
                      this.attendeeList[i].type = 'Attendee'
                    }
                  }
                })
                .catch((error) => {
                  this.error = error
                  console.log(error.response.statusText)
                })
          })
          .catch((error) => {
            this.error = error
            console.log(error.response.statusText)
          })
    },

  }
}
</script>

<style scoped>

</style>