<template>
  <div v-if="dataReady">
    <permission-denied v-if="!hasPermission || inPast"></permission-denied>
    <event-exist v-else-if="!eventExists"></event-exist>
    <div v-else-if="attendeeData.length === 0">
      <el-row>
        <el-col :span="6">
          <div class="grid-content"></div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content"></div>
          <h1 style="text-align: center">This event does not have any attendees</h1>
        </el-col>
        <el-col :span="6">
          <div class="grid-content"></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <div class="grid-content"></div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content"></div>
          <el-button type="primary" @click="back" icon="el-icon-arrow-left">Head back to event details here</el-button>
        </el-col>
        <el-col :span="10">
          <div class="grid-content"></div>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <el-row>
        <el-col :span="9">
          <div class="grid-content"></div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content"></div>
          <h1>Manage Attendees:</h1>
        </el-col>
        <el-col :span="9">
          <div class="grid-content"></div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">
          <div class="grid-content"></div>
        </el-col>
        <el-col :span="16">
          <div class="grid-content"></div>
          <el-dialog
              title="Edit User Status"
              v-model="editDialogVisible"
              width="30%"
              :before-close="handleClose">
            <span>Select the new attendance status of {{ userName }}</span>
            <template #footer>
            <span class="dialog-footer">
              <el-button align="left" @click="editDialogVisible = false">Cancel</el-button>
              <el-button type="danger" @click="setRejected">Rejected</el-button>
              <el-button type="warning" @click="setPending">Pending</el-button>
              <el-button type="success" @click="setAccepted">Accepted</el-button>
            </span>
            </template>
          </el-dialog>
          <el-table
              height="350"
              :data="attendeeData"
              :default-sort="{prop: 'dateOfInterest', order: 'descending'}"
              stripe
              style="width: 100%">
            <el-table-column
                prop="image"
                width="100">
              <template v-slot="scope">
                <img v-if="scope.row.image === 'default'" src="../assets/defaultProfile.jpg" width="50" height="50"/>
                <img v-else :src="scope.row.image" width="50" height="50"/>
              </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="Name">
            </el-table-column>
            <el-table-column
                prop="date"
                label="Date of Interest">
            </el-table-column>
            <el-table-column
                prop="status"
                label="Status">
            </el-table-column>
            <el-table-column>
              <template #default="scope">
                <el-button
                    size="mini"
                    @click="handleEdit(scope.row)">Edit Attendance Status
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="4">
          <div class="grid-content"></div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import EventExist from "./EventExist";
import PermissionDenied from "./PermissionDenied";
import {Event, EventAttendee, UserImage} from "../Api";

export default {
  name: "ManageRequests",
  components: {EventExist, PermissionDenied},

  data() {
    return {
      dataReady: false,
      eventExists: true,
      hasPermission: false,
      inPast: false,
      organizerId: '',
      attendeeData: [],
      userId: '',
      userName: '',
      editDialogVisible: false
    }
  },

  mounted() {
    this.checkExists()
    if (this.eventExists) {
      this.getEventData()
      this.getAttendeeData()
      setTimeout(this.pageReady, 200)
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
    },

    handleEdit(row) {
      this.userId = row.attendeeId
      this.userName = row.name
      this.editDialogVisible = true
    },

    back() {
      this.$router.push({name: 'eventDetails', params: {id: this.$route.params.id}})
    },

    pageReady() {
      this.dataReady = true
    },

    checkPermission() {
      this.hasPermission = !!(this.$store.getters.isLoggedIn && Number(this.organizerId) === this.$store.state.userId);
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

    getEventData() {
      Event.getEventData(Number(this.$route.params.id))
          .then((response) => {
            let now = new Date()
            let eventDate = new Date(response.data.date)
            if (eventDate < now) {
              this.inPast = true
            }
            this.organizerId = response.data.organizerId
            this.checkPermission()
          })
          .catch((error) => {
            console.log(error.response.statusText)
          });
    },

    getAttendeeData() {
      EventAttendee.getEventAttendees(this.$route.params.id)
          .then((response) => {
            this.attendeeData = response.data
            for (let i = 0; i < this.attendeeData.length; i++) {
              UserImage.getUserImage(this.attendeeData[i].attendeeId)
                  .then((response) => {
                    this.attendeeData[i].image = 'data:'
                    this.attendeeData[i].image += response.headers['content-type']
                    this.attendeeData[i].image += ";base64,"
                    this.attendeeData[i].image += Buffer.from(response.data, 'binary').toString('base64')
                  })
                  .catch((error) => {
                    this.attendeeData[i].image = 'default'
                    console.log(error.response.statusText)
                  });
              this.attendeeData[i].date = this.attendeeData[i].dateOfInterest.slice(0, -8).replace("T", ", ")
              this.attendeeData[i].status = this.attendeeData[i].status.charAt(0).toUpperCase() + this.attendeeData[i].status.slice(1)
              this.attendeeData[i].name = this.attendeeData[i].firstName + ' ' + this.attendeeData[i].lastName
            }
          })
          .catch((error) => {
            this.error = error
            console.log(error.response.statusText)
          })
    },

    setPending() {
      EventAttendee.changeAttendance(this.$route.params.id, this.userId, {status: "pending"})
          .then(() => {
            this.$router.go(0)
          }, (error) => {
            console.log(error.response.statusText)
          })
    },

    setAccepted() {
      console.log()
      EventAttendee.changeAttendance(this.$route.params.id, this.userId, {status: "accepted"})
          .then(() => {
            this.$router.go(0)
          }, (error) => {
            console.log(error.response.statusText)
          })
    },

    setRejected() {
      EventAttendee.changeAttendance(this.$route.params.id, this.userId, {status: "rejected"})
          .then(() => {
            this.$router.go(0)
          }, (error) => {
            console.log(error.response.statusText)
          })
    }
  }
}
</script>

<style scoped>

</style>