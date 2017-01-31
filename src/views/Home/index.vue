<template>
  <div :class="$style.home">
    {{ text }}
    <router-link to="/test">Go to test</router-link>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        text: 'My Text'
      }
    }
  }
</script>
<style module>
  .home {
    color: red;
  }
</style>
