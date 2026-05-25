// src/stores/user.js
import { defineStore } from 'pinia'
import { login, register, getProfile, updateProfile } from '../api/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: null,
  }),
  actions: {
    async login(credentials) {
      const res = await login(credentials)
      this.token = res.data.token
      this.userInfo = res.data.user
      localStorage.setItem('token', this.token)
      return res
    },
    async register(userData) {
      const res = await register(userData)
      this.token = res.data.token
      this.userInfo = res.data.user
      localStorage.setItem('token', this.token)
      return res
    },
    async fetchProfile() {
      const res = await getProfile()
      this.userInfo = res.data
    },
    async updateProfile(data) {
      const res = await updateProfile(data)
      this.userInfo = res.data
    },
    logout() {
      this.token = ''
      this.userInfo = null
      localStorage.removeItem('token')
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
})