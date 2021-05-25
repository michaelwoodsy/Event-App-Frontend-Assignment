<template>
  <div v-if="dataReady">
    <permission-denied v-if="!hasPermission || inPast"></permission-denied>
    <event-exist v-else-if="!eventExists"></event-exist>
    <div v-else>
      <el-row>
        <el-col :span="9">
          <div class="grid-content"></div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content"></div>
          <el-form>
            <el-form-item>
              <h1>Edit Event:</h1>
            </el-form-item>
            <el-form-item>
              <p style="text-align:center;"><img v-if="defaultEventNeeded" src="../assets/defaultEvent.png"
                                                 style="width: 200px; height: 200px" fit="contain"/></p>
              <p style="text-align:center;"><img v-if="!defaultEventNeeded" :src="eventImageDisplay"
                                                 style="width: 200px; height: 200px" fit="contain"/></p>
            </el-form-item>
            <el-form-item>
              <label><b>Title:</b></label>
              <el-input placeholder="Please input event name" v-model="title" type="text"></el-input>
              <span class="error">{{ errorMsg.title }}</span>
            </el-form-item>
            <el-form-item>
              <label style="margin-right: 10px"><b>Categories:</b></label>
              <el-select v-model="categoryIds" multiple placeholder="Select">
                <el-option
                    v-for="category in categories"
                    :key="category.name"
                    :label="category.name"
                    :value="category.id">
                </el-option>
              </el-select>
              <br>
              <span class="error">{{ errorMsg.categoryIds }}</span>
            </el-form-item>
            <el-form-item>
              <label style="margin-right: 10px"><b>Date:</b></label>
              <el-date-picker
                  v-model="date"
                  type="datetime"
                  placeholder="Select date and time">
              </el-date-picker>
              <br>
              <span class="error">{{ errorMsg.date }}</span>
            </el-form-item>
            <el-form-item>
              <label style="margin-right: 10px"><b>Event Image:</b></label>
              <br>
              <input type="file" accept="image/jpeg,image/gif,image/png" @change="setEventImage">
              <br>
              <span class="error">{{ errorMsg.eventImage }}</span>
            </el-form-item>
            <el-form-item>
              <label><b>Description:</b></label>
              <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder="Provide an Event Description"
                  v-model="description">
              </el-input>
              <span class="error">{{ errorMsg.description }}</span>
            </el-form-item>
            <el-form-item>
              <label style="margin-right: 10px"><b>Maximum Capacity:</b></label>
              <el-input id="capacityInput" v-model="maxCapacity" :min="1" type="number"></el-input>
              <span class="error">{{ errorMsg.maxCapacity }}</span>
            </el-form-item>
            <el-form-item>
              <label style="margin-right: 10px"><b>Online or In-Person:</b></label>
              <el-radio v-model="isOnline" :label=true @change="toggleOnline">Online</el-radio>
              <el-radio v-model="isOnline" :label=false @change="toggleOnline">In-Person</el-radio>
              <br>
              <span class="error">{{ errorMsg.isOnline }}</span>
            </el-form-item>
            <el-form-item>
              <label><b>URL:</b></label>
              <el-input id="urlInput" placeholder="Please input event URL" v-model="eventUrl" type="url">
                <template #prepend>https://</template>
              </el-input>
              <span class="error">{{ errorMsg.eventUrl }}</span>
            </el-form-item>
            <el-form-item v-if="isOnline === false || isOnline === ''">
              <label><b>Venue:</b></label>
              <el-input id="venueInput" placeholder="Please input event venue" v-model="venue" type="text"></el-input>
              <span class="error">{{ errorMsg.venue }}</span>
            </el-form-item>
            <el-form-item>
              <label style="margin-right: 10px"><b>Requires Attendance Control:</b></label>
              <el-radio v-model="controlAttendanceStatus" :label=true>Yes</el-radio>
              <el-radio v-model="controlAttendanceStatus" :label=false>No</el-radio>
              <span class="error">{{ errorMsg.controlAttendanceStatus }}</span>
            </el-form-item>
            <el-form-item>
              <label><b>Fee:</b></label>
              <el-input id="feeInput" placeholder="Please input event fee" v-model="fee" :min="0" type="number">
                <template #prepend>$</template>
              </el-input>
              <span class="error">{{ errorMsg.fee }}</span>
            </el-form-item>
            <el-form-item>
              <span class="error" id="backendError" hidden>{{ errorMsg.backendChecks }}</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" v-on:click="editEvent">Save Changes</el-button>
              <el-button v-on:click="cancel">Cancel</el-button>
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
import EventExist from "./EventExist";
import PermissionDenied from "./PermissionDenied";
import {Event, EventImage} from "../Api";

export default {
  name: "EditEvent",
  components: {EventExist, PermissionDenied},

  data() {
    return {
      inPast: false,
      error: null,
      defaultEventNeeded: true,
      eventExists: true,
      hasPermission: false,
      similarEvents: [],
      title: '',
      categories: '',
      categoryIds: '',
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
      eventImageDisplay: '',
      checkedCapacity: '',
      checkedFee: '',
      eventImage: 'data:',
      errorMsg: {
        'eventImage': null,
        'title': null,
        'categoryIds': null,
        'date': null,
        'description': null,
        'maxCapacity': null,
        'isOnline': null,
        'eventUrl': null,
        'venue': null,
        'controlAttendanceStatus': null,
        'fee': null,
        'backendChecks': null
      },
      check: true,
      dataReady: false
    }
  },

  mounted() {
    this.checkExists()
    if (this.eventExists) {
      this.getCategories()
      this.getEventData()
      this.getImageData()
      setTimeout(this.pageReady, 200)
    }
  },

  methods: {
    pageReady() {
      this.dataReady = true
    },

    checkPermission() {
      this.hasPermission = !!(this.$store.getters.isLoggedIn && Number(this.organizerId) === this.$store.state.userId);
    },

    setEventImage(event) {
      try {
        const image = event.target.files[0]
        if (image.size <= 20e6) {
          this.eventImage = image
          this.defaultEventNeeded = false
          this.eventImageDisplay = URL.createObjectURL(this.eventImage)
          this.errorMsg['eventImage'] = ""
        } else {
          this.eventImage = null
          this.defaultEventNeeded = true
          this.errorMsg['eventImage'] = "Image is too large, please select another"
        }
      } catch (e) {
        this.defaultEventNeeded = true
        this.eventImage = null
      }
    },

    cancel() {
      this.$router.push({name: 'eventDetails', params: {id: this.$route.params.id}})
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
            let now = new Date()
            let eventDate = new Date(response.data.date)
            if (eventDate < now) {
              this.inPast = true
            }
            this.date = eventDate
            this.description = response.data.description
            this.maxCapacity = response.data.capacity
            if (this.maxCapacity === null) {
              this.maxCapacity = ''
            } else {
              this.maxCapacity = this.maxCapacity.toString()
            }
            this.isOnline = response.data.isOnline
            if (this.isOnline === 0) {
              this.isOnline = false
            } else if (this.isOnline === 1) {
              this.isOnline = true
            }
            this.eventUrl = response.data.url
            if (this.eventUrl === null) {
              this.eventUrl = ''
            }
            this.venue = response.data.venue
            if (this.venue === null) {
              this.venue = ''
            }
            this.controlAttendanceStatus = response.data.requiresAttendanceControl
            if (this.controlAttendanceStatus === 0) {
              this.controlAttendanceStatus = false
            } else if (this.controlAttendanceStatus === 1) {
              this.controlAttendanceStatus = true
            }
            this.fee = response.data.fee
            if (this.fee == 0.00) {
              this.fee = ''
            }
            this.organizerId = response.data.organizerId
            this.checkPermission()
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
            this.eventImageDisplay = this.eventImage
            this.defaultEventNeeded = false
          })
          .catch((error) => {
            console.log(error.response.statusText)
          });
    },

    toggleOnline() {
      if (this.isOnline === true) {
        this.venue = ''
      }
    },

    checkTitle() {
      if (this.title === '') {
        this.errorMsg['title'] = 'Please enter a title'
        this.check = false
      } else {
        this.errorMsg['title'] = null
      }
    },

    checkCategories() {
      if (this.categoryIds.length === 0) {
        this.errorMsg['categoryIds'] = 'Please select at least one category'
        this.check = false
      } else {
        this.errorMsg['categoryIds'] = null
      }
    },

    checkDate() {
      let currentDateTime = new Date();
      if (this.date === '') {
        this.errorMsg['date'] = 'Please provide an event date'
        this.check = false
      } else if (this.date < currentDateTime) {
        this.errorMsg['date'] = 'The date must be in the future'
        this.check = false
      } else {
        this.errorMsg['date'] = null
      }
    },

    checkImage() {
      if (this.eventImage === null) {
        this.errorMsg['eventImage'] = 'Please provide an event image'
        this.check = false
      } else {
        this.errorMsg['eventImage'] = null
      }
    },

    checkDescription() {
      if (this.title === '') {
        this.errorMsg['description'] = 'Please enter an event description'
        this.check = false
      } else {
        this.errorMsg['description'] = null
      }
    },

    checkMaxCapacity() {
      if (this.maxCapacity !== '' & this.maxCapacity.includes('.')) {
        this.errorMsg['maxCapacity'] = 'Please enter a whole number'
        this.check = false
      } else {
        this.errorMsg['maxCapacity'] = null
      }
    },

    checkIsOnline() {
      if (this.isOnline === '') {
        this.errorMsg['isOnline'] = 'Please select an option'
        this.check = false
      } else {
        this.errorMsg['isOnline'] = null
      }
    },

    checkUrl() {
      if (this.eventUrl === '' && this.isOnline === true) {
        this.errorMsg['eventUrl'] = 'Please enter an event URL'
        this.check = false
      } else {
        this.errorMsg['eventUrl'] = null
      }
    },

    checkVenue() {
      if (this.venue === '' && this.isOnline === false) {
        this.errorMsg['venue'] = 'Please provide a venue'
        this.check = false
      } else {
        this.errorMsg['venue'] = null
      }
    },

    checkAttendanceControl() {
      if (this.controlAttendanceStatus === '') {
        this.errorMsg['controlAttendanceStatus'] = 'Please select an option'
        this.check = false
      } else {
        this.errorMsg['controlAttendanceStatus'] = null
      }
    },

    editEvent() {
      document.getElementById("backendError").hidden = true;
      console.log(this.maxCapacity)
      this.checkTitle()
      this.checkCategories()
      this.checkDate()
      this.checkImage()
      this.checkDescription()
      this.checkMaxCapacity()
      this.checkIsOnline()
      this.checkUrl()
      this.checkVenue()
      this.checkAttendanceControl()

      if (!this.check) {
        this.check = true
      } else {
        let eventData = {}
        eventData.title = this.title
        eventData.description = this.description
        eventData.categoryIds = this.selectedCategories
        eventData.date = this.date.setHours(this.date.getHours() + 24)
        eventData.date = this.date.toISOString().slice(0, -1).replace('T', ' ')
        eventData.isOnline = this.isOnline
        eventData.requiresAttendanceControl = (this.controlAttendanceStatus === "true")
        if (this.maxCapacity !== '') {
          eventData.capacity = Number(this.maxCapacity)
        }
        if (this.fee !== '') {
          eventData.fee = Number(this.fee)
        }
        if (this.eventUrl !== '') {
          eventData.url = this.eventUrl
        }
        if (this.venue !== '') {
          eventData.venue = this.venue
        }
        Event.editEvent(Number(this.$route.params.id), eventData)
            .then(() => {
              if (this.eventImage.type !== undefined) {
                EventImage.setEventImage(Number(this.$route.params.id), this.eventImage, this.eventImage.type)
                    .then(() => {
                      this.$router.push({name: 'eventDetails', params: {id: this.$route.params.id}})
                    })
              } else {
                this.$router.push({name: 'eventDetails', params: {id: this.$route.params.id}})
              }
            })
            .catch((error) => {
              let errorString = error.response.statusText.slice(error.response.statusText.indexOf(":") + 2)
              this.errorMsg.backendChecks = errorString.charAt(0).toUpperCase() + errorString.slice(1)
              document.getElementById("backendError").hidden = false;
            })
      }
    }
  }
}
</script>

<style scoped>
.error {
  color: red;
}

</style>