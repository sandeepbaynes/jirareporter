<template>
  <div class="mb-10">
    <div>
      <span class="text-6 text-h6">
        Sprint chart for {{ sprintname }} | {{ sprintid }} </span
      ><br />
      <span class="text-1 text-caption">
        <b>From:</b> {{ startdate }} <b>To:</b> {{ enddate }}<br />
        <b>Started On:</b> {{ openeddate }} <b>Closed On:</b> {{ closeddate }}
      </span>
    </div>
    <div class="mt-2">
      <span class="text-1">
        <b>Issues within sprint</b> (excluding those added after sprint start
        and stretch goals)
      </span>
      <v-data-table
        :headers="tableheaders"
        :items="sprinttickets"
        class="elevation-0"
      >
        <template v-slot:item.ticketid="{ item }">
          <a :href="item.issuelink" target="_blank">{{ item.ticketid }}</a>
        </template>
        <template v-slot:item.issuetype="{ item }">
          <v-img :src="item.iconurl" contain height="20"></v-img>
        </template>
        <template v-slot:item.storypointinsprint="{ item }">
          <v-chip>
            {{ getstorypointsinsprint(item) }}
          </v-chip>
        </template>
        <template v-slot:item.statusinsprint="{ item }">
          <v-chip label outlined :color="getstatuscolor(item.statusinsprint)">
            <b>{{ item.statusinsprint }}</b>
          </v-chip>
        </template>
        <template v-slot:item.currentstatus="{ item }">
          <v-chip label outlined :color="getstatuscolor(item.currentstatus)">
            <b>{{ item.currentstatus }}</b>
          </v-chip>
        </template>
      </v-data-table>
    </div>
    <div>
      <span class="text-1">
        <b>Issues added after sprint start</b> (including stretch goals)
      </span>
      <v-data-table
        :headers="tableheaders"
        :items="ticketsaftersprintstart"
        class="elevation-0"
      >
        <template v-slot:item.ticketid="{ item }">
          <a :href="item.issuelink" target="_blank">{{ item.ticketid }}</a>
        </template>
        <template v-slot:item.issuetype="{ item }">
          <v-img :src="item.iconurl" contain height="20"></v-img>
        </template>
        <template v-slot:item.storypointinsprint="{ item }">
          <v-chip>
            {{ getstorypointsinsprint(item) }}
          </v-chip>
        </template>
        <template v-slot:item.statusinsprint="{ item }">
          <v-chip label outlined :color="getstatuscolor(item.statusinsprint)">
            <b>{{ item.statusinsprint }}</b>
          </v-chip>
        </template>
        <template v-slot:item.currentstatus="{ item }">
          <v-chip label outlined :color="getstatuscolor(item.currentstatus)">
            <b>{{ item.currentstatus }}</b>
          </v-chip>
        </template>
      </v-data-table>
    </div>
    <div>
      <span class="text-1">
        <b>Stretch goals</b> (excluding those added after sprint start)
      </span>
      <v-data-table
        :headers="tableheaders"
        :items="stretchgoals"
        class="elevation-0"
      >
        <template v-slot:item.ticketid="{ item }">
          <a :href="item.issuelink" target="_blank">{{ item.ticketid }}</a>
        </template>
        <template v-slot:item.issuetype="{ item }">
          <v-img :src="item.iconurl" contain height="20"></v-img>
        </template>
        <template v-slot:item.storypointinsprint="{ item }">
          <v-chip>
            {{ getstorypointsinsprint(item) }}
          </v-chip>
        </template>
        <template v-slot:item.statusinsprint="{ item }">
          <v-chip label outlined :color="getstatuscolor(item.statusinsprint)">
            <b>{{ item.statusinsprint }}</b>
          </v-chip>
        </template>
        <template v-slot:item.currentstatus="{ item }">
          <v-chip label outlined :color="getstatuscolor(item.currentstatus)">
            <b>{{ item.currentstatus }}</b>
          </v-chip>
        </template>
      </v-data-table>
    </div>
    <div>
      <span class="text-1">
        <b>Issues removed after sprint start</b>
      </span>
      <v-data-table
        :headers="tableheaders"
        :items="ticketsremovedfromsprint"
        class="elevation-0"
      >
        <template v-slot:item.ticketid="{ item }">
          <a :href="item.issuelink" target="_blank">{{ item.ticketid }}</a>
        </template>
        <template v-slot:item.issuetype="{ item }">
          <v-img :src="item.iconurl" contain height="20"></v-img>
        </template>
        <template v-slot:item.storypointinsprint="{ item }">
          <v-chip>
            {{ getstorypointsinsprint(item) }}
          </v-chip>
        </template>
        <template v-slot:item.statusinsprint="{ item }">
          <v-chip label outlined :color="getstatuscolor(item.statusinsprint)">
            <b>{{ item.statusinsprint }}</b>
          </v-chip>
        </template>
        <template v-slot:item.currentstatus="{ item }">
          <v-chip label outlined :color="getstatuscolor(item.currentstatus)">
            <b>{{ item.currentstatus }}</b>
          </v-chip>
        </template>
      </v-data-table>
    </div>
    <div>
      <span class="text-1">
        <b>Issues not worked on during the sprint</b>
      </span>
      <v-data-table
        :headers="tableheaders"
        :items="ticketsnotworked"
        class="elevation-0"
      >
        <template v-slot:item.ticketid="{ item }">
          <a :href="item.issuelink" target="_blank">{{ item.ticketid }}</a>
        </template>
        <template v-slot:item.issuetype="{ item }">
          <v-img :src="item.iconurl" contain height="20"></v-img>
        </template>
        <template v-slot:item.storypointinsprint="{ item }">
          <v-chip>
            {{ getstorypointsinsprint(item) }}
          </v-chip>
        </template>
        <template v-slot:item.statusinsprint="{ item }">
          <v-chip label outlined :color="getstatuscolor(item.statusinsprint)">
            <b>{{ item.statusinsprint }}</b>
          </v-chip>
        </template>
        <template v-slot:item.currentstatus="{ item }">
          <v-chip label outlined :color="getstatuscolor(item.currentstatus)">
            <b>{{ item.currentstatus }}</b>
          </v-chip>
        </template>
      </v-data-table>
    </div>
    <div>
      <span class="text-1">
        <b>Issues reopened within the sprint</b>
      </span>
      <v-data-table
        :headers="tableheaders"
        :items="ticketsreopened"
        class="elevation-0"
      >
        <template v-slot:item.ticketid="{ item }">
          <a :href="item.issuelink" target="_blank">{{ item.ticketid }}</a>
        </template>
        <template v-slot:item.issuetype="{ item }">
          <v-img :src="item.iconurl" contain height="20"></v-img>
        </template>
        <template v-slot:item.storypointinsprint="{ item }">
          <v-chip>
            {{ getstorypointsinsprint(item) }}
          </v-chip>
        </template>
        <template v-slot:item.statusinsprint="{ item }">
          <v-chip label outlined :color="getstatuscolor(item.statusinsprint)">
            <b>{{ item.statusinsprint }}</b>
          </v-chip>
        </template>
        <template v-slot:item.currentstatus="{ item }">
          <v-chip label outlined :color="getstatuscolor(item.currentstatus)">
            <b>{{ item.currentstatus }}</b>
          </v-chip>
        </template>
      </v-data-table>
    </div>
    <div>
      <span class="text-1">
        <b>Defects raised against sprint tickets</b>
      </span>
      <v-data-table
        :headers="tableheaders"
        :items="defectscreatedinsprint"
        class="elevation-0"
      >
        <template v-slot:item.ticketid="{ item }">
          <a :href="item.issuelink" target="_blank">{{ item.ticketid }}</a>
        </template>
        <template v-slot:item.issuetype="{ item }">
          <v-img :src="item.iconurl" contain height="20"></v-img>
        </template>
        <template v-slot:item.storypointinsprint="{ item }">
          <v-chip>
            {{ getstorypointsinsprint(item) }}
          </v-chip>
        </template>
        <template v-slot:item.statusinsprint="{ item }">
          <v-chip label outlined :color="getstatuscolor(item.statusinsprint)">
            <b>{{ item.statusinsprint }}</b>
          </v-chip>
        </template>
        <template v-slot:item.currentstatus="{ item }">
          <v-chip label outlined :color="getstatuscolor(item.currentstatus)">
            <b>{{ item.currentstatus }}</b>
          </v-chip>
        </template>
      </v-data-table>
    </div>
    <v-divider></v-divider>
    <v-divider></v-divider>
    <v-divider></v-divider>
  </div>
</template>
<script>
var getdatatablevalues = function (issues) {
  return issues.map(function (ticket) {
    return {
      issuetype: ticket.issuetype,
      ticketid: ticket.key,
      issuelink: ticket.issuelink,
      summary: ticket.summary,
      labels: ticket.labels.toString(),
      storypoints: ticket.storypoints,
      storypointsatstartofsprint: ticket.storypointsatstartofsprint,
      storypointsatendofsprint: ticket.storypointsatendofsprint,
      statusinsprint: ticket.statusatendofsprint.value,
      currentstatus: ticket.status,
      iconurl: ticket.issuetypeiconurl,
    };
  });
};

export default {
  props: {
    sprintname: null,
    sprintid: null,
    loading: false,
  },
  data: () => {
    return {
      datadump: null,
    };
  },
  methods: {
    getstatuscolor(status) {
      var color = "";
      switch (status) {
        case "Closed":
        case "Cancelled":
          color = "green darken-1";
          break;
        case "In Progress":
        case "Ready for test":
        case "In testing":
        case "In code review":
        case "Awaiting Code Review":
        case "Reopened":
        case "Fixed":
          color = "red";
          break;
        case "Open":
          color = "blue darken-4";
          break;
        case "Info required":
        case "Information Required":
          color = "gray darken-4";
          break;
      }
      return color;
    },
    getstorypointsinsprint(item) {
      var sos = null,
        eos = null;
      if (
        item.storypointsatstartofsprint &&
        item.storypointsatstartofsprint.value
      ) {
        sos = parseInt(item.storypointsatstartofsprint.value);
      }
      if (
        item.storypointsatendofsprint &&
        item.storypointsatendofsprint.value
      ) {
        eos = parseInt(item.storypointsatendofsprint.value);
      }
      return (
        "" +
        (sos != null ? sos : "-") +
        (sos != eos && eos != null ? " → " : "") +
        (eos != null && eos != sos ? eos : "")
      );
    },
  },
  computed: {
    startdate() {
      return this.datadump ? new Date(this.datadump.startDate) : "";
    },
    enddate() {
      return this.datadump ? new Date(this.datadump.endDate) : "";
    },
    openeddate() {
      return this.datadump ? new Date(this.datadump.activatedDate) : "";
    },
    closeddate() {
      return this.datadump ? new Date(this.datadump.completeDate) : "";
    },
    tableheaders() {
      return [
        {
          text: "Issue Type",
          align: "right",
          value: "issuetype",
          width: "5%",
        },
        {
          text: "Ticket Number",
          value: "ticketid",
          width: "10%",
        },
        {
          text: "Summary",
          value: "summary",
          width: "60%",
        },
        {
          text: "Labels in Sprint",
          value: "labels",
          width: "5%",
        },
        {
          text: "Story Points in Sprint",
          value: "storypointinsprint",
          sortable: false,
          align: "center",
          width: "5%",
        },
        {
          text: "Current Story Points",
          value: "storypoints",
          align: "center",
          width: "5%",
        },
        {
          text: "Status When Sprint Closed",
          value: "statusinsprint",
          width: "5%",
        },
        {
          text: "Current Status",
          value: "currentstatus",
          width: "5%",
        },
      ];
    },
    sprinttickets() {
      if (this.datadump) {
        return getdatatablevalues(
          this.datadump.tickets.filter(function (ticket) {
            return !ticket.labels.find(function (label) {
              return label == "StretchGoal";
            });
          })
        );
      }
      return [];
    },
    ticketsaftersprintstart() {
      if (this.datadump) {
        return getdatatablevalues(this.datadump.ticketsaddedaftersprintstart);
      }
      return [];
    },
    stretchgoals() {
      if (this.datadump) {
        return getdatatablevalues(
          this.datadump.tickets.filter(function (ticket) {
            return ticket.labels.indexOf("StretchGoal") >= 0;
          })
        );
      }
      return [];
    },
    ticketsremovedfromsprint() {
      if (this.datadump) {
        return getdatatablevalues(this.datadump.ticketsremovedaftersprintstart);
      }
      return [];
    },
    ticketsnotworked: function (sprint) {
      if (this.datadump) {
        return getdatatablevalues(
          [
            ...this.datadump.tickets,
            ...this.datadump.ticketsaddedaftersprintstart,
          ].filter(function (issue) {
            return issue.statushistory.length == 1;
          })
        );
      }
      return [];
    },
    ticketsreopened: function (sprint) {
      if (this.datadump) {
        return getdatatablevalues(
          [
            ...this.datadump.tickets,
            ...this.datadump.ticketsaddedaftersprintstart,
          ].filter(function (issue) {
            return (
              issue.statushistory.length > 1 &&
              issue.statushistory.filter(function (status) {
                return status.value == "Reopened";
              }).length > 0
            );
          })
        );
      }
      return [];
    },
    defectscreatedinsprint: function (sprint) {
      if (this.datadump) {
        var activateddate = new Date(sprint.openeddate);
        var completedate = new Date(sprint.closeddate);
        var startdate = new Date(sprint.startdate);
        var enddate = new Date(sprint.enddate);
        var datatoprocess = [
          ...this.datadump.ticketsaddedaftersprintstart,
          ...this.datadump.ticketsremovedaftersprintstart,
        ].filter(function (issue) {
          var issuecreatedate = new Date(issue.createddate);
          return (
            issue.issuetype == "Bug" &&
            (issuecreatedate >= activateddate ||
              issuecreatedate >= startdate) &&
            (issuecreatedate <= enddate || issuecreatedate <= completedate)
          );
        });
        return getdatatablevalues(datatoprocess);
      }
      return [];
    },
  },
  mounted() {
    if (this.$root.sprintsdatadump) {
      this.datadump = this.$root.sprintsdatadump[this.sprintname];
    }
  },
  watch: {
    loading(val) {
      if (!val && this.$root.sprintsdatadump) {
        this.datadump = this.$root.sprintsdatadump[this.sprintname];
      }
    },
  },
};
</script>