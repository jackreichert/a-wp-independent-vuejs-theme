<template>
  <main class="list list-posts container home">
    <post
        v-if="isLoaded() && ! isMissing()"
        v-for="singlePost in posts"
        :key="singlePost.ID"
        :post="singlePost"
        :excerpt="isExcerpt"
    />
    <loading v-else-if="!isLoaded()"/>
    <not-found v-else/>
    <navigation v-if="isExcerpt"/>
  </main>
</template>
<script>
import Post from "../parts/Post.vue";
import Navigation from "../parts/Navigation.vue";
import Loading from "../parts/Loading.vue";
import NotFound from "../parts/NotFound.vue";

export default {
  name: "index",
  props: {},
  components: {
    Post,
    Navigation,
    Loading,
    NotFound
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
    },
    isMissing: function () {
      return 0 === this.posts.length;
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
