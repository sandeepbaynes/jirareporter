<template>
  <div>
    <span class="text-6 text-h6">Story point to time conversion</span><br />
    <span v-for="sprint in sprintsdata" :key="sprint.name">{{
      sprint.name
    }}</span>
  </div>
</template>
<script>
import VueApexCharts from "vue-apexcharts";

export default {
  components: {
    ApexCharts: VueApexCharts,
  },
  data: () => {
    return {};
  },
  props: {
    sprintsdata: null,
  },
  computed: {
      
  }
};
</script>