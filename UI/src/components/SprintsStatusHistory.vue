<template>
  <div>
    Sprint status history
    <ApexCharts
      type="rangeBar"
      :options="historychartoptions()"
      :series="historychartseries()"
    ></ApexCharts>
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

var getsprintticketstatushistory = function(sprint) {
  var retval = [];
  sprint.tickets.forEach(function(ticket) {
    var ticketval = {
      name: ticket.key,
      data: []
    };
    ticket.statushistory.forEach(function(history) {
      ticketval.data.push({
        x: history.assigneeattime,
        y: [
          history.changedate,
          history.changedate - 1
        ]
      });
    });
    retval.push(ticketval);
  });
  debugger;
}

export default {
  components: {
    ApexCharts: VueApexCharts,
  },
  data: () => {
    return {
      sprintsdata: null,
    };
  },
  props: {
    loading: false,
  },
  methods: {
    historychartseries () {
      getsprintticketstatushistory(this.sprintsdata[1]);
      return [
        {
          name: "Bob",
          data: [
            {
              x: "Design",
              y: [
                new Date("2019-03-05").getTime(),
                new Date("2019-03-08").getTime(),
              ],
            },
            {
              x: "Code",
              y: [
                new Date("2019-03-02").getTime(),
                new Date("2019-03-05").getTime(),
              ],
            },
            {
              x: "Code",
              y: [
                new Date("2019-03-05").getTime(),
                new Date("2019-03-07").getTime(),
              ],
            },
            {
              x: "Test",
              y: [
                new Date("2019-03-03").getTime(),
                new Date("2019-03-09").getTime(),
              ],
            },
            {
              x: "Test",
              y: [
                new Date("2019-03-08").getTime(),
                new Date("2019-03-11").getTime(),
              ],
            },
            {
              x: "Validation",
              y: [
                new Date("2019-03-11").getTime(),
                new Date("2019-03-16").getTime(),
              ],
            },
            {
              x: "Design",
              y: [
                new Date("2019-03-01").getTime(),
                new Date("2019-03-03").getTime(),
              ],
            },
          ],
        },
        {
          name: "Joe",
          data: [
            {
              x: "Design",
              y: [
                new Date("2019-03-02").getTime(),
                new Date("2019-03-05").getTime(),
              ],
            },
            {
              x: "Test",
              y: [
                new Date("2019-03-06").getTime(),
                new Date("2019-03-16").getTime(),
              ],
            },
            {
              x: "Code",
              y: [
                new Date("2019-03-03").getTime(),
                new Date("2019-03-07").getTime(),
              ],
            },
            {
              x: "Deployment",
              y: [
                new Date("2019-03-20").getTime(),
                new Date("2019-03-22").getTime(),
              ],
            },
            {
              x: "Design",
              y: [
                new Date("2019-03-10").getTime(),
                new Date("2019-03-16").getTime(),
              ],
            },
          ],
        },
        {
          name: "Dan",
          data: [
            {
              x: "Code",
              y: [
                new Date("2019-03-10").getTime(),
                new Date("2019-03-17").getTime(),
              ],
            },
            {
              x: "Validation",
              y: [
                new Date("2019-03-05").getTime(),
                new Date("2019-03-09").getTime(),
              ],
            },
          ],
        },
      ];
    },
    historychartoptions () {
      return {
        chart: {
          type: "rangeBar",
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: "80%",
          },
        },
        xaxis: {
          type: "datetime",
        },
        stroke: {
          width: 1,
        },
        fill: {
          type: "solid",
          opacity: 0.6,
        },
        legend: {
          position: "top",
          horizontalAlign: "left",
        },
      };
    },
  },
  computed: {},
  mounted() {
    if (this.$root.sprintsdatadump) {
      this.sprintsdata = getreportsdata(
        JSON.parse(this.$route.query.selectedsprints),
        this.$root.sprintsdatadump
      );
    }
  },
  watch: {
    loading(val) {
      if (!val && this.$root.sprintsdatadump) {
        this.sprintsdata = getreportsdata(
          JSON.parse(this.$route.query.selectedsprints),
          this.$root.sprintsdatadump
        );
      }
    },
  },
};
</script>