

<template>
  <div id="app">
    <Header />
    <router-view />
    <Footer />
  </div>
</template>

<script  setup>
import Header from './layouts/header.vue'
import Footer from './layouts/footer.vue'
</script>