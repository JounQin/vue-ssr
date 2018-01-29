import Heading from './Heading'

export default {
  data() {
    return {
      level: this.randomLevel(),
    }
  },
  activated() {
    this.level = this.randomLevel()
  },
  methods: {
    randomLevel() {
      return ~~(Math.random() * 6) + 1
    },
  },
  render() {
    const { level } = this
    return (
      <div>
        <router-link to="/">Go Home</router-link>
        <Heading level={level}>这是 {level} 级标题</Heading>
      </div>
    )
  },
}
