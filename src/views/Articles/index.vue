<template lang="pug">
  main(:class="$style.container")
    ol.list-unstyled
      li(v-for="{id, title, summary} of articles")
        router-link(:to="`/article/${id}`")
          h4 {{ title }}
        p {{ summary }}
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Articles',
  title: '文章列表页',
  async asyncData({ store }) {
    await store.dispatch('fetchArticles')
  },
  computed: {
    ...mapGetters(['articles']),
  },
}
</script>
<style lang="stylus" module>
  .container
    padding 0 10px

    > ol > li
      margin-bottom 20px
</style>
