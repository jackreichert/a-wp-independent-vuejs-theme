<template>
  <main class="list list-posts container home">
    <post
        v-if=" ! isMissing()"
        v-for="singlePost in posts"
        :key="singlePost.ID"
        :post="singlePost"
        :excerpt="isExcerpt"
    />
    <not-found v-else-if="isMissing()"/>
  </main>
</template>
<script>
import Post from "../parts/Post.vue";
import Navigation from "../parts/Navigation.vue";
import NotFound from "../parts/NotFound.vue";

export default {
  name: "traverse",
  props: {},
  components: {
    Post,
    Navigation,
    NotFound
  },
  computed: {
    posts: function () {
      console.log(this.$store.getters.getTraversePosts())
      return this.$store.getters.getTraversePosts();
    },
    isExcerpt: function () {
      return 'undefined' === typeof this.$route.params.slug;
    }
  },
  methods: {
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
