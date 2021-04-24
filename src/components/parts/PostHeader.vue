<template>
  <figure class="image-figure" v-if="hasFeaturedImage" :style="{'background-image': `url(${featuredImage})`}"
          role="img" :aria-label="title"/>
  <header :class="hasFeaturedImage ? 'with-img' : ''">
    <h1>
      <router-link :to="{ path: permalink }" v-html="title"/>
    </h1>
    <div class="entry-meta" v-if="isPost">
      <em>By {{ author }}</em>
      <time :datetime="unixTimestamp">
        <span class="month">{{ month }}</span>
        <span class="day">{{ day }}</span>
        <span class="year">{{ year }}</span>
      </time>
    </div>
  </header>
</template>

<script>
import moment from 'moment';

export default {
  name: "PostHeader",
  props: {
    title: String,
    url: String,
    featuredImage: String,
    date: String,
    author: String,
    isPost: Boolean
  },
  computed: {
    permalink: function () {
      return new URL(this.url).pathname.replace(`/${this.day}/`, '/');
    },
    hasFeaturedImage: function () {
      return this.featuredImage !== "";
    },
    unixTimestamp: function () {
      return moment(this.date).unix()
    },
    month: function () {
      return moment(this.date).format('MMMM')
    },
    day: function () {
      return moment(this.date).date()
    },
    year: function () {
      return moment(this.date).year()
    }
  },
  beforeMount() {
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/variables.scss";

$top: 8rem;
figure.image-figure {
  margin: 0;
  padding: 3rem;
  z-index: -2;
  position: relative;
  display: block;
  padding-bottom: (1200 / 1600) * 100%;
  margin-top: -$top;
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

@media only screen and (max-device-width: 1366px) {
  figure.image-figure {
    background-attachment: scroll;
  }
}


header {
  width: 80%;
  max-width: 90ch;
  padding: 0.25rem 2rem 1.5rem;
  background: $white;
  z-index: 1;
  position: relative;
  margin: 1rem auto 0;

  &.with-img {
    margin-top: calc(-1 * (#{$top} + 5rem));
  }

  @include for-medium {
    &.with-img {
      margin: 0;
      width: auto;
    }
  }

  h1 {
    color: $brand-contrast;
    font-size: 2rem;
    @include for-medium {
      margin: 0;
      font-size: 1.5rem;
    }
  }

  .entry-meta {
    @include center-column();
    @include not-large {
      text-align: center;
    }
  }

  time {
    position: absolute;
    left: 2em;
    color: $brand-contrast;

    span {
      position: absolute;
      top: 0rem;
    }

    .month {
      font-family: $sans-serif;
    }

    .day {
      top: 0.75rem;
      font-weight: bold;
      font-family: $sans-serif;
      font-size: 2.5rem;
    }

    .year {
      transform: rotate(-90deg);
      top: 1.75rem;
      left: 3rem;
    }
  }

  @include not-large {
    time,
    time span,
    time .month,
    time .day,
    time .year {
      position: static;
      color: $black;
      font-family: $serif;
      font-size: 1rem;
      font-weight: normal;
      margin: 0;
    }
    time:before {
      content: " | ";
    }
    time {
      .month:after {
        content: " ";
      }

      .day:after {
        content: ", ";
      }
    }
  }
}
</style>
