<template>
  <div>
    <span class="text-6 text-h6">Categorization by status</span>
    <div id="statuschart">
      <ApexCharts
        ref="statuschart"
        type="line"
        height="550"
        :options="statuschartoptions"
        :series="statusseries"
      ></ApexCharts>
    </div>
    <v-data-table
      :headers="sprinttableheaders"
      :items="sprintreport"
      hide-default-footer
      class="elevation-0"
    >
    </v-data-table>
    <div class="my-5">
      <span class="text-2 text-subtitle-2">
        <b>Note:</b> Values are shown as Count (Story Points); "Defects Raised
        In Sprint" includes general defects created during the duration of the
        sprint and added to it's scope.<br />
        <b>Tallying data:</b> Committed + Added Mid-Sprint + Stretch Goal =
        Closed in Sprint + Incomplete. (Ignore Removed Mid-Sprint. This is never
        added to the sprint tickets list)
      </span>
    </div>
    <span class="text-1 text-subtitle-1"
      ><b>Estimation variance</b> - For all tickets closed in sprint</span
    >
    <div class="sprintcompletion">
      <div class="completionchart" cols="12" md="4" lg="3">
        <div id="chart">
          <ApexCharts
            type="radialBar"
            height="350"
            :options="completionchartoptions"
            :series="completionchartseries"
          ></ApexCharts>
        </div>
      </div>
      <div class="completionchart" cols="12" md="4" lg="3">
        <div id="chart">
          <ApexCharts
            type="radialBar"
            height="350"
            :options="completionchartoptions"
            :series="completionchartseries"
          ></ApexCharts>
        </div>
      </div>
      <div class="completionchart" cols="12" md="4" lg="3">
        <div id="chart">
          <ApexCharts
            type="radialBar"
            height="350"
            :options="completionchartoptions"
            :series="completionchartseries"
          ></ApexCharts>
        </div>
      </div>
    </div>
    <div id="estimatevariancechart">
      <ApexCharts
        ref="estimatevariancechart"
        type="candlestick"
        height="350"
        :options="estimatevariancechartoptions"
        :series="estimatevariancechartseries"
      ></ApexCharts>
      <div class="mb-5">
        <span class="text-2 text-subtitle-2">
          <b>Note:</b>The chart shows the difference in story points for closed
          stories at the start of the sprint vs end. Green shows an increase in
          points and red shows a reduction.<br />
          We can assume that the reason for variation is our ability to estimate
          which directly depends on our understanding of the module. The bigger
          the block, the lesser we understand the application. We need to focus
          on making these blocks as small as possible.
        </span>
      </div>
    </div>
    <span class="text-6 text-h6">Categorization by issue type</span>
    <v-chip-group v-model="issuetypefilter" column multiple>
      <v-chip
        v-for="type in issuetypeheaders"
        :key="type.value"
        filter
        outlined
      >
        {{ type.text }}
      </v-chip>
    </v-chip-group>
    <div id="issuetypechart">
      <ApexCharts
        ref="issuetypechart"
        type="line"
        height="550"
        :options="issuetypecountchartoptions"
        :series="issuetypecountchartseries"
      ></ApexCharts>
    </div>
    <v-data-table
      :headers="selectedissuetypeheaders"
      :items="issuetypedata"
      hide-default-footer
      class="elevation-0"
    >
    </v-data-table>
    <div class="my-5">
      <span class="text-2 text-subtitle-2">
        <b>Note:</b> Values are shown as Count (Story Points); "Defects Raised
        In Sprint" includes general defects created during the duration of the
        sprint and added to it's scope.<br />
      </span>
    </div>
  </div>
</template>
<script>
import VueApexCharts from "vue-apexcharts";

