import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { useSignalR } from '../src/utils/hubConnection'
import Cookies from 'js-cookie'
// Global styles
import './assets/styles/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'

// Bootstrap JS for components like navbar toggle
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)

// Setup Pinia for state management
const pinia = createPinia()
app.use(pinia)


app.use(useSignalR)

// Setup Vue Router
app.use(router)

// Global error handler
app.config.errorHandler = (error, instance, info) => {
  console.error('Vue Error:', error)
  console.error('Component:', instance)
  console.error('Info:', info)
  
  // Show error UI
  const errorUI = document.getElementById('vue-error-ui')
  if (errorUI) {
    errorUI.style.display = 'block'
  }
}

// Mount the app
app.mount('#app')