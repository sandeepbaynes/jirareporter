<template>
  <div>
    <span class="text-1">
      <b>Time spent in sprint in hours</b> (doesn't include time logged for
      sprint after the sprint has been closed)
    </span>
    <div>
      <v-switch
        v-model="filterclosedtickets"
        label="Show only closed tickets"
      ></v-switch>
    </div>
    <v-chip-group v-model="loggeduserfilter" column multiple>
      <v-chip v-for="log in loggedusers" :key="log.name" filter outlined>
        {{ log.displayname }}
      </v-chip>
    </v-chip-group>
    <v-data-table
      :headers="tableheaders"
      :items="ticketsinsprint"
      multi-sort
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
    </v-data-table>
  </div>
</template>

<script>
var getdatatablevalues = function (issues, loggedusers, userfilter) {
  return issues.map(function (ticket) {
    var retval = {
      issuetype: ticket.issuetype,
      ticketid: ticket.key,
      issuelink: ticket.issuelink,
      storypointsatstartofsprint: ticket.storypointsatstartofsprint,
      storypointsatendofsprint: ticket.storypointsatendofsprint,
      iconurl: ticket.issuetypeiconurl,
      hourslogged: 0,
      aggregatetimelogged: ticket.aggregatetimespent
        ? (ticket.aggregatetimespent / 3600).toFixed(2)
        : 0,
    };
    for (var user of loggedusers) {
      retval["timespentby" + user.name] = ticket.timespent[user.name]
        ? (ticket.timespent[user.name].timeinseconds / 3600).toFixed(2)
        : 0;
    }
    for (var user of userfilter) {
      retval.hourslogged += parseFloat(
        retval["timespentby" + loggedusers[user].name]
      );
    }
    retval.hourslogged = retval.hourslogged.toFixed(2);
    return retval;
  });
};

var getloggedusers = function (issues) {
  var tempval = {};
  var retval = [];
  issues.forEach(function (ticket) {
    for (var log in ticket.timespent) {
      if (log) {
        tempval[log] = ticket.timespent[log].loggedbydisplayname;
      }
    }
  });
  for (var val in tempval) {
    retval.push({
      name: val,
      displayname: tempval[val],
    });
  }
  return retval;
};

var getclosedtickets = function (tickets, ignoreclosed) {
  return ignoreclosed ? tickets.filter(function (issue) {
    return (
      issue.statusatendofsprint.value == "Closed" ||
      issue.statusatendofsprint.value == "Cancelled"
    );
  }) : tickets;
};

export default {
  name: "SprintTimeLogged",
  props: {
    sprintname: null,
    sprintid: null,
    loading: false,
  },
  data: () => {
    return {
      datadump: null,
      loggeduserfilter: [],
      loggedusers: [],
      filterclosedtickets: false,
    };
  },
  methods: {
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
    tableheaders() {
      var retval = [
        {
          text: "Issue Type",
          align: "right",
          value: "issuetype",
          width: "5%",
        },
        {
          text: "Ticket",
          align: "left",
          value: "ticketid",
        },
        {
          text: "Story Points",
          align: "center",
          sortable: false,
          value: "storypointinsprint",
        },
        {
          text: "All Time Total",
          align: "Center",
          value: "aggregatetimelogged",
        },
        {
          text: "Custom",
          align: "Center",
          value: "hourslogged",
        },
      ];
      for (var user of this.loggeduserfilter) {
        retval.push({
          text: this.loggedusers[user].displayname,
          align: "center",
          value: "timespentby" + this.loggedusers[user].name,
        });
      }
      return retval;
    },
    ticketsinsprint() {
      if (this.datadump) {
        return getdatatablevalues(
          [
            ...getclosedtickets(this.datadump.tickets, this.filterclosedtickets),
            ...getclosedtickets(this.datadump.ticketsaddedaftersprintstart, this.filterclosedtickets),
          ],
          this.loggedusers,
          this.loggeduserfilter
        );
      }
      return [];
    },
  },
  mounted() {
    if (this.$root.sprintsdatadump) {
      this.datadump = this.$root.sprintsdatadump[this.sprintname];
      this.loggedusers = getloggedusers([
        ...getclosedtickets(this.datadump.tickets, this.filterclosedtickets),
        ...getclosedtickets(this.datadump.ticketsaddedaftersprintstart, this.filterclosedtickets),
      ]);
    }
  },
  watch: {
    loading(val) {
      if (!val && this.$root.sprintsdatadump) {
        this.datadump = this.$root.sprintsdatadump[this.sprintname];
        this.loggedusers = getloggedusers([
          ...getclosedtickets(this.datadump.tickets, this.filterclosedtickets),
          ...getclosedtickets(this.datadump.ticketsaddedaftersprintstart, this.filterclosedtickets),
        ]);
      }
    },
  },
};
</script>