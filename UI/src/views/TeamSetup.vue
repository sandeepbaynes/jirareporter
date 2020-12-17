<template>
  <div>
    <v-row class="pl-8 pt-3">
      <span class="text-h4">Setup Teams</span>
    </v-row>
    <v-row class="mx-2">
      <v-col
        v-for="(team, index) in teams"
        :key="team.name"
        cols="12"
        md="6"
        xl="4"
      >
        <TeamCard :index="index"></TeamCard>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import TeamCard from "@/components/TeamCard.vue";

export default {
  name: "TeamSetup",
  components: {
    TeamCard,
  },
  computed: {
    teams() {
      return this.$store.getters.teams;
    },
  },
};
</script>