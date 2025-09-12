import { defineStore } from 'pinia'
import AxiosClient from '../utils/axiosClient.js'  

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    isLoading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.currentUser
  },

  actions: {
    async loadUser() {
      this.isLoading = true
      try {
        const response = await AxiosClient.get('auth/me')
        this.currentUser = response.data
        this.error = null
      } catch (error) {
        this.currentUser = null
        this.error = error.message
        // Don't throw error for 401/403 - user is just not logged in
        if (error.status !== 401 && error.status !== 403) {
          console.error('Failed to load user:', error)
        }
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      try {
        await AxiosClient.post('auth/logout')
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.currentUser = null
        this.error = null
        // Redirect to login or home page
        this.$router?.push('/')
      }
    }
  }
})