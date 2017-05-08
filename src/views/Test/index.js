import Heading from './Heading'

export default {
  render() {
    const level = ~~(Math.random() * 6) + 1
    return <Heading level={level}>这是 {level} 级标题<br/><router-link to="/">Go Home</router-link></Heading>
  }
}
