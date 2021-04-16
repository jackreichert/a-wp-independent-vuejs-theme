<template>
  <nav>
    <router-link :to="prevLink" v-if="prevLink !== '/'">Previous</router-link>
    <span v-if="prevLink !== '/'">&nbsp; &diams; &nbsp;</span>
    <router-link to="/">Home</router-link>
    <span v-if="nextLink !== '/'">&nbsp; &diams; &nbsp;</span>
    <router-link :to="nextLink" v-if="nextLink !== '/'">Next</router-link>
  </nav>
</template>
<script>
export default {
  name: "navigation",
  props: {
    postId: Number
  },
  computed: {
    prevLink: function () {
      if (this.isSingle()) {
        return this.$store.getters.getPreviousPost(this.postId)
      }
      let link = ''
      if (this.isCategory()) {
        link += `/category/${this.$route.params.category}`
      }
      return link + this.$store.getters.getPreviousPageLink(
          this.$route.params.pageNum
      );
    },
    nextLink: function () {
      if (this.isSingle()) {
        return this.$store.getters.getNextPost(this.postId)
      }
      let link = ''
      if (this.isCategory()) {
        link += `/category/${this.$route.params.category}`
      }
      return link + this.$store.getters.getNextPageLink(
          this.$route.params.pageNum
      );
    }
  },
  methods: {
    isSingle: function () {
      return parseInt(this.$route.params.year);
    },
    isCategory: function () {
      return 'undefined' !== typeof this.$route.params.category
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../../style/variables.scss";

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
</style>