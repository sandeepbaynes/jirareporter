import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import VueApexCharts from 'vue-apexcharts'


Vue.config.productionTip = false
Vue.use(VueApexCharts);

var apiurl = "http://localhost:3000";

new Vue({
  router,
  store: store(apiurl),
  vuetify,
  render: h => h(App),
  data: {
    sprintsdatadump: null,
  },
  methods: {
    async getsuggestions(fieldname, fieldvalue) {
      try {
        var response = await Vue.axios.get(`${apiurl}/suggestions?fieldname=${fieldname}&fieldvalue=${fieldvalue}`, { withCredentials: true });
        this.$store.dispatch('updateloginstatus', response.data);
        return response.data;
      }
      catch (error) {
        this.$store.dispatch('updateloginstatus', { jirareportersuccess: false });
      }
    },
    async getsprintsdata(sprints, forcerefresh) {
      try {
        var newsprintids = [];
        newsprintids = sprints.filter((function (sprint) {
          return !(this.sprintsdatadump && this.sprintsdatadump[sprint.name] && !forcerefresh);
        }).bind(this)).map(function (sprint) {
          return sprint.id;
        });
        if (newsprintids.length > 0) {
          var response = await Vue.axios.get(`${apiurl}/getsprintsdata?sprints=${JSON.stringify(newsprintids)}`, { withCredentials: true })
          this.sprintsdatadump = Object.assign(this.sprintsdatadump || {}, response.data.sprintsdata);
          this.$store.dispatch('updateloginstatus', response.data);
        }
      }
      catch (error) {
        this.$store.dispatch('updateloginstatus', { jirareportersuccess: false });
      }
    }
  },
}).$mount('#app')