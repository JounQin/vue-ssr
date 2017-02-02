<template>
  <div :class="$style.hiProgress" :style="{width: progress + '%'}"/>
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
<style lang="styl" src="./index.styl" module/>
