export const generateGetters = keys => {
  Array.isArray(keys) || (keys = [keys])
  const getters = {}
  keys.forEach(key => (getters[key] = state => state[key]))
  return getters
}
