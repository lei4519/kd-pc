<template>
  <div id="app">
    <transition
      mode="out-in"
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import { Theme } from './modules/Theme'

export default {
  name: 'App',
  mounted() {
    new Theme('#409EFF', document.documentElement)
  }
}
</script>
