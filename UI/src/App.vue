<template>
  <v-app id="inspire">
    <NavigationDrawer />

    <v-app-bar elevation="1" color="white" app>
      <v-toolbar-title>Jira Reporter - Code Worldwide</v-toolbar-title>
      <v-img
        src="./assets/cww_logo.png"
        height="29"
        contain
        position="right"
      />
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import NavigationDrawer from "@/components/NavigationDrawer.vue";

export default {
  name: "App",
  components: {
    NavigationDrawer,
  },
  mounted() {
    this.$store.dispatch('updatecurrentuser');
  },
};
</script>
