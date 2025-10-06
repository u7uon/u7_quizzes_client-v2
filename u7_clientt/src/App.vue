

<template>
  <div id="app">
    <Header v-if="!shouldHideLayout" />
    <router-view />
    <Footer v-if="!shouldHideLayout" />
  </div >
</template>

<script  setup>
import { computed } from 'vue'
import Header from './layouts/header.vue'
import Footer from './layouts/footer.vue'
import { useRoute } from "vue-router"

const nonLayoutPaths = ["/login", "/challenge/multiplayer","/challenge/singleplayer","/register","/lobby"]

const route = useRoute()

const shouldHideLayout = computed(() => {
  return (
    nonLayoutPaths.includes(route.path) ||
    nonLayoutPaths.some( (path) => route.path.includes(path) ) 
  )
})


</script>