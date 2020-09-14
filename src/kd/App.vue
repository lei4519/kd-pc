<template>
  <div id="app">
    <transition
      mode="out-in"
      enter-active-class="animate__animated animate__fadeIn animate__faster"
      leave-active-class="animate__animated animate__fadeOut animate__faster"
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
