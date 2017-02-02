<template lang="pug" src="./index.pug"></template>
<script>
  import {ensure, removeClass} from 'utils'

  export default {
    name: 'home',
    mounted() {
      ensure(Object.values(this.$refs), 'animationend', (e, el) => {
        removeClass(e ? e.target : el, 'animated')
      }, 1600)
    }
  }
</script>
<style lang="styl" src="./index.styl" module/>
