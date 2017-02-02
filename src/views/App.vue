<template>
  <div id="app">
    <hi-loading v-if="progress"/>
    <hi-progress :progress="progress"/>
    <transition :name="transition">
      <keep-alive>
        <router-view v-if="keepAlive"/>
      </keep-alive>
    </transition>
    <transition :name="transition">
      <router-view v-if="!keepAlive"/>
    </transition>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'

  import HiLoading from 'HiLoading'
  import HiProgress from 'HiProgress'

  export default {
    name: 'app',
    data: () => ({transition: 'slide-fade'}),
    computed: {
      ...mapGetters(['progress']),
      keepAlive() {
        const {$route} = this
        const keepAlive = $route.meta.keepAlive
        return keepAlive == null ? !Object.keys({...$route.params, ...$route.query}).length : keepAlive
      }
    },
    components: {
      HiLoading,
      HiProgress
    }
  }
</script>
