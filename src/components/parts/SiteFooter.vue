<template>
  <footer class="site-footer">
    <primary-navigation class="bottom-navigation" />
    <small class="copy">
      Copyright &copy; {{ copyright }} {{ siteTitle }}. All Rights Reserved.
    </small>
  </footer>
</template>
<script>
import moment from "moment";
import PrimaryNavigation from "./PrimaryNavigation.vue";

export default {
  name: "SiteFooter",
  components: {
    PrimaryNavigation
  },
  computed: {
    copyright: () => {
      return moment().format("YYYY");
    },
    siteTitle: function () {
      return this.$store.getters.getSiteConfig("siteTitle");
    },
    routes: () => routes,
  },
};
</script>
<style lang="scss">
@import "../../style/variables.scss";

.site-footer {
  font-size: 0.75rem;
  text-align: center;
  margin: 2rem 0 1rem;

  .copy {
    display: block;
    clear: both;
  }

  .bottom-navigation {
    ul {
      margin: 0;
      padding: 0;
      display: inline-block;
      text-align: center;

      li {
        display: inline-block;
        padding: 0 1rem;
        @include for-small {
          padding: 0 0.25rem;
        }

        a {
          font-weight: lighter;
        }
      }
    }
  }
}
</style>