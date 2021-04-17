<template>
  <div>
    <h1>
      Hi! I'm Jack!
    </h1>
    <p>The site is now loading...</p>
    <p v-if="hasFivePassed">Getting ready for awesomeness...</p>
    <p v-if="hasTenPassed">Hmm, looks like you are having an issue, please try reloading the page or <a
        href="https://twitter.com/jackreichert/">letting me know.</a></p>
  </div>
</template>

<script>
export default {
  name: 'loading',
  data() {
    return {
      hasFivePassed: false,
      hasTenPassed: false
    }
  },
  methods: {
    waitFive: function () {
      setTimeout(() => {
        if (this.hasFivePassed) {
          this.hasTenPassed = true;
        }
        this.hasFivePassed = true;
        this.waitFive()
      }, 5000);
    }
  },
  mounted() {
    this.waitFive()
  }
};
</script>

<style lang="scss" scoped>
@import "../../style/variables.scss";

div {
  text-align: center;
  height: 65vh;
}
</style>