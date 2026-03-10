import { createRouter, createWebHistory } from 'vue-router'

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
          path: '/user/avator',
          component: () => import('@/views/user/UserAvator.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})

export default router
