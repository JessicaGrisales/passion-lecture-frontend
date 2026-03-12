// stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),

  actions: {
    login(userData, token) {
      this.user = userData
      this.token = token
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    loadFromLocalStorage() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')

      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)
      }
    }
  }
})
