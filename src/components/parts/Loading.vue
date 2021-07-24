<template>
  <div>
    <h1>
      Hi! I'm Jack!
    </h1>
    <p>Technical Lead, ScrumMaster, for BlueVoyant’s MSS Engineering team. Most forked and starred ReactJS/Redux
      WordPress theme on Github. Built ISDA’s web department as Director of Web Development and Lead Full-stack
      Developer. Lead Front-end Developer for Blackberry Travel’s web application. Technical co- founder of Green
      Prophet, the Premier Middle East environmental news site.</p>
    <p>Philosophy major. Forbes.com contributor. Engineering web applications, professionally, full time for over a
      decade. Committed to optimizing, testing, refactoring, and perfecting every aspect of the stack from UX and
      typography, to architecting projects, to queries and algorithms, to infrastructure as code.</p>
    <p>JavaScript/NodeJS ♦ ReactJS/Redux ♦ Vue.js ♦ Golang ♦ Python ♦ CSS
      ♦ PHP ♦ WordPress ♦ Postgres/MySQL ♦ Docker ♦ Ansible ♦ AWS ♦ Website optimization ♦ Web security ♦ Team
      Development ♦ Project Management ♦ UI/UX Design ♦ Photoshop</p>
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