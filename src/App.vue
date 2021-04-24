<template>
  <heading/>
  <router-view/>
  <site-footer/>
</template>

<script>
import moment from "moment";
import Heading from "./components/parts/SiteHeader.vue";
import SiteFooter from "./components/parts/SiteFooter.vue";
import utils from "./utils";

export default {
  name: "App",
  components: {
    Heading,
    SiteFooter,
  },
  beforeCreate() {
    if (utils.storageAvailable("localStorage")) {
      this.$store.commit("getInitialiseStore");
    }
    if (
        Object.keys(this.$store.state.post).length === 0 ||
        moment() > moment(this.$store.state.lastUpdated).add(5, "minutes")
    ) {
      this.$store.commit("setSiteConfig");
      this.$store.dispatch("fetchSiteMeta");
      this.$store.dispatch("getTraverseCategories");
      this.$store.dispatch("fetchAllPosts");
      this.$store.dispatch("fetchAllPages");
      this.$store.dispatch("fetchAllTestimonials");
    } else {
      this.$store.commit('fetching', false)
    }
  },
  updated() {
    this.$nextTick(function () {
      window.scrollTo(0, 0);
    })
  }
};
</script>
