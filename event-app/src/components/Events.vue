<template>
  <el-container>
    <el-header>

    </el-header>

    <el-divider></el-divider>

    <el-main>
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
        <el-col :span="7">
          <div class="grid-content"></div>
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
        <el-col :span="3">
          <div class="grid-content"></div>
          <el-button type="primary" @click="filterVisible = true">Filter</el-button>
          <el-dialog
              title="Filter Categories"
              v-model="filterVisible"
              width="30%"
              :before-close="handleClose">
            <span>TO BE IMPLEMENTED</span>
            <template #footer>
    <span class="dialog-footer">
      <el-button @click="filterVisible = false">Cancel</el-button>
      <el-button type="primary" @click="filterVisible = false">Confirm</el-button>
    </span>
            </template>
          </el-dialog>
        </el-col>
        <el-col :span="4">
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
              :default-sort = "{prop: 'date', order: 'descending'}"
              border
              style="width: 100%">
            <el-table-column
                prop="date"
                label="Date"
                sortable
                width="180">
            </el-table-column>
            <el-table-column
                prop="title"
                label="Title"
                width="180">
            </el-table-column>
            <el-table-column
                prop="categories"
                label="Categories"
                width="180">
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

    </el-main>
  </el-container>
</template>

<script>
import {Events} from "../Api";

export default {
  name: 'Events',

  data() {
    return {
      searchValue: "",
      events: [],
      pageNum: 1,
      pageSize: 10,
      error: null,
      loading: true,
      filterVisible: false
    }
  },

  mounted() {
    this.loadEvents();
  },

  computed: {
    pagedTableData() {
      return this.events.slice(this.pageSize * this.pageNum - this.pageSize, this.pageSize * this.pageNum)
    }
  },

  methods: {
    handleClose(done) {
      this.$confirm('Are you sure to close this dialog?')
          .then(() => {
            done();
            this.filterVisible = false
          })
          .catch(() => {});
    },

    setPage(val) {
      this.pageNum = val;
    },

    loadEvents() {
      this.events = []
      Events.getEvents()
          .then((response) => {
            this.error = null
            this.events = response.data
            this.loading = false
          })
          .catch((error) => {
            this.error = error
          })
    },

    searchEvents() {
      this.events = []
      this.loading = true
      if (this.searchValue === "") {
        Events.getEvents()
            .then((response) => {
              this.error = null
              this.events = response.data
              this.loading = false
            })
            .catch((error) => {
              this.error = error
            })
      } else {
        Events.searchEvents(this.searchValue)
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
