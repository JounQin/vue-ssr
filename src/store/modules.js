const modulesContext = require.context('./modules', false, /\.js$/)

const chunks = modulesContext.keys().reduce((modules, key) => {
  modules[key.replace(/(^\.\/)|(\.js$)/g, '')] = modulesContext(key).default
  return modules
}, {})

const moduleNames = Object.keys(chunks)

export default () => moduleNames.reduce((modules, moduleName) => {
  modules[moduleName] = chunks[moduleName]()
  return modules
}, {})
