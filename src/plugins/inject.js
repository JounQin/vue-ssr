import Vue from 'vue'

const combine = function (context, modules, key) {
  const module = context(key)
  modules[key.replace(/(^\.\/)|(\.(js|vue)$)/g, '')] = module.default || module
  return modules
}

const HANDLER = {
  component: combine,
  directive: combine,
  filter: (context, modules, key) => Object.assign(modules, context(key)),
  mixin: combine
}

export default (context, type) => {
  const values = context.keys().reduce((modules, key) => HANDLER[type](context, modules, key), {})
  Object.keys(values).forEach(key => {
    const value = values[key]
    Vue[type](...type === 'mixin' ? [value] : [key, value])
  })
}
