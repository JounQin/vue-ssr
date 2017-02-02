<template>
  <div :class="$style.hiLoading">
    <div :class="$style['hi-loading-' + theme]"></div>
    <slot/>
  </div>
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
<style lang="styl" src="./index.styl" module/>
