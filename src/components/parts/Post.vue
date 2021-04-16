<template>
  <article class="entry" v-if="post">
    <post-header
        :title="post.title"
        :url="post.URL"
        :featured-image="post.featured_image"
        :date="post.date"
        :author="post.author.name"
        :is-post="post.type === 'post'"
    />
    <testimonial v-if="isTestimonials" :post="this.post"/>
    <div class="entry-content" v-else v-html="excerpt ? post.excerpt : post.content"/>
    <post-footer :tags="post.tags" :categories="post.categories" :is-post="post.type === 'post'"/>
  </article>
  <not-found v-else/>
  <navigation v-if="!excerpt" :post-id="post.ID"/>
</template>

<script>
import PostHeader from "./PostHeader.vue";
import PostFooter from "./PostFooter.vue";
import NotFound from "./NotFound.vue";
import Navigation from "./Navigation.vue";
import Testimonial from "./Testimonial.vue";

export default {
  name: "Post",
  components: {
    PostHeader,
    PostFooter,
    Navigation,
    Testimonial,
    NotFound
  },
  props: {
    post: Object,
    excerpt: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isTestimonials: function () {
      return this.post.content.includes('[testimonials]')
    }
  }
};
</script>

<style lang="scss">
@import "../../style/variables.scss";

article.entry {
  margin: 0 0 2rem 0;

  .entry-content {
    background: $white;
    @include center-column();

    p:first-child {
      margin-top: 0;
    }

    img {
      max-width: 100%;
      height: auto;
    }

    ul > li,
    ol > li {
      margin-bottom: 1rem;
    }

    hr {
      margin-top: 1.5rem;
    }

    .wp-block-gallery {
      max-width: calc(782px - 32px);
      margin: 0;

      .blocks-gallery-grid {
        display: flex;
        flex-wrap: wrap;
        list-style-type: none;
        padding: 0;
        margin: 0;

        .blocks-gallery-item {
          width: calc(33.33333% - .66667em);
          margin: 0 0.5rem 0.5rem 0;
          &:last-child {
            width: calc(100% - 1rem);
          }
          figure {
            display: flex;
            align-items: flex-end;
            justify-content: flex-start;
            margin: 0;

            img {
              height: 100%;
              width: 100%;
              flex: 1;
              object-fit: cover;
            }
          }
        }

      }

    }
  }

  footer {
    @include center-column();
    margin-bottom: 2rem;
  }
}

.single {
  $top: 4rem;

  article.entry {
    header.with-img {
      margin-top: calc(-1 * (#{$top} + 5rem));
      @include for-medium {
        margin: 0;
        -webkit-clip-path: none;
        clip-path: none;
      }
    }

    img.image-heading {
      -webkit-clip-path: inset($top 0px);
      clip-path: inset($top 0px);
      margin-top: -$top;
      @include for-medium {
        margin: 0;
        -webkit-clip-path: none;
        clip-path: none;
      }
    }
  }
}
</style>