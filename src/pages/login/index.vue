<script setup lang="ts">
import { message } from 'ant-design-vue'
import { useUserStore } from '../../store/user'

const router = useRouter()
const userStore = useUserStore()

const formState = reactive({
  username: '',
  password: '',
  remember: true,
})

const loading = ref(false)

const handleLogin = async () => {
  if (!formState.username || !formState.password) {
    return message.warning('请输入用户名和密码')
  }

  loading.value = true
  try {
    // 模拟登录请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟成功，实际开发中请调用 API
    userStore.login(formState.username, 'mock-token-123456')
    message.success('登录成功')
    
    // 跳转到首页
    router.push('/')
  } catch (error) {
    message.error('登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
      <div class="text-center mb-8">
        <div class="i-ant-design:appstore-twotone text-5xl mb-2 inline-block" />
        <h1 class="text-2xl font-bold text-gray-800">欢迎回来</h1>
        <p class="text-gray-500 text-sm">请登录您的 EverKeep 账号</p>
      </div>

      <a-form layout="vertical" :model="formState" @finish="handleLogin">
        <a-form-item label="用户名" name="username">
          <a-input v-model:value="formState.username" placeholder="请输入用户名">
            <template #prefix><div class="i-ant-design:user-outlined text-gray-400" /></template>
          </a-input>
        </a-form-item>

        <a-form-item label="密码" name="password">
          <a-input-password v-model:value="formState.password" placeholder="请输入密码">
            <template #prefix><div class="i-ant-design:lock-outlined text-gray-400" /></template>
          </a-input-password>
        </a-form-item>

        <div class="flex items-center justify-between mb-6">
          <a-checkbox v-model:checked="formState.remember">记住我</a-checkbox>
          <a class="text-blue-500 text-sm hover:underline">忘记密码？</a>
        </div>

        <a-button 
          type="primary" 
          html-type="submit" 
          block 
          size="large" 
          :loading="loading"
          class="h-11 rounded-lg"
        >
          登 录
        </a-button>
      </a-form>
      
      <div class="mt-8 text-center text-sm text-gray-500">
        还没有账号？ <a class="text-blue-500 font-medium hover:underline">立即注册</a>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: false
</route>