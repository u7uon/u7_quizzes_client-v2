import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomePage.vue'

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
          path: '/',
          component: Home,
          name: 'Home'
        },
        {
          path: '/login',
          name: 'Login',
          component: () => import('../views/LoginPage.vue')
        },
        {
          path: '/join',
          name: 'Join',
          component: () => import('../views/JoinPage.vue')
        },
        {
          path: '/quizzes',
          name: 'Quizzes',
          component: () => import('../views/QuizzesPage.vue')
        },
        {
          path: '/about',
          name: 'About',
          component: () => import('../views/AboutPage.vue')
        },
        {
          path: '/contact',
          name: 'Contact',
          component: () => import('../views/ContactPage.vue')
        },
        {
          path: '/privacy',
          name: 'Privacy',
          component: () => import('../views/PrivacyPage.vue')
        }


]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router