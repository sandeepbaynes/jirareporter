<template>
  <v-navigation-drawer app permanent expand-on-hover>
    <v-list>
      <v-list-item class="justify-center px-2">
        <v-list-item-avatar class="justify-center">
          <v-img v-bind:src="avatar"></v-img>
        </v-list-item-avatar>
      </v-list-item>

      <v-list-item link>
        <v-list-item-content>
          <v-list-item-title class="title">
            {{ username }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ email }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list nav dense>
      <v-list-item to="/login" link>
        <v-list-item-icon>
          <v-icon v-bind:color="loginstatuscolor">
            {{ loginstatusicon }}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-title>
          {{ loginscreentitle }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item to="/" link>
        <v-list-item-icon>
          <v-icon>mdi-view-dashboard</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Dashboard</v-list-item-title>
      </v-list-item>
      <v-list-item to="/setupteams" link>
        <v-list-item-icon>
          <v-icon>mdi-account-multiple</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Setup Teams</v-list-item-title>
      </v-list-item>
      <v-list-item to="/preferences" link>
        <v-list-item-icon>
          <v-icon>mdi-application-settings</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Preferences</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
export default {
  data: () => ({}),
  computed: {
    avatar: {
      get() {
        return this.$store.state.user.avatar;
      },
    },
    username: {
      get() {
        return this.$store.state.user.name;
      },
    },
    email: {
      get() {
        return this.$store.state.user.email;
      },
    },
    loginstatuscolor: {
      get() {
        return this.$store.state.user.loginstatus ? "green" : "red";
      },
    },
    loginstatusicon: {
      get() {
        return this.$store.state.user.loginstatus
          ? "mdi-check-circle"
          : "mdi-alert-circle";
      },
    },
    loginscreentitle: {
      get() {
        return this.$store.getters.loginstatustitle;
      },
    },
  },
};
</script>