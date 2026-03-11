import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'

// createRouter 创建路由实例
// 配置 history 模式
// 1. history 模式：createWebHistory  地址栏不带 #
// 2. hash 模式：createWebHashHistory 地址栏带 #
// vite 中的环境变量 import.meta.env.BASE_URL
// 就是 vite.config.js 中的 base 配置项
const router = createRouter({
  // createWebHistory() 中的参数默认是 '/'
  // 里面写什么即跳转页面的前面会加上什么
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // component:() => import('地址') 是路由的懒加载写法
    // (将 import 写到函数内,即用到才加载)
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      // 路由重定向，访问到 '/' 就重定向到指定路由
      redirect: '/article/manage',
      children: [
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})

// 登录访问拦截 => 默认是直接放行的
// 根据返回值决定，是放行还是拦截
// 返回值：
// 1. undefined / true 直接放行
// 2. false 拦回 from 的地址页面
// 3. 具体路径 或 路径对象 拦截到对应的地址
//    '/login'   { name: 'login'}
router.beforeEach((to) => {
  // 如果没有 token，且访问的是非登录页，拦截到登录，其他情况正常放行
  const userStore = useUserStore()
  if (!userStore.token && to.path !== '/login') return '/login'
  // 因为默认放行，所以可以不写 return true
})

export default router
