<template>
  <div class="dashboard">
    <v-row class="pl-8 pt-3">
      <span class="text-4 text-h4">Sprint Dashboard</span>
    </v-row>
    <v-toolbar elevation="2" dark color="blue-grey darken-4" class="my-2">
      <v-autocomplete
        class="mt-8 ps-3"
        v-model="selectedsprints"
        :items="sprints"
        :loading="isloading"
        :search-input.sync="search"
        color="white"
        item-text="Description"
        item-value="API"
        label="Sprints to report"
        placeholder="Start typing to Search"
        multiple
      ></v-autocomplete>
      <v-btn icon @click="clearsearch">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-btn
        icon
        @click="refreshsprintcache(false)"
        @dblclick="refreshsprintcache(true)"
        :to="buildroute"
        :loading="loadingsprintdata"
        :disabled="loadingsprintdata"
      >
        <v-icon>mdi-replay</v-icon>
      </v-btn>
    </v-toolbar>

    <v-expansion-panels multiple>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <span class="text-5 text-h5">Sprint Data Comparison</span>
        </v-expansion-panel-header>
        <v-expansion-panel-content v-if="anysprintsselected">
          <SprintsDataComparison
            :loading="loadingsprintdata"
          ></SprintsDataComparison>
        </v-expansion-panel-content>
        <v-expansion-panel-content v-else>
          Please select at least one sprint then refresh
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <span class="text-5 text-h5">Tabular Report</span>
        </v-expansion-panel-header>
        <v-expansion-panel-content v-if="anysprintsselected">
          <v-chip-group v-model="chipsprintselection" column multiple>
            <v-chip
              v-for="sprint in finalizedprints"
              :key="sprint"
              filter
              outlined
            >
              {{ sprint }}
            </v-chip>
          </v-chip-group>
          <SprintDataDump
            v-for="(sprint, index) in finalizedprints"
            :key="sprint"
            :sprintname="sprint"
            :sprintid="sprintdata[sprint]"
            :loading="loadingsprintdata"
            v-if="chipsprintselection.indexOf(index) > -1"
          ></SprintDataDump>
        </v-expansion-panel-content>
        <v-expansion-panel-content v-else>
          Please select at least one sprint then refresh
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
// @ is an alias to /src
import SprintDataDump from "@/components/SprintDataDump.vue";
import SprintsDataComparison from "@/components/SprintsDataComparison.vue";

var updateselectedsprints = function () {
  var selectedsprints = this.$route.query.selectedsprints;
  if (selectedsprints) {
    selectedsprints = JSON.parse(selectedsprints);
    this.sprintdata = selectedsprints;
    this.selectedsprints = [];
    this.sprints = [];
    for (var sprint in selectedsprints) {
      this.sprints.push(sprint);
      this.selectedsprints.push(sprint);
    }
  } else {
    this.clearsearch();
  }
};

var getselectedsprints = function (selectedsprints) {
  if (selectedsprints) {
    selectedsprints = JSON.parse(selectedsprints);
    var retsprints = [];
    for (var sprint in selectedsprints) {
      retsprints.push(sprint);
    }
    return retsprints;
  } else {
    return null;
  }
};

export default {
  name: "Dashboard",
  components: {
    SprintDataDump,
    SprintsDataComparison,
  },
  data: () => ({
    chipsprintselection: [],
    descriptionLimit: 60,
    sprintdata: {},
    sprints: [],
    isloading: false,
    selectedsprints: null,
    search: null,
    loadingsprintdata: false,
    sprintsdump: null,
  }),
  computed: {
    buildroute() {
      if (this.selectedsprints) {
        var uri = {};
        this.selectedsprints.forEach(
          function (sprint) {
            uri[sprint] = this.sprintdata[sprint];
          }.bind(this)
        );
        return encodeURI("/?selectedsprints=" + JSON.stringify(uri));
      }
      return "/";
    },
    anysprintsselected() {
      return !!this.$route.query.selectedsprints;
    },
    finalizedprints() {
      return getselectedsprints(this.$route.query.selectedsprints);
    },
  },
  methods: {
    clearsearch() {
      this.selectedsprints = null;
    },
    async refreshsprintcache(forcerefresh) {
      this.loadingsprintdata = true;
      if (this.selectedsprints) {
        var refreshsprints = this.selectedsprints.map(
          function (sprint) {
            return {
              id: this.sprintdata[sprint],
              name: sprint,
            };
          }.bind(this)
        );
        await this.$root.getsprintsdata(refreshsprints, !!forcerefresh);
      }
      this.loadingsprintdata = false;
    },
  },
  watch: {
    async search(val) {
      if (val && val.length < 4) return;
      if (this.isloading) return;
      this.isloading = true;
      // Lazily load input items
      var sprints = await this.$root.getsuggestions("sprint", val);
      if (sprints && sprints.suggestions) {
        sprints.suggestions.forEach(
          function (suggestion) {
            var sprintname = suggestion.displayname.split(" -")[0];
            this.sprintdata[sprintname] = suggestion.id;
            this.sprints.push(sprintname);
          }.bind(this)
        );
      }
      this.isloading = false;
    },
    selectedsprints() {
      this.search = null;
    },
    $route() {
      updateselectedsprints.call(this);
    },
  },
  mounted() {
    updateselectedsprints.call(this);
    //this.refreshsprintcache();
  },
};
</script>
