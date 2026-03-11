// 导入用户状态管理（Pinia 中的 userStore）
import { useUserStore } from '@/stores/index'
// 导入 axios，用于发送 HTTP 请求
import axios from 'axios'
// 导入 vue-router 实例，用于在响应拦截中进行页面跳转
import router from '@/router'
// 导入 Element Plus 消息提示组件
import { ElMessage } from 'element-plus'

// 定义基础请求路径（接口域名）
const baseURL = 'http://big-event-vue-api-t.itheima.net'

// 创建 axios 实例，用于封装全局配置
const instance = axios.create({
  baseURL, // 请求的基础路径
  timeout: 100000 // 超时时间（单位：毫秒），超过此时间将抛出错误
})

/* -------------------- 请求拦截器 -------------------- */
instance.interceptors.request.use(
  (config) => {
    // 获取用户存储（Pinia）
    const userStore = useUserStore()

    // 如果用户已登录且存在 token，则在请求头中携带 Authorization
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    // 返回修改后的请求配置
    return config
  },
  (err) => Promise.reject(err) // 请求发送失败时直接抛出错误
)

/* -------------------- 响应拦截器 -------------------- */
instance.interceptors.response.use(
  (res) => {
    // 当接口返回 code === 0 时，表示请求成功
    if (res.data.code === 0) {
      return res
    }

    // 否则弹出错误提示信息
    ElMessage({
      message: res.data.message || '服务异常',
      type: 'error'
    })

    // 将错误信息以 Promise.reject 抛出，便于外部捕获
    return Promise.reject(res.data)
  },
  (err) => {
    // 捕获接口异常（如 4xx / 5xx）
    ElMessage({
      message: err.response?.data?.message || '服务异常',
      type: 'error'
    })

    console.log(err) // 输出错误信息方便调试

    // 如果状态码为 401（未授权 / 登录过期），跳转回登录页
    if (err.response?.status === 401) {
      router.push('/login')
    }

    // 抛出错误对象
    return Promise.reject(err)
  }
)

// 默认导出封装好的 axios 实例
export default instance
// 同时导出基础路径，以便其他模块使用
export { baseURL }
