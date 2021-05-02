<template>
  <footer>
    <div class="doublebar">
      <small class="db-content" v-if="isPost">Published in
        <span v-if="traverse" v-for="category in categories">{{ category.name }}</span>
        <router-link v-else-if="isPost" v-for="category in categories" :to="categoryLink(category)">{{
            category.name
          }}
        </router-link>
      </small>
    </div>
    <em>
      <small v-if="isPost && tags.length" class="tags">
        Tags:
        <span v-if="traverse" v-for="tag in tags">{{ tag.name }}</span>
        <router-link v-else-if="isPost" v-for="tag in tags" :to="tagLink(tag)">{{ tag.name }}</router-link>
      </small>
      <p v-else/>
    </em>
  </footer>
</template>
<script>
export default {
  name: "PostFooter",
  props: {
    categories: Object,
    tags: Object,
    isPost: Boolean
  },
  computed: {
    traverse: function () {
      return this.$route.path === '/traverse'
    }
  },
  methods: {
    categoryLink: function (category) {
      return `/category/${category.slug}`
    },
    tagLink: function (tag) {
      return `/tag/${tag.slug}`
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../style/variables.scss";
/* https://css-tricks.com/line-on-sides-headers/ */
footer {
  width: 80%;
  max-width: 90ch;
  padding: 0.25rem 2rem;
  background: $white;
  z-index: 1;
  position: relative;
  margin: 0rem auto 0;
}

.doublebar {
  line-height: 0.5;
  text-align: center;
  padding: 1rem;
  overflow: hidden;

  .db-content {
    display: inline-block;
    position: relative;

    &:before,
    &:after {
      content: "";
      position: absolute;
      height: 5px;
      border-bottom: 1px solid $brand-contrast;
      border-top: 1px solid $brand-contrast;
      top: 0;
      width: 600px;
    }

    &:before {
      right: 100%;
      margin-right: 15px;
    }

    &:after {
      left: 100%;
      margin-left: 15px;
    }
  }
}

.tags {
  a:after {
    content: ", ";
    color: $black;
  }

  a:last-child:after {
    content: "";
  }
}
</style>