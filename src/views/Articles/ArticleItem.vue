<template lang="pug">
  main(:class="$style.container")
    h1 {{ article.title }}
      router-link.pull-right(to="/articles")
        small 返回列表页
    article(v-html="article.content")
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ArticleItem',
  title() {
    return this.article.title
  },
  async asyncData({ store, route }) {
    await store.dispatch('fetchArticle', route.params.id)
  },
  computed: {
    ...mapGetters(['article']),
  },
}
</script>
<style src="highlight.js/styles/github-gist.css">

</style>
<style lang="stylus" module>
  .container
    padding 0 10px

    h1
      margin-bottom 20px

      small
        cursor pointer
</style>
