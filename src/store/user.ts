import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const name = ref(localStorage.getItem('username') || 'Guest')
  const token = ref(localStorage.getItem('token') || '')

  const isLoggedIn = computed(() => !!token.value)

  function login(username: string, userToken: string) {
    name.value = username
    token.value = userToken
    localStorage.setItem('username', username)
    localStorage.setItem('token', userToken)
  }

  function logout() {
    name.value = 'Guest'
    token.value = ''
    localStorage.removeItem('username')
    localStorage.removeItem('token')
  }

  return { name, token, isLoggedIn, login, logout }
})