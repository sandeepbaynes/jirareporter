<template>
  <v-card elevation="3">
    <v-card-title> Team {{ team.name }} </v-card-title>
    <v-divider></v-divider>
    <div class="ml-6 mt-3"><span class="text-h6">Members</span></div>
    <v-card-text>
      <v-list>
        <v-list-item v-for="member in team.members" :key="member.name">
          <v-list-item-avatar class="justify-center">
            <v-img v-bind:src="member.avatar"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ member.name }}</v-list-item-title>
            <v-list-item-subtitle
              >Jira | {{ member.jiraname }}</v-list-item-subtitle
            >
          </v-list-item-content>
          <v-spacer></v-spacer>
          <v-list-item-content>{{ member.type }}</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-divider></v-divider>
    <div>
      <div class="ml-6 mt-3"><span class="text-h6">Sprints</span></div>
      <v-chip v-for="sprint in team.sprints" :key="sprint" class="ms-4 mb-2">
        {{ sprint }}
      </v-chip>
      <v-chip v-if="team.sprints.length == 0" class="ml-4 mb-3">
        <v-icon class="mr-2">
          mdi-alert-circle
        </v-icon>
        No sprints added for this team
      </v-chip>
    </div>
  </v-card>
</template>
<script>
export default {
  data: () => ({
    teamname: "Test Team",
  }),
  props: {
    index: Number,
  },
  computed: {
    team() {
      return this.$store.getters.teams[this.index];
    },
  },
};
</script>