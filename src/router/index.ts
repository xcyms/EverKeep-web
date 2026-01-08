import nprogress from 'nprogress'
import { setupLayouts } from 'virtual:generated-layouts' 
import generatedRoutes from 'virtual:generated-pages'
import { createRouter, createWebHistory } from 'vue-router'
import 'nprogress/nprogress.css'

const routes = setupLayouts(generatedRoutes)

// 添加通配符重定向
routes.push({
  path: '/:pathMatch(.*)*',
  redirect: '/error/404'
})

const router = createRouter({
  history: createWebHistory(),
  routes, // 使用自动生成的路由
})

router.beforeEach(() => {
  nprogress.start()
})

router.afterEach(() => {
  nprogress.done()
})

export default router
