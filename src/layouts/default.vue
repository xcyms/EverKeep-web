<script setup lang="ts">
import { useUserStore } from '../store/user'

interface MenuItem {
  key?: string
  label: string
  icon?: string
  type?: 'group'
  children?: MenuItem[]
}

const showFooter = ref(true)
const collapsed = ref(false)
const headerBg = ref('#ffffff')

const menuItems: MenuItem[] = [
  {
    label: '首页',
    type: 'group',
    children: [
      { key: '/', label: '工作台', icon: 'i-ant-design:dashboard-outlined' },
    ],
  },
  {
    label: '我的应用',
    type: 'group',
    children: [
      { key: '/upload', label: '上传图片', icon: 'i-ant-design:upload-outlined' },
      { key: '/images', label: '我的图片', icon: 'i-ant-design:picture-outlined' },
    ],
  },
  {
    label: '系统配置',
    type: 'group',
    children: [
      { key: '/settings', label: '设置', icon: 'i-ant-design:setting-outlined' },
    ],
  },
]

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 菜单状态
const selectedKeys = ref<string[]>([route.path])
const openKeys = ref<string[]>([])

// 动态面包屑：尝试从菜单项中匹配标签
const breadcrumbs = computed(() => {
  const result: { path: string, label: string }[] = [{ path: '/', label: '首页' }]
  
  if (route.path === '/') return result

  // 递归查找菜单项
  const findLabel = (path: string, items: MenuItem[]): string | null => {
    for (const item of items) {
      if (item.key === path) return item.label
      if (item.children) {
        const found = findLabel(path, item.children)
        if (found) return found
      }
    }
    return null
  }

  const label = findLabel(route.path, menuItems)
  if (label) {
    result.push({ path: route.path, label })
  } else {
    // 如果菜单里没找到，尝试从路由元信息或路径名转换
    const lastMatched = route.matched[route.matched.length - 1]
    const fallbackLabel = (lastMatched?.meta?.label || lastMatched?.name || route.path.split('/').pop() || '未知') as string
    result.push({ path: route.path, label: fallbackLabel })
  }

  return result
})

// 同步路由到菜单
watch(() => route.path, (path) => {
  selectedKeys.value = [path]
}, { immediate: true })

const handleMenuClick = (e: any) => {
  const key = String(e.key)
  if (key && key.startsWith('/') && !key.startsWith('sub-')) {
    router.push(key)
  }
}

const handleUserMenuClick = ({ key }: { key: string }) => {
  if (key === 'logout') {
    handleLogout()
  }
}

const handleLogout = () => {
  userStore.logout()
  router.replace('/login')
}
</script>

<template>
  <a-layout class="h-screen overflow-hidden">
    <!-- 左侧菜单：由 Layout 自动管理宽度 -->
    <a-layout-sider 
      v-model:collapsed="collapsed" 
      collapsible 
      :trigger="null"
      width="200"
      theme="light"
      class="shadow-sm transition-all duration-300 bg-white"
    >
      <div 
        class="h-12 m-3 rounded flex items-center justify-center overflow-hidden transition-colors">
        <div class="i-ant-design:appstore-twotone text-xl" :class="collapsed ? '' : 'mr-2'" />
        <span v-if="!collapsed" class="font-bold truncate text-sm">EverKeep</span>
      </div>
      
      <a-menu 
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
        theme="light" 
        mode="inline" 
        @click="handleMenuClick"
        class="border-none"
      >
        <template v-for="item in menuItems" :key="item.label">
          <!-- 分组渲染 -->
          <a-menu-item-group v-if="item.type === 'group'" :title="item.label">
            <template v-for="subItem in item.children" :key="subItem.key || subItem.label">
              <!-- 子菜单 -->
              <a-sub-menu v-if="subItem.children" :key="`sub-${subItem.key || subItem.label}`" :title="subItem.label">
                <template #icon><div v-if="subItem.icon" :class="subItem.icon" /></template>
                <a-menu-item v-for="child in subItem.children" :key="child.key!">
                  {{ child.label }}
                </a-menu-item>
              </a-sub-menu>
              <!-- 普通菜单项 -->
              <a-menu-item v-else :key="subItem.key!">
                <template #icon><div v-if="subItem.icon" :class="subItem.icon" /></template>
                {{ subItem.label }}
              </a-menu-item>
            </template>
          </a-menu-item-group>
        </template>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <!-- 顶部功能栏 -->
      <a-layout-header 
        class="h-12 px-4 flex items-center justify-between shadow-sm border-b border-gray-100 transition-all duration-300"
        :style="{ background: headerBg, color: headerBg === '#ffffff' ? 'inherit' : '#fff' }"
      >
        <div class="flex items-center gap-1">
          <div 
            class="w-9 h-9 flex items-center justify-center cursor-pointer hover:bg-black/5 rounded-md transition-colors text-lg" 
            @click="collapsed = !collapsed"
          >
            <div :class="collapsed ? 'i-ant-design:menu-unfold-outlined' : 'i-ant-design:menu-fold-outlined'" />
          </div>
          <a-breadcrumb class="text-xs flex items-center">
            <a-breadcrumb-item v-for="bc in breadcrumbs" :key="bc.path">
              <span class="opacity-80">{{ bc.label }}</span>
            </a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="i-ant-design:search-outlined text-base cursor-pointer hover:text-blue-500" />
          <a-badge :count="5" :offset="[2, 0]" size="small">
            <div class="i-ant-design:bell-outlined text-base cursor-pointer" />
          </a-badge>
          <a-dropdown placement="bottomRight">
            <div class="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-50 rounded">
              <a-avatar :size="24" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
              <span class="text-xs font-medium">Lewis</span>
            </div>
            <template #overlay>
              <a-menu class="w-32" @click="({ key }) => handleUserMenuClick({ key: String(key) })">
                <a-menu-item key="profile"><div class="flex items-center gap-2 text-xs"><div class="i-ant-design:user-outlined" /> 个人中心</div></a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" danger><div class="flex items-center gap-2 text-xs"><div class="i-ant-design:poweroff-outlined" /> 退出</div></a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <!-- 内容区 -->
      <a-layout-content class="p-3 bg-[#f0f2f5] overflow-auto">
        <div class="bg-white p-4 rounded min-h-full shadow-sm">
          <router-view v-slot="{ Component }">
            <transition name="fade-slide" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </a-layout-content>

      <!-- 底部栏：高度减小 -->
      <a-layout-footer v-if="showFooter" class="p-2 text-center text-gray-400 text-xs bg-white border-t border-gray-100">
        EverKeep ©2026 Created by Lewis
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

:deep(.ant-menu-item-group-title) {
  font-size: 11px;
  padding-left: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(0, 0, 0, 0.35);
}
</style>
