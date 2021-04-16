<template>
  <div class="entry-content">
    <div v-html="content"/>
    <blockquote v-for="testimonial in testimonials">
      <div v-html="testimonial.content"/>
      <cite>
        <span v-html="testimonial.title"/> {{ getYear(testimonial.date) }}
      </cite>
    </blockquote>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: "Testimonial",
  props: {
    post: Object,
  },
  components: {},
  computed: {
    testimonials: function () {
      return this.$store.getters.getTestimonials()
    },
    content: function () {
      return this.post.content.replace('[testimonials]', '')
    }
  },
  methods: {
    getYear: function (date) {
      return moment(date).year()
    }
  }
};
</script>

<style lang="scss">
@import "../../style/variables.scss";

</style>
