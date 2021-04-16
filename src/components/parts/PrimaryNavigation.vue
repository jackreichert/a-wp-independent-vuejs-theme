<template>
  <nav>
    <ul>
      <li v-for="route in routes" :key="route.path">
        <router-link
            :to="route.path"
            :class="{ active: isActive(route.path) }">
          {{ route.title }}
        </router-link
        >
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  methods: {
    isActive: function (path) {
      return path === this.$router.currentRoute.value.path;
    },
  },
  computed: {
    routes: function () {
      return this.$store.getters.getPageMenu()
    },
  },
};
</script>
