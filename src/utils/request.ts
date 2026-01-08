import { message } from 'ant-design-vue'
import axios from 'axios'

import router from '../router'
import { useUserStore } from '../store/user'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
})

request.interceptors.request.use((config) => {
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`
  }
  return config
})

request.interceptors.response.use(
  response => response.data,
  (error) => {
    const userStore = useUserStore()
    
    if (error.response?.status === 401) {
      userStore.logout()
      router.push('/login')
      message.error('登录已过期，请重新登录')
    } else {
      message.error(error.response?.data?.message || error.message || '网络错误')
    }
    
    return Promise.reject(error)
  },
)

export default request
