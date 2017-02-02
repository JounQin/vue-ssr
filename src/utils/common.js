import {isArrayLike, isObject} from 'lodash'

export const each = (collection, iteratee, context) => {
  iteratee = context ? iteratee.bind(context) : iteratee

  let entries

  if (isArrayLike(collection)) {
    entries = Array.from(collection).entries()
  } else if (isObject(collection)) {
    entries = Object.entries(collection)
  }

  if (entries) {
    for (const [key, value] of entries) {
      if (iteratee(value, key, collection) === false) return
    }
  } else each([collection], iteratee, context)
}

export function throttle(action, delay) {
  let timeout = null
  let lastRun = 0

  return function () {
    if (timeout) return

    const runCallback = () => {
      lastRun = Date.now()
      timeout = false
      action.apply(this, arguments)
    }

    Date.now() - lastRun >= delay ? runCallback() : (timeout = setTimeout(runCallback, delay))
  }
}
