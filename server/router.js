import fs from 'fs'
import path from 'path'

import Router from 'koa-router'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import minifier from 'html-minifier'

import config from '../build/config'

import articles from './articles/data.json'

const md = new MarkdownIt({
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
          hljs.highlight(lang, str, true).value +
          '</code></pre>'
      } catch (e) {
      }
    }

    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
  }
})

const router = new Router({prefix: '/api'})
  .get('/articles', ctx => (ctx.body = articles))
  .get('/article/:id', ctx => {
    const id = ctx.params.id
    const article = articles.find(article => article.id === id)
    if (!article) return
    if (!article.content) {
      const result = md.render(fs.readFileSync(path.resolve(__dirname, `./articles/${article.file}.md`), 'utf-8'))
      article.content = config.minimize ? minifier.minify(result, {collapseWhitespace: true}) : result
    }
    ctx.body = article
  })

export default app => app.use(router.routes()).use(router.allowedMethods())
