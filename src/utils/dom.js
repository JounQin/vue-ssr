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

/**
 * 用于处理事件可能不触发的情况，或者考虑事件兼容性问题
 *
 * @param el              触发事件的元素，可以是个单个元素、数组、类数组对象
 * @param events          触发的事件，以空格区分不同事件
 * @param handler         事件处理器，正常处理时无区别，超时处理时回调第一个参数为 false，第二个参数为触发的单个元素
 * @param timeout         事件未触发的时间限制，一般比预期事件处理多 100 毫秒以等待预期事件处理
 * @returns {ensure}      主要用于修复 animationend 及 transitionend 事件等未按预期触发的情况
 */
export const ensure = (el, events, handler, timeout = 600) => domEach(el, el => {
  let end

  const wrapper = function () {
    off(el, events, wrapper)
    end = true
    handler.apply(this, arguments)
  }

  on(el, events, wrapper)

  setTimeout(() => {
    off(el, events, wrapper)
    end || handler(false, el)
  }, timeout)
})
