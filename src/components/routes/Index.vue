<template>
  <main class="list list-posts container home">
    <post
      v-for="singlePost in posts"
      :key="singlePost.ID"
      :post="singlePost"
      :excerpt="true"
    />
    <navigation />
  </main>
</template>
<script>
import Post from "../parts/Post.vue";
import Navigation from "../parts/Navigation.vue";
export default {
  name: "index",
  props: {},
  components: {
    Post,
    Navigation,
  },
  computed: {
    posts: function () {
      return this.$store.getters.getPostsForPage(this.$route.params);
    },
  },
  mounted() {

  },
};
</script>
<style>
</style>