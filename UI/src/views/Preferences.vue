<template>
  <div>
    <v-row class="pl-8 pt-3">
      <span class="text-4 text-h4">Application Preferences</span>
    </v-row>
    <v-sheet max-width="700" class="mx-auto px-6 pa-6">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="testticket"
          :rules="testticketrules"
          label="Test Ticket"
          placeholder="Ticket to test connection to Jira"
          required
        ></v-text-field>
        <v-text-field
          v-model="jiraurl"
          label="Jira URL"
          :rules="jiraurlrules"
          required
        ></v-text-field>

        <v-btn
          color="primary"
          @click="save"
          :disabled="!valid"
          class="mr-4 mt-3"
          width="20%"
        >
          Save
        </v-btn>
        <v-btn elevation="0" @click="reset" class="mr-4 mt-3" width="20%">
          Reset
        </v-btn>
      </v-form>
    </v-sheet>
  </div>
</template>
<script>
export default {
  name: "Preferences",
  data: () => ({
    valid: false,
    testticket: "",
    testticketrules: [
      (v) => !!v || "Ticket is required",
      (v) =>
        (v && /^[a-zA-Z]+-[0-9]+$/.test(v)) || "Must be a valid Jira ticket",
    ],
    jiraurl: "",
    jiraurlrules: [(v) => !!v || "URL is required"],
  }),
  methods: {
    save() {
      this.$store.commit("updatepreferences", {
        testticket: this.testticket,
        jiraurl: this.jiraurl,
      });
    },
    reset() {
      this.testticket = this.$store.getters.testticket;
      this.jiraurl = this.$store.getters.jiraurl;
    },
  },
  mounted() {
    this.testticket = this.$store.getters.testticket;
    this.jiraurl = this.$store.getters.jiraurl;
  },
};
</script>