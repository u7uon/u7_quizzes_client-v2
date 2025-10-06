import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { useSignalR } from '../src/utils/hubConnection'

// Global styles
import './assets/styles/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'

// Toast CSS - PHẢI import ở đây
import 'vue3-toastify/dist/index.css'  // <-- THÊM dòng này

import ToastPlugin from '../src/utils/toast' 

// Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

app.use(useSignalR)
app.use(ToastPlugin)  // <-- Chỉ use 1 lần duy nhất ở đây

app.use(router)

app.config.errorHandler = (error, instance, info) => {
  console.error('Vue Error:', error)
  console.error('Component:', instance)
  console.error('Info:', info)
  
  const errorUI = document.getElementById('vue-error-ui')
  if (errorUI) {
    errorUI.style.display = 'block'
  }
}

app.mount('#app')