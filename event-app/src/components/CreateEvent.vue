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
              <h1>Create Event:</h1>
            </el-form-item>
            <el-form-item>
              <p style="text-align:center;"><img v-if="defaultNeeded" src="../assets/defaultEvent.png"
                                                 style="width: 200px; height: 200px" fit="contain"/></p>
              <p style="text-align:center;"><img v-if="!defaultNeeded" :src="eventImageDisplay"
                                                 style="width: 200px; height: 200px" fit="contain"/></p>
            </el-form-item>
            <el-form-item>
              <label><b>Title:</b></label>
              <el-input placeholder="Please input event name" v-model="title" type="text"></el-input>
              <span class="error">{{ errorMsg.title }}</span>
            </el-form-item>
            <el-form-item>
              <label style="margin-right: 10px"><b>Categories:</b></label>
              <el-select v-model="selectedCategories" multiple placeholder="Select">
                <el-option
                    v-for="category in categories"
                    :key="category.name"
                    :label="category.name"
                    :value="category.id">
                </el-option>
              </el-select>
              <br>
              <span class="error">{{ errorMsg.selectedCategories }}</span>
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
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="Provide an Event Description"
                  v-model="description">
              </el-input>
              <span class="error">{{ errorMsg.description }}</span>
            </el-form-item>
            <el-form-item>
              <label style="margin-right: 10px"><b>Maximum Capacity:</b> (Leave empty if no capacity)</label>
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
              <label><b>Fee:</b> (Leave empty if no fee)</label>
              <el-input id="feeInput" placeholder="Please input event fee" v-model="fee" :min="0" type="number">
                <template #prepend>$</template>
              </el-input>
              <span class="error">{{ errorMsg.fee }}</span>
            </el-form-item>
            <el-form-item>
              <span class="error" id="backendError" hidden>{{ errorMsg.backendChecks }}</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" v-on:click="createEvent">Create Event</el-button>
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

import PermissionDenied from "./PermissionDenied";
import {Event, EventImage} from "../Api";

export default {
  name: "CreateEvent",
  components: {PermissionDenied},

  data() {
    return {
      checkedFee: false,
      checkedCapacity: false,
      title: '',
      selectedCategories: [],
      categories: [],
      date: '',
      description: '',
      maxCapacity: '',
      isOnline: '',
      eventUrl: '',
      venue: '',
      controlAttendanceStatus: '',
      fee: '',
      eventImage: null,
      eventImageDisplay: '',
      defaultNeeded: true,
      errorMsg: {
        'eventImage': null,
        'title': null,
        'selectedCategories': null,
        'date': null,
        'description': null,
        'maxCapacity': null,
        'isOnline': null,
        'eventUrl': null,
        'venue': null,
        'controlAttendanceStatus': null,
        'backendChecks': null
      },
      check: true,
      dataReady: false
    }
  },

  mounted() {
    this.getCategories()
    setTimeout(this.pageReady, 200)
  },

  computed: {
    hasPermission() {
      return !!this.$store.getters.isLoggedIn;
    }
  },

  methods: {
    pageReady() {
      this.dataReady = true
    },

    toggleOnline() {
      if (this.isOnline === true) {
        this.venue = ''
      }
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

    setEventImage(event) {
      try {
        const image = event.target.files[0]
        if (image.size <= 20e6) {
          this.eventImage = image
          this.defaultNeeded = false
          this.eventImageDisplay = URL.createObjectURL(this.eventImage)
          this.errorMsg['eventImage'] = ""
        } else {
          this.eventImage = null
          this.defaultNeeded = true
          this.errorMsg['eventImage'] = "Image is too large, please select another"
        }
      } catch (e) {
        this.defaultNeeded = true
        this.eventImage = null
      }
    },

    cancel() {
      this.$router.push({name: "events"})
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
      if (this.selectedCategories.length === 0) {
        this.errorMsg['selectedCategories'] = 'Please select at least one category'
        this.check = false
      } else {
        this.errorMsg['selectedCategories'] = null
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

    createEvent() {
      document.getElementById("backendError").hidden = true;
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
        eventData.date = this.date.setHours(this.date.value.getHours() + 24)
        eventData.date = this.date.toISOString().slice(0, -1).replace('T', ' ')
        eventData.isOnline = this.isOnline
        eventData.requiresAttendanceControl = this.requiresAttendanceControl
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
        Event.createNew(eventData)
            .then((response) => {
                  EventImage.setEventImage(response.data.eventId, this.eventImage, this.eventImage.type)
                      .then(() => {
                        this.$router.push({name: 'events'})
                      })
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