<template lang="pug">
  div(:class="$style.hiLoading")
    div(:class="$style['hi-loading-' + theme]")
    slot
</template>
<script>
  export default {
    name: 'hi-loading',
    props: {
      className: {
        type: String,
        default: ''
      },
      theme: {
        type: String,
        default: 'snake'
      }
    }
  }
</script>
<style lang="stylus" module>
  .hi-loading
    fixed(left)
    top 50%
    size 100%
    text-align center
    transform translate3d(0, -50%, 0)
    background-color rgba(0, 0, 0, .25)
    z-index 500

  .hi-loading-snake
    animation hi-loading-snake-rotate .5s infinite linear
    border 4px solid rgb(204, 204, 204)
    border-right-color transparent
    border-radius 50%
    size 32px
    display inline-block
    middleCenter()

  @keyframes hi-loading-snake-rotate
    from
      transform translate3d(-50%, -50%, 0) rotate(0deg)

    to
      transform translate3d(-50%, -50%, 0) rotate(1turn)
</style>
