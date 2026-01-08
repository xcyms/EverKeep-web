import { message } from 'ant-design-vue'
import axios from 'axios'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
})

request.interceptors.request.use((config) => {
  // 可以在这里添加 Token
  return config
})

request.interceptors.response.use(
  response => response.data,
  (error) => {
    message.error(error.message || '网络错误')
    return Promise.reject(error)
  },
)

export default request
