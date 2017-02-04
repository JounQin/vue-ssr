<template lang="pug">
  div(:class="$style.hiProgress", :style="{width: progress + '%'}")
</template>
<script>
  export default {
    name: 'hi-progress',
    props: {
      className: {
        type: String,
        default: ''
      },
      progress: {
        type: Number,
        default: 0
      }
    }
  }
</script>
<style lang="stylus" module>
  $progress-color = #39b983

  .hi-progress
    fixed()
    z-index 100001
    top 0
    left 0
    background-color $progress-color
    width 100%
    height 3px
    transition width .5s ease
</style>
