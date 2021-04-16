<template>
  <h1>
    <router-link to="/">
      <span class="site-title">{{ siteTitle }}</span>
      <span class="site-description">{{ siteDescription }}</span>
    </router-link>
  </h1>
</template>

<script>
export default {
  name: 'branding',
  computed: {
    siteTitle: function () {
      return this.$store.getters.getSiteConfig('siteTitle')
    },
    siteDescription: function () {
      return this.$store.getters.getSiteConfig('tagline')
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/variables.scss";

h1 {
  font-size: 1.5rem;
  margin: 0;

  .site-title {
    font-weight: lighter;
    margin-right: 0.5rem;
  }

  @include for-small {
    font-size: 1.25rem;
  }
}
</style>
