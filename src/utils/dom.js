import {each} from 'lodash'

export const domEach = (el, ...args) => each(Array.isArray(el) || el instanceof NodeList ? el : [el], ...args)

const classRegExp = className => new RegExp(`(^|\\s+)${className.toString().trim()}(\\s+|$)`, 'g')

export const hasClass = (el, className) => classRegExp(className).test(el.className)

export const addClass = (el, className) => domEach(el, el => {
  let classNames = className.split(' ')
  classNames.length > 1 ? each(classNames, className => addClass(el, className))
    : hasClass(el, className) || (el.className = `${el.className} ${className}`.trim())
})

export const removeClass = (el, className) =>
  domEach(el, el => (el.className = el.className.replace(classRegExp(className), ' ').trim()))

export const on = (el, events, handler, useCapture = false) =>
  domEach(el, el => events.trim().split(' ').forEach(event => el.addEventListener(event, handler, useCapture)))

export const off = (el, events, handler, useCapture = false) =>
  domEach(el, el => events.trim().split(' ').forEach(event => el.removeEventListener(event, handler, useCapture)))
