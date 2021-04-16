<template>
  <header class="site-header" role="banner">
    <branding />
    <primary-navigation class="primary-navigation" />
  </header>
</template>

<script>
import Branding from "./Branding.vue";
import PrimaryNavigation from "./PrimaryNavigation.vue";

export default {
  name: "Heading",
  components: {
    PrimaryNavigation,
    Branding,
  },
};
</script>
<style lang="scss">
@import "../../style/variables.scss";

.site-header {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  padding: 1rem;
  background: $dark;
  overflow: hidden;
  font-family: $sans-serif;

  a {
    text-decoration: none;
    color: $white;

    &:hover {
      color: $white;
    }
  }

  .primary-navigation {
    ul {
      margin: 0;

      li {
        float: left;
        list-style-type: none;
        margin-left: 1rem;

        a {
          font-weight: lighter;
        }
      }
    }

    @include for-small {
      display: none;
    }
  }
}
</style>
