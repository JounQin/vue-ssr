export default {
  functional: true,
  props: {
    level: {
      type: Number,
      required: true,
      validator: level => level > 0 && level < 7,
    },
  },
  render(h, context) {
    return h(`h${context.props.level}`, null, context.children)
  },
}
