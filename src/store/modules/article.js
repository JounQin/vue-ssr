import { generateGetters } from 'utils'

const RESET_ARTICLES = 'RESET_ARTICLES'
const RESET_ARTICLE = 'RESET_ARTICLE'

const state = () => ({
  articles: [],
  article: {},
})

const getters = generateGetters(['articles', 'article'])

const actions = {
  async fetchArticles({ commit, rootState }) {
    commit(RESET_ARTICLES, (await rootState.http.get('/articles')).data)
  },
  async fetchArticle({ commit, rootState }, id) {
    commit(RESET_ARTICLE, (await rootState.http.get(`/article/${id}`)).data)
  },
}

const mutations = {
  [RESET_ARTICLES](state, articles) {
    state.articles = articles
  },
  [RESET_ARTICLE](state, article) {
    state.article = article
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
