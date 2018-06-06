const SET_SIZE = 'SET_SIZE'

const state = () => ({
  baseWidth: 375,
  baseFontSize: 16,
  dpi: 1,
  winHeight: 667,
  winWidth: 375,
  appWidth: 375,
  rem: 1,
  fontSize: 16,
  logicWidth: 375,
  threshold: 768,
  mode: true,
})

const actions = {
  setSize({ commit }, { winHeight, winWidth }) {
    const size = { winHeight, winWidth }
    const baseWidth = state.baseWidth
    size.dpi = window.devicePixelRatio
    const mode = (size.mode = winWidth < state.threshold)
    let logicWidth
    size.rem =
      (logicWidth = size.logicWidth = mode ? winWidth : baseWidth) / baseWidth
    size.fontSize = (logicWidth * state.baseFontSize) / baseWidth
    size.appWidth = Math.min(1024, winWidth)
    commit(SET_SIZE, size)
  },
}

const mutations = {
  [SET_SIZE](state, size) {
    Object.assign(state, size)
  },
}

export default {
  state,
  actions,
  mutations,
}