var getreportsdata = function (sprints, datadump) {
  var retval = [];
  for (var sprint in sprints) {
    retval.push(datadump[sprint]);
  }
  return retval;
};
var getsprintstorypointforissue = function (issue) {
  return issue.storypointsatendofsprint != null
    ? parseInt(issue.storypointsatendofsprint.value || 0)
    : issue.storypointsatstartofsprint != null
    ? parseInt(issue.storypointsatstartofsprint.value || 0)
    : 0;
};
var getcountandpoints = function (tickets) {
  var sos = 0;
  var eos = 0;
  if (tickets) {
    tickets.forEach(function (issue) {
      eos += getsprintstorypointforissue(issue);
      sos +=
        issue.storypointsatstartofsprint != null
          ? parseInt(issue.storypointsatstartofsprint.value || 0)
          : 0;
    });
    return {
      count: tickets.length,
      storypointsatstartofsprint: sos,
      storypointsatendofsprint: eos,
    };
    var spchange = getspchangetext(sos, eos);
  } else {
    return {
      count: 0,
      storypointsatendofsprint: 0,
      storypointsatstartofsprint: 0,
    };
  }
};
var getticketidsfromlist = function (tickets) {
  return tickets
    .map(function (ticket) {
      return ticket.key;
    })
    .toString();
};
var filtertickets = function (sprint) {
  return sprint.tickets.filter(function (issue) {
    return !(issue.labels && issue.labels.indexOf("StretchGoal") >= 0);
  });
};
var filterticketsaftersprint = function (sprint) {
  return sprint.ticketsaddedaftersprintstart;
};
var filterstretchgoals = function (sprint) {
  return sprint.tickets.filter(function (issue) {
    return issue.labels && issue.labels.indexOf("StretchGoal") >= 0;
  });
};
var filterticketsremovedfromsprint = function (sprint) {
  return sprint.ticketsremovedaftersprintstart;
};

var filterticketsclosedinsprint = function (sprint) {
  return [
    ...sprint.tickets,
    ...sprint.ticketsaddedaftersprintstart,
    ...sprint.ticketsremovedaftersprintstart,
  ].filter(function (issue) {
    return (
      issue.statusatendofsprint.value == "Closed" ||
      issue.statusatendofsprint.value == "Fixed" ||
      issue.statusatendofsprint.value == "Cancelled"
    );
  });
};

var filterticketsindevprogress = function (sprint) {
  return [...sprint.tickets, ...sprint.ticketsaddedaftersprintstart].filter(
    function (issue) {
      return (
        issue.statusatendofsprint.value == "In Progress" ||
        issue.statusatendofsprint.value == "In code review" ||
        issue.statusatendofsprint.value == "Awaiting Code Review" ||
        issue.statusatendofsprint.value == "Reopened"
      );
    }
  );
};

var filterticketsintesting = function (sprint) {
  return [...sprint.tickets, ...sprint.ticketsaddedaftersprintstart].filter(
    function (issue) {
      return (
        issue.statusatendofsprint.value == "In testing" ||
        issue.statusatendofsprint.value == "Ready for test"
      );
    }
  );
};

var filterticketsinopenorinfo = function (sprint) {
  return [...sprint.tickets, ...sprint.ticketsaddedaftersprintstart].filter(
    function (issue) {
      return (
        issue.statusatendofsprint.value == "Open" ||
        issue.statusatendofsprint.value == "Information Required" ||
        issue.statusatendofsprint.value == "Info required" ||
        issue.statusatendofsprint.value == "On hold"
      );
    }
  );
};

var filterticketsnotworked = function (sprint) {
  return [...sprint.tickets, ...sprint.ticketsaddedaftersprintstart].filter(
    function (issue) {
      return issue.statushistory.length == 1;
    }
  );
};

var filterticketsreopened = function (sprint) {
  return [...sprint.tickets, ...sprint.ticketsaddedaftersprintstart].filter(
    function (issue) {
      return (
        issue.statushistory.length > 1 &&
        issue.statushistory.filter(function (status) {
          return status.value == "Reopened";
        }).length > 0
      );
    }
  );
};

var filterdefectscreatedinsprint = function (sprint) {
  var activateddate = new Date(sprint.activatedDate);
  var completedate = new Date(sprint.completeDate);
  var startdate = new Date(sprint.startDate);
  var enddate = new Date(sprint.endDate);
  return [
    ...sprint.tickets,
    ...sprint.ticketsaddedaftersprintstart,
    ...sprint.ticketsremovedaftersprintstart,
  ].filter(function (issue) {
    var issuecreatedate = new Date(issue.createddate);
    return (
      issue.issuetype == "Bug" &&
      (issuecreatedate >= activateddate || issuecreatedate >= startdate) &&
      (issuecreatedate <= enddate || issuecreatedate <= completedate)
    );
  });
};

var formatsprintdata = function (sprint) {
  return sprint
    ? {
        sprintname: sprint.name,
        sprintcommitment: formatcountandchangetext(
          getcountandpoints(filtertickets(sprint))
        ),
        addedaftersprintstart: formatcountandchangetext(
          getcountandpoints(filterticketsaftersprint(sprint))
        ),
        stretchgoals: formatcountandchangetext(
          getcountandpoints(filterstretchgoals(sprint))
        ),
        removedaftersprintstart: formatcountandchangetext(
          getcountandpoints(filterticketsremovedfromsprint(sprint))
        ),
        closedinsprint: formatcountandchangetext(
          getcountandpoints(filterticketsclosedinsprint(sprint))
        ),
        incompleteinprogress: formatcountandchangetext(
          getcountandpoints(filterticketsindevprogress(sprint))
        ),
        incompleteintesting: formatcountandchangetext(
          getcountandpoints(filterticketsintesting(sprint))
        ),
        openorinforequired: formatcountandchangetext(
          getcountandpoints(filterticketsinopenorinfo(sprint))
        ),
        notworkedon: formatcountandchangetext(
          getcountandpoints(filterticketsnotworked(sprint))
        ),
        reopenedinsprint: formatcountandchangetext(
          getcountandpoints(filterticketsreopened(sprint))
        ),
        defectsraisedinsprint: formatcountandchangetext(
          getcountandpoints(filterdefectscreatedinsprint(sprint))
        ),
      }
    : null;
};

var countissuetypeandlabelsinsprint = function (sprint) {
  var issuetypecount = {};
  var labelscount = {};
  [
    ...sprint.tickets,
    ...sprint.ticketsaddedaftersprintstart,
    ...sprint.ticketsremovedaftersprintstart,
  ].forEach(function (issue) {
    issuetypecount[issue.issuetype] = issuetypecount[issue.issuetype] || {};
    issuetypecount[issue.issuetype].count =
      (issuetypecount[issue.issuetype].count || 0) + 1;
    issuetypecount[issue.issuetype].storypointsatstartofsprint =
      (issuetypecount[issue.issuetype].storypointsatstartofsprint || 0) +
      (issue.storypointsatstartofsprint != null
        ? parseInt(issue.storypointsatstartofsprint.value || 0)
        : 0);
    issuetypecount[issue.issuetype].storypointsatendofsprint =
      (issuetypecount[issue.issuetype].storypointsatendofsprint || 0) +
      getsprintstorypointforissue(issue);
    if (issue.labels) {
      issue.labels.forEach(function (label) {
        labelscount[label] = labelscount[label] || {};
        labelscount[label].storypointsatstartofsprint =
          (labelscount[label].storypointsatstartofsprint || 0) +
          (issue.storypointsatstartofsprint != null
            ? parseInt(issue.storypointsatstartofsprint.value || 0)
            : 0);
        labelscount[label].storypointsatendofsprint =
          (labelscount[label].storypointsatendofsprint || 0) +
          getsprintstorypointforissue(issue);
        labelscount[label].count = (labelscount[label].count || 0) + 1;
      });
    }
  });
  return { issuetypecount, labelscount };
};

var getspchangetext = function (sos, eos) {
  return "" + sos + (sos != eos ? " → " + eos : "");
};

var formatcountandchangetext = function (data) {
  return `${data.count} (${getspchangetext(
    data.storypointsatstartofsprint,
    data.storypointsatendofsprint
  )})`;
};

var getissuetypereport = function (sprints) {
  var header = [
    {
      text: "Sprint",
      align: "start",
      value: "sprintname",
      width: "15%",
    },
  ];
  if (sprints) {
    var reportdata = [];
    var reportdataexpanded = [];
    sprints
      .filter(function (sprint) {
        return sprint != null;
      })
      .forEach(function (sprint) {
        var { issuetypecount, labelscount } = countissuetypeandlabelsinsprint(
          sprint
        );
        var sd = {};
        var sdexpand = {};
        sd.sprintname = sprint.name;
        for (var type in issuetypecount) {
          if (
            !header.find(function (h) {
              return h.text == type;
            })
          ) {
            header.push({
              text: type,
              align: "center",
              value: type,
              width: "50px",
            });
          }
          sd[type] = formatcountandchangetext(issuetypecount[type]);
          sdexpand[type] = issuetypecount[type];
        }
        for (var label in labelscount) {
          if (
            !header.find(function (h) {
              return h.text == label;
            })
          ) {
            header.push({
              text: label,
              align: "center",
              value: label,
              width: "50px",
            });
          }
          sd[label] = formatcountandchangetext(labelscount[label]);
          sdexpand[label] = labelscount[label];
        }
        reportdata.push(sd);
        reportdataexpanded.push(sdexpand);
      });
  }
  return {
    header: header,
    data: reportdata,
    dataexpanded: reportdataexpanded,
  };
};

