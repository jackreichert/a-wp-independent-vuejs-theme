<template>
  <main class="list list-posts container home">
    <post
        v-if="isLoaded()"
        v-for="singlePost in posts"
        :key="singlePost.ID"
        :post="singlePost"
        :excerpt="isExcerpt"
    />
    <loading v-else/>
    <navigation v-if="isExcerpt"/>
  </main>
</template>
<script>
import Post from "../parts/Post.vue";
import Navigation from "../parts/Navigation.vue";
import Loading from "../parts/Loading.vue";

export default {
  name: "index",
  props: {},
  components: {
    Post,
    Navigation,
    Loading
  },
  computed: {
    posts: function () {
      return this.$store.getters.getPostsForRoute(this.$route.params);
    },
    isExcerpt: function () {
      return 'undefined' === typeof this.$route.params.slug;
    }
  },
  methods: {
    isLoaded: function () {
      return !this.$store.state.isLoading;
    }
  },
  beforeMount() {
    this.$store.dispatch("updateHeadMeta", this.$route);
  },
  watch: {
    $route(to, from) {
      this.$store.dispatch("updateHeadMeta", to);
    }
  }

};
</script>
