<template>
  <v-container fill-height fluid>
    <v-card elevation="5" class="mx-auto align-self-center" width="500">
      <v-card-title>
        {{ loginscreentitle }}
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="12">
            <v-text-field v-model="username" label="Username"></v-text-field>
          </v-col>
          <v-col cols="12" sm="12">
            <v-text-field
              :type="'password'"
              v-model="password"
              label="Password"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          large
          color="primary"
          @click="login"
          :disabled="!(username && password)"
          width="30%"
        >
          Login
        </v-btn>
        <v-btn
          large
          elevation="0"
          @click="resetloginform"
          :disabled="!(username || password)"
          width="30%"
        >
          Reset
        </v-btn>
        <v-btn
          large
          elevation="0"
          @click="runtest"
          width="30%"
        >
          Test Request
        </v-btn>
      </v-card-actions>
      <v-card-text>
        <p>
          <b>Note</b>: Credentials are not saved on site or server. They are
          cleared for every login attempt.
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
export default {
  name: "Login",
  data: () => ({}),
  methods: {
    resetloginform() {
      this.$store.commit("resetloginentry");
    },
    async runtest() {
      this.$store.dispatch("performtest");
    },
    login() {
      this.$store.dispatch("performlogin");
    },
  },
  computed: {
    username: {
      get() {
        return this.$store.getters.username;
      },
      set(value) {
        this.$store.commit("updateusername", value);
      },
    },
    password: {
      get() {
        return this.$store.getters.password;
      },
      set(value) {
        this.$store.commit("updatepassword", value);
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