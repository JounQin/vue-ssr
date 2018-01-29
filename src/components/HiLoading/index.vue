<template lang="pug">
  div(:class="$style.hiLoading")
    div(:class="$style['hi-loading-' + theme]")
    slot
</template>
<script>
export default {
  name: 'HiLoading',
  props: {
    className: {
      type: String,
      default: '',
    },
    theme: {
      type: String,
      default: 'snake',
    },
  },
}
</script>
<style lang="stylus" module>
  .hi-loading
    position fixed
    top 0
    right 0
    bottom 0
    left 0
    width 100%
    height 100%
    text-align center
    background-color rgba(0, 0, 0, .25)
    z-index 500

  .hi-loading-snake
    position absolute
    top 50%
    left 50%
    transform translate3d(-50%, -50%, 0)
    border 4px solid #ccc
    border-right-color transparent
    border-radius 50%
    width 32px
    height 32px
    display inline-block
    animation hi-loading-snake-rotate .5s infinite linear

  @keyframes hi-loading-snake-rotate
    from
      transform translate3d(-50%, -50%, 0) rotate(0deg)

    to
      transform translate3d(-50%, -50%, 0) rotate(1turn)
</style>
