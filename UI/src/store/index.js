import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(Vuex)
Vue.use(VueAxios, Axios)

export default function (apiurl) {
  return new Vuex.Store({
    state: {
      apiurl: apiurl,
      user: {
        name: '',
        jiraname: '',
        email: '',
        avatar: '',
        loginstatus: false
      },
      credentials: {
        username: '',
        password: ''
      },
      preferences: {
        testticket: 'TELROC-1',
        jiraurl: 'www.jira.codeworldwide.com'
      },
      teams: [
        {
          name: 'Nirvana',
          members: [
            {
              name: 'Kunal Priyadarshi',
              jiraname: 'prikun',
              avatar: 'https://jira.codeworldwide.com/secure/useravatar?ownerId=prikun',
              type: 'DEV'
            },
            {
              name: 'Harun Kumar',
              jiraname: 'kumhar',
              avatar: 'https://jira.codeworldwide.com/secure/useravatar?ownerId=kumhar',
              type: 'DEV'
            },
            {
              name: 'Jyothis Pillai',
              jiraname: 'prikun',
              avatar: 'https://jira.codeworldwide.com/secure/useravatar?ownerId=prikun',
              type: 'DEV'
            },
            {
              name: 'Girish Anargatte',
              jiraname: 'anagir',
              avatar: 'https://jira.codeworldwide.com/secure/useravatar?ownerId=anagir',
              type: 'QA'
            },
            {
              name: 'Amruth Masur',
              jiraname: 'masamr',
              avatar: 'https://jira.codeworldwide.com/secure/useravatar?ownerId=masamr',
              type: 'QA'
            },
          ],
          sprints: [
            'Nirvana 2020 Sprint 20',
            'Nirvana 2020 Sprint 21',
            'Nirvana 2020 Sprint 22',
            'Nirvana 2020 Sprint 23',
            'Nirvana 2020 Sprint 24',
            'Nirvana 2020 Sprint 25',
            'Nirvana 2020 Sprint 26',
          ]
        },
        {
          name: 'Sydney',
          members: [
            {
              name: 'Donal Hockey',
              jiraname: 'hocdon',
              avatar: 'https://jira.codeworldwide.com/secure/useravatar?ownerId=hocdon',
              type: 'CS'
            },
            {
              name: 'Charuta Hangargekar',
              jiraname: 'hancha',
              avatar: 'https://jira.codeworldwide.com/secure/useravatar?ownerId=hancha',
              type: 'CS'
            },
            {
              name: 'Michelle Harfield',
              jiraname: 'harmic',
              avatar: 'https://jira.codeworldwide.com/secure/useravatar?ownerId=harmic',
              type: 'CS'
            },
            {
              name: 'Rashmitha Shetty',
              jiraname: 'sheras',
              avatar: 'https://jira.codeworldwide.com/secure/useravatar?ownerId=sheras',
              type: 'QA'
            }
          ],
          sprints: []
        },
      ]
    },
    getters: {
      loginstatustitle: state => {
        return state.user.loginstatus ? "Refresh Jira login" : "Login to Jira";
      },
      teams: state => {
        return state.teams;
      },
      testticket: state => {
        return state.preferences.testticket;
      },
      jiraurl: state => {
        return state.preferences.jiraurl;
      },
      username: state => {
        return state.credentials.username;
      },
      password: state => {
        return state.credentials.password;
      }
    },
    mutations: {
      updateloginstatus(state, status) {
        state.user.loginstatus = status;
      },
      updateusername(state, username) {
        state.credentials.username = username;
      },
      updatepassword(state, password) {
        state.credentials.password = password;
      },
      resetloginentry(state) {
        state.credentials.username = '';
        state.credentials.password = '';
      },
      updatepreferences(state, data) {
        state.preferences.testticket = data.testticket;
        state.preferences.jiraurl = data.jiraurl;
      },
      updateuserinfo(state, user) {
        state.user = user;
      }
    },
    actions: {
      updateloginstatus(context, data) {
        context.commit('updateloginstatus', !!data.jirareportersuccess);
      },
      performtest(context) {
        Vue.axios.get(`${context.state.apiurl}/test?ticket=${context.state.preferences.testticket}`, { withCredentials: true }).then(function (response) {
          context.dispatch('updateloginstatus', response.data);
          console.log(response.data);
        }).catch(function (error) {
          context.dispatch('updateloginstatus', { jirareportersuccess: false });
          console.log(error);
        });
      },
      performlogin(context) {
        Vue.axios.post(`${context.state.apiurl}/logintojira`, {
          authcreds: btoa(`${context.state.credentials.username}:${context.state.credentials.password}`),
          user: context.state.credentials.username
        }, { withCredentials: true }).then(function (response) {
          context.commit('updateusername', '');
          context.commit('updatepassword', '');
          context.commit('updateuserinfo', {
            name: response.data.displayName,
            jiraname: response.data.name,
            email: response.data.emailAddress,
            avatar: response.data.avatarUrls['48x48'] + '&size=large'
          });
          context.dispatch('updateloginstatus', response.data);
        }).catch(function (error) {
          context.dispatch('updateloginstatus', { jirareportersuccess: false });
        });
      },
      updatecurrentuser(context) {
        Vue.axios.get(`${context.state.apiurl}/currentuser`, { withCredentials: true }).then(function (response) {
          context.commit('updateuserinfo', {
            name: response.data.displayName,
            jiraname: response.data.name,
            email: response.data.emailAddress,
            avatar: response.data.avatarUrls['48x48'] + '&size=large'
          });
          context.dispatch('updateloginstatus', response.data);
        }).catch(function (error) {
          context.dispatch('updateloginstatus', { jirareportersuccess: false });
        });
      }
    },
    modules: {
    }
  })
}
