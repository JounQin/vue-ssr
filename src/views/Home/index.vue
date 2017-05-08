<template lang="pug">
  div(:class="$style.content")
    each val in [1,2]
      div(:class="[$style.pic, $style.pic" + val + "]")
    div(:class="$style.slogan")
      div(:class="$style.sloganHeader")
        input(title="请输入标题", value="遇见瑜伽", readonly)
        div(:class="$style.line")
      .center-block(:class="$style['slogan-body']")
        textarea(title="请输入内容", readonly) 当心得到控制，平静下来时，剩下的便是灵魂
    div(:class="$style.memberMenu")
      each val, index in [{pull:'left',link:'/subscribe-index',icon:'icon-book',menu:'预订课程'}, {pull:'right',link:'/test',icon:'icon-person',menu:'个人中心'}]
        div(:class="$style.outsideCircle", class="pull-" + val.pull + " animated", ref="circle" + index)
          router-link(:class="$style.insideCircle", to=val.link, tag="div")
            span(:class="$style.menuIcon", class="iconfont " + val.icon)
            span(:class="$style.menuText") #{val.menu}
          div(:class="$style.insideCircleReplace")
</template>
<script>
  import {ensure, removeClass} from 'utils'

  export default {
    name: 'home',
    mounted() {
      ensure(Object.values(this.$refs), 'animationend', (e, el) => {
        removeClass(e ? e.target : el, 'animated')
      }, 1600)
    }
  }
</script>
<style lang="stylus" module>
  $btn-color = #dfd28a

  .content
    relative()
    margin-left auto
    margin-right auto
    max-width 768px
    height 100%
    overflow hidden

  .pic
    absolute(top left)
    size 100%
    overflow hidden
    background-size cover
    background-position center center
    background-repeat no-repeat

  .pic1
    image("../Home/home-01.jpg")
    animation pic1 6s linear infinite

  .pic2
    image("../Home/home-02.jpg")
    animation pic2 6s linear infinite

  .slogan
    absolute()
    left 50%
    top 30%
    transform translate3d(-50%, 0, 0)
    text-align center
    z-index 3

  .slogan-header
    display inline-block
    overflow hidden

    input
      font-size $top-size
      transform translate3d(0, 100%, 0)
      animation sloganTitle .6s forwards 2.6s
      max-height (20 / 14) * $top-size
      width 288px
      border 0
      background none
      text-align center
      padding 0
      resize none
      outline 0
      overflow hidden
      font-kai()

  .line
    border-bottom 1px solid $stress-color
    transform translate3d(-100%, 0, 0)
    animation line 1s forwards 1.5s
    margin-left auto
    margin-right auto

  .slogan-body
    width 160px * (14 / 12)
    overflow hidden
    transform translate3d(-100%, 0, 0)
    animation sloganBody 1s forwards 3.3s
    font-song()

    textarea
      padding 0
      width 100%
      text-align center
      background none
      resize none
      border 0
      outline 0
      scaleSize($smaller-size, , translate3d(100%, 0, 0))
      animation sloganText 1s forwards 3.3s

  .member-menu
    absolute()
    bottom 30%
    z-index 3
    left 50%
    transform translate3d(-50%, 0, 0)
    width 250px

  .outside-circle
    relative()
    size 105px
    border 2px solid $btn-color
    border-radius 101px
    backface-visibility visible

    &:global(.animated)
      opacity 0
      transform scale(0)
      animation showCircle 1s .5s

  .inside-circle
    size 90px
    middleCenter()
    color $reverse-color
    border-radius 90px
    background-color $btn-color
    text-align center
    padding 8px 0

  .menu-icon
    font-size 30px
    display block
    margin-top 3px
    margin-bottom -2px

  .menu-text
    font-size 15px

  @keyframes pic1
    from
      transform scale(1.2)
      opacity 1
      z-index 2

    40%
      transform scale(1.04)
      opacity 1
      z-index 2

    50%
      transform scale(1)
      opacity 0
      z-index 1

    90%
      transform scale(1.25)
      opacity 0
      z-index 1

    to
      transform scale(1.2)
      opacity 1
      z-index 2

  @keyframes pic2
    from
      transform scale(1)
      opacity 0
      z-index 1

    40%
      transform scale(1.25)
      opacity 0
      z-index 1

    50%
      transform scale(1.2)
      opacity 1
      z-index 2

    90%
      transform scale(1.04)
      opacity 1
      z-index 2

    to
      transform scale(1)
      opacity 0
      z-index 1

  @keyframes sloganTitle
    from
      transform translate3d(0, 100%, 0)

    to
      transform translate3d(0, 0, 0)

  @keyframes sloganBody
    from
      transform translate3d(-100%, 0, 0)

    to
      transform translate3d(0, 0, 0)

  @keyframes sloganText
    from
      scaleSize($smaller-size, , translate3d(100%, 0, 0))

    to
      scaleSize($smaller-size, , translate3d(0, 0, 0))

  @keyframes line
    from
      transform translate3d(-100%, 0, 0)

    to
      transform translate3d(0, 0, 0)

  @keyframes showCircle
    from
      transform scale(0)
      opacity 0

    to
      transform scale(1)
      opacity 1
</style>
