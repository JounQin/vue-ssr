const modulesContext = require.context('./modules', false, /\.js$/)

const modules = modulesContext.keys().reduce((modules, key) => {
  modules[key.replace(/(^\.\/)|(\.js$)/g, '')] = modulesContext(key).default
  return modules
}, {})

export default () => Object.keys(modules).reduce((prev, curr) => {
  prev[curr] = modules[curr]()
  return prev
}, {})
