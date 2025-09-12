<template>
  <div class="main-layout">
    <Header />
    <main>
      <div class="content px-4">
        <slot />
      </div>
    </main>
    <Footer/>
    
    <!-- Error UI -->
    <div id="vue-error-ui" v-if="showError" data-nosnippet>
      An unhandled error has occurred.
      <a href="/" class="reload">Reload</a>
      <span class="dismiss" @click="showError = false">🗙</span>
    </div>
  </div>
</template>

<script>
import Header from '../layouts/header.vue'
import Footer from '../layouts/footer.vue'

export default {
  name: 'MainLayout',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      showError: false
    }
  }
}
</script>

