<template>
  <el-container>
    <el-header>

    </el-header>

    <el-divider></el-divider>

    <el-main>
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
              <label><b>Title:</b></label>
              <el-input placeholder="Please input event name" v-model="title" type="text"></el-input>
              <span class="error">{{ errorMsg.title }}</span>
            </el-form-item>
            <el-form-item>
              <label style="margin-right: 10px"><b>Categories:</b></label>
              <el-select v-model="selectedCategories" multiple placeholder="Select">
                <el-option
                    v-for="category in categories"
                    :key="category.categoryId"
                    :label="category.name"
                    :value="category.categoryId">
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
              <label style="margin-right: 10px"><b>Image:</b></label>
              <input type="file" @change="onFileSelected">
              <br>
              <span class="error">{{ errorMsg.selectedFile }}</span>
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
              <label><b>Maximum Capacity:</b></label>
              <el-input placeholder="Please input maximum capacity" v-model="maxCapacity" type="text"></el-input>
              <span class="error">{{ errorMsg.maxCapacity }}</span>
            </el-form-item>
            <el-form-item>
              <label style="margin-right: 10px"><b>Online or In-Person:</b></label>
              <el-radio v-model="isOnline" label=true>Online</el-radio>
              <el-radio v-model="isOnline" label=false>In-Person</el-radio>
              <span class="error">{{ errorMsg.isOnline }}</span>
            </el-form-item>
            <el-form-item>
              <label><b>URL:</b></label>
              <el-input placeholder="Please input event URL" v-model="eventUrl">
                <template #prepend>https://</template>
              </el-input>
              <span class="error">{{ errorMsg.eventUrl }}</span>
            </el-form-item>
            <el-form-item>
              <label><b>Venue:</b></label>
              <el-input placeholder="Please input event venue" v-model="venue" type="text"></el-input>
              <span class="error">{{ errorMsg.venue }}</span>
            </el-form-item>
            <el-form-item>
              <label style="margin-right: 10px"><b>Requires Attendance Control:</b></label>
              <el-radio v-model="controlAttendanceStatus" label=true>Yes</el-radio>
              <el-radio v-model="controlAttendanceStatus" label=false>No</el-radio>
              <span class="error">{{ errorMsg.controlAttendanceStatus }}</span>
            </el-form-item>
            <el-form-item>
              <label><b>Fee:</b></label>
              <el-input placeholder="Please input event fee" v-model="fee">
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
    </el-main>
  </el-container>
</template>

<script>

export default {
  name: "CreateEvent",

  data() {
    return {
      selectedFile: null,
      title: '',
      selectedCategories: [],
      categories: [{
        categoryId: 1,
        name: 'Film'
      }, {
        categoryId: 2,
        name: 'Festival'
      }, {
        categoryId: 3,
        name: 'Book Club'
      }, {
        categoryId: 4,
        name: 'Parade'
      }, {
        categoryId: 5,
        name: 'Debate'
      }],
      date: '',
      description: '',
      maxCapacity: '',
      isOnline: '',
      eventUrl: '',
      venue: '',
      controlAttendanceStatus: '',
      fee: '',
      errorMsg: {
        'selectedFile': null,
        'title': null,
        'selectedCategories': null,
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
    }
  },

  methods: {
    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
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
      if (this.selectedFile === null) {
        this.errorMsg['selectedFile'] = 'Please provide an event image'
        this.check = false
      } else {
        this.errorMsg['selectedFile'] = null
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
      if (this.maxCapacity === '') {
        this.errorMsg['maxCapacity'] = 'Please enter a maximum capacity'
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
      if (this.eventUrl === '') {
        this.errorMsg['eventUrl'] = 'Please enter an event URL'
        this.check = false
      } else {
        this.errorMsg['eventUrl'] = null
      }
    },

    checkVenue() {
      if (this.venue === '') {
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

    checkFee() {
      if (this.fee === '') {
        this.errorMsg['fee'] = 'Please provide an event fee'
        this.check = false
      } else {
        this.errorMsg['fee'] = null
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
      this.checkFee()

      if (!this.check) {
        this.check = true
      } else {
        console.log("Passes all tests!")
      }
    }
  }
}
</script>

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

.error {
  color: red;
}

</style>