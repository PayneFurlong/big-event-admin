import { userGetInfoService } from '@/api/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户模块 token setToken removeToken
export const useUserStore = defineStore(
  'largeUser',
  () => {
    // token
    const token = ref('')
    // 获取 token
    const setToken = (newToken) => {
      token.value = newToken
    }
    // 删除 token
    const removeToken = () => {
      token.value = ''
    }

    // 用户数据
    const user = ref({})
    // 获取用户数据
    const getUser = async () => {
      const res = await userGetInfoService() // 请求数据拦截
      //  存储数据至 Pinia
      user.value = res.data.data
    }
    // 提交用户数据
    const setUser = (obj) => {
      user.value = obj
    }

    return {
      token,
      setToken,
      removeToken,
      user,
      getUser,
      setUser
    }
  },
  {
    persist: true
  }
)
