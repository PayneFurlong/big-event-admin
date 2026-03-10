// 引入 pinia
import { createPinia } from 'pinia'
// 引入持久化插件
import persist from 'pinia-plugin-persistedstate'
// 创建 pinia 实例
const pinia = createPinia()
// 将持久化插件挂载到 pinia 上
pinia.use(persist)
// 导出 pinia
export default pinia

// import { useUserStore } from './modules/user'
// export { useUserStore }
// import { useCountStore } from './modules/counter'
// export { useCountStore }

// 相当于导入后导出 一行相当于上面两行代码
export * from './modules/user'
export * from './modules/counter'
