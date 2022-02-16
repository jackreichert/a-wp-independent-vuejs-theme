<template>
  <article class="entry">
    <p class="entry-content">Finding your page...</p>
  </article>
</template>
<script>
export default {
  name: "NotFound"
}
</script>
<style lang="scss" scoped>
@import "../../style/variables.scss";

article {
  @include center-column();
  text-align: center;
  margin: 3rem auto;
}
</style>