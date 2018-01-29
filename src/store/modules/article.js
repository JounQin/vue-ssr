import { generateGetters } from 'utils'

const RESET_ARTICLES = 'RESET_ARTICLES'
const RESET_ARTICLE = 'RESET_ARTICLE'

export default axios => {
  const state = {
    articles: [],
    article: {},
  }

  const getters = generateGetters(Object.keys(state))

  const actions = {
    async fetchArticles({ commit }) {
      commit(RESET_ARTICLES, (await axios.get('/articles')).data)
    },
    async fetchArticle({ commit }, id) {
      commit(RESET_ARTICLE, (await axios.get(`/article/${id}`)).data)
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

  return {
    state,
    getters,
    actions,
    mutations,
  }
}