var addxaxislabels = function () {
  var ss = JSON.parse(this.$route.query.selectedsprints);
  var retval = [];
  for (var sprint in ss) {
    retval.push(sprint);
  }
  return retval;
};

var getdefaultchartoptions = function () {
  return {
    chart: {
      height: 400,
      stacked: true,
      toolbar: {
        show: true,
      },
    },
    dataLabels: {
      enabled: true,
    },
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: addxaxislabels.call(this), // Add sprints to the x axis
      title: {
        text: "Sprints",
      },
    },
    yaxis: {
      min: 0,
      title: {
        text: "Story Points",
      },
    },
    stroke: {
      show: true,
    },
    legend: {
      position: "top",
      show: true,
    },
    plotOptions: {
      bar: {
        columnWidth: "25  %",
      },
    },
  };
};

export default {
  components: {
    ApexCharts: VueApexCharts,
  },
  data: () => {
    return {
      sprintsdata: null,
      sprinttableheaders: [
        {
          text: "Sprint",
          align: "start",
          value: "sprintname",
          width: "15%",
        },
        {
          text: "Committed",
          align: "center",
          value: "sprintcommitment",
        },
        {
          text: "Added Mid-Sprint",
          align: "center",
          value: "addedaftersprintstart",
        },
        {
          text: "Stretch Goal",
          align: "center",
          value: "stretchgoals",
        },
        {
          text: "Removed Mid-Sprint",
          align: "center",
          value: "removedaftersprintstart",
        },
        {
          text: "Closed in Sprint",
          align: "center",
          value: "closedinsprint",
        },
        {
          text: "Incomplete - In Progress",
          align: "center",
          value: "incompleteinprogress",
        },
        {
          text: "Incomplete - In Testing",
          align: "center",
          value: "incompleteintesting",
        },
        {
          text: "Open or Information Required",
          align: "center",
          value: "openorinforequired",
        },
        {
          text: "No Change In Sprint",
          align: "center",
          value: "notworkedon",
        },
        {
          text: "Reopened In Sprint",
          align: "center",
          value: "reopenedinsprint",
        },
        {
          text: "Defects Raised In Sprint",
          align: "center",
          value: "defectsraisedinsprint",
        },
      ],
      issuetypeheaders: [],
      issuetypedata: [],
      issuetypedataexpanded: [],
      issuetypefilter: [],
    };
  },
  props: {
    loading: false,
  },
  methods: {},
  computed: {
    selectedissuetypeheaders() {
      if (this.issuetypeheaders) {
        return this.issuetypefilter.map(
          function (filterindex) {
            return this.issuetypeheaders[filterindex];
          }.bind(this)
        );
      }
      return [];
    },
    sprintreport() {
      if (this.sprintsdata) {
        return this.sprintsdata
          .filter(function (sprint) {
            return sprint != null;
          })
          .map(function (sprint) {
            return formatsprintdata(sprint);
          });
      } else return [];
    },
    statusseries() {
      var committed = [];
      var addedmidsprint = [];
      var stretchgoals = [];
      var completed = [];
      if (this.sprintsdata) {
        this.sprintsdata
          .filter(function (sprint) {
            return sprint != null;
          })
          .forEach(function (sprint) {
            committed.push(
              getcountandpoints(filtertickets(sprint)).storypointsatendofsprint
            );
            addedmidsprint.push(
              getcountandpoints(filterticketsaftersprint(sprint))
                .storypointsatendofsprint
            );
            stretchgoals.push(
              getcountandpoints(filterstretchgoals(sprint))
                .storypointsatendofsprint
            );
            completed.push(
              getcountandpoints(filterticketsclosedinsprint(sprint))
                .storypointsatendofsprint
            );
          });
      }
      return [
        {
          name: "Closed in Sprint",
          type: "line",
          color: "#0d2f16",
          data: completed,
        },
        {
          name: "Committed",
          type: "column",
          color: "#01579B",
          data: committed,
        },
        {
          name: "Added Mid-Sprint",
          type: "column",
          color: "#37474F",
          data: addedmidsprint,
        },
        {
          name: "Stretch Goals",
          type: "column",
          color: "#90A4AE",
          data: stretchgoals,
        },
      ];
    },
    statuschartoptions() {
      var options = getdefaultchartoptions.call(this);
      options.stroke.colors = [
        "#2b9447",
        "transparent",
        "transparent",
        "transparent",
      ];
      options.dataLabels.enabledOnSeries = [0];
      options.yaxis.max = 100;
      return options;
    },
    issuetypecountchartseries() {
      var data = [];
      var datatoexpand = {};
      var completed = [];
      if (this.sprintsdata) {
        this.sprintsdata
          .filter(function (sprint) {
            return sprint != null;
          })
          .forEach(function (sprint) {
            completed.push(
              getcountandpoints(filterticketsclosedinsprint(sprint))
                .storypointsatendofsprint
            );
          });
        data.push({
          name: "Closed in Sprint",
          type: "line",
          color: "#0B2A44",
          data: completed,
        });
      }
      if (this.issuetypedataexpanded) {
        this.issuetypedataexpanded.forEach(
          function (td) {
            var typedata = td;
            this.issuetypefilter
              .filter(
                function (filterindex) {
                  return this.issuetypeheaders[filterindex].text != "Sprint";
                }.bind(this)
              )
              .forEach(
                function (filterindex) {
                  var type = this.issuetypeheaders[filterindex].text;
                  datatoexpand[type] = datatoexpand[type] || [];
                  datatoexpand[type].push(
                    !typedata[type]
                      ? 0
                      : typedata[type].storypointsatendofsprint
                  );
                }.bind(this)
              );
          }.bind(this)
        );
      }
      for (var de in datatoexpand) {
        data.push({
          name: de,
          type: "line",
          data: datatoexpand[de],
        });
      }
      return data;
    },
    issuetypecountchartoptions() {
      var options = getdefaultchartoptions.call(this);
      options.chart.stacked = false;
      return options;
    },
    estimatevariancechartseries() {
      var data = [];
      if (this.sprintsdata) {
        data = this.sprintsdata
          .filter(function (sprint) {
            return sprint != null;
          })
          .map(function (sprint) {
            var closedtickets = getcountandpoints(
              filterticketsclosedinsprint(sprint)
            );
            return {
              x: sprint.name,
              y: [
                closedtickets.storypointsatstartofsprint,
                closedtickets.storypointsatstartofsprint,
                closedtickets.storypointsatendofsprint,
                closedtickets.storypointsatendofsprint,
              ],
            };
          });
      }
      return [{ name: "Estimation Variance", data }];
    },
    estimatevariancechartoptions() {
      var options = getdefaultchartoptions.call(this);
      options.chart.stacked = false;
      options.dataLabels.enabled = false;
      return options;
    },
    completionchartoptions() {
      return {
        chart: {
          height: 350,
          type: "radialBar",
        },
        plotOptions: {
          radialBar: {
            track: { background: ["#40a0fc", "#1aa783", "#e65252"] },
            
            dataLabels: {
              name: {
                fontSize: "22px",
              },
              value: {
                fontSize: "16px",
              },
              total: {
                show: true,
                label: "Total",
                formatter: function (w) {
                  // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                  return 249;
                },
              },
            },
          },
        },
        labels: ["Tasks", "Stories / CR", "Bugs"],
      };
    },
    completionchartseries() {
      return [44, 55, 67];
    },
  },
  mounted() {
    if (this.$root.sprintsdatadump) {
      this.sprintsdata = getreportsdata(
        JSON.parse(this.$route.query.selectedsprints),
        this.$root.sprintsdatadump
      );
      var sprintissuecounts = getissuetypereport(this.sprintsdata);
      this.issuetypeheaders = sprintissuecounts.header;
      this.issuetypedata = sprintissuecounts.data;
      this.issuetypedataexpanded = sprintissuecounts.dataexpanded;
    }
  },
  watch: {
    loading(val) {
      if (!val && this.$root.sprintsdatadump) {
        this.sprintsdata = getreportsdata(
          JSON.parse(this.$route.query.selectedsprints),
          this.$root.sprintsdatadump
        );
        var sprintissuecounts = getissuetypereport(this.sprintsdata);
        this.issuetypeheaders = sprintissuecounts.header;
        this.issuetypedata = sprintissuecounts.data;
        this.issuetypedataexpanded = sprintissuecounts.dataexpanded;
      }
    },
  },
};
</script>