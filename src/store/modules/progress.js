import {generateGetters} from 'utils'

const SET_PROGRESS = 'SET_PROGRESS'

export default () => {
  const state = {
    progress: 0
  }

  const getters = generateGetters(Object.keys(state))

  let timeout

  const actions = {
    setProgress({commit}, progress) {
      clearTimeout(timeout)
      commit(SET_PROGRESS, progress)
      if (progress !== 100) return
      timeout = setTimeout(() => {
        commit(SET_PROGRESS, 0)
      }, 500)
    }
  }

  const mutations = {
    [SET_PROGRESS](state, payload) {
      state.progress = payload
    }
  }

  return {
    state,
    getters,
    actions,
    mutations
  }
}
