<template>
  <main>
    <post :key="singlePost.ID" :post="singlePost"/>
  </main>
</template>
<script>
import Post from '../parts/Post.vue'
import Testimonial from '../parts/Testimonial.vue'

export default {
  name: 'single',
  props: {},
  components: {
    Post,
    Testimonial
  },
  computed: {
    singlePost: function () {
      return this.$store.getters.getBySlug(this.$route.params.slug)
    }
  },
  mounted() {

  }
}
</script>
<style>

</style>
