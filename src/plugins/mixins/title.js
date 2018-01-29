function getTitle(vm) {
  let { title } = vm.$options
  title = title && typeof title === 'function' ? title.call(vm) : title
  return title && `vue-ssr | ${title}`
}

const serverTitleMixin = {
  created() {
    const title = getTitle(this)
    if (title) {
      this.$ssrContext.title = title
    }
  },
}

function changeTitle() {
  const title = getTitle(this)
  if (title) {
    document.title = title
  }
}

const clientTitleMixin = {
  activated: changeTitle,
  mounted: changeTitle,
}

export default (__SERVER__ ? serverTitleMixin : clientTitleMixin)
