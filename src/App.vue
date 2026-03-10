<script setup>
// 在 Vue3 CompositionAPI 中
// 1. 获取路由对象 router useRouter
//    const router = useRouter()
// 2. 获取路由参数 route useRoute
//    const route = useRoute()
import { useRoute, useRouter } from 'vue-router'
import { useUserStore, useCountStore } from './stores'
const route = useRoute()
const router = useRouter()
const getList = () => {
  router.push('/list')
  console.log(route, router)
}

const UserStore = useUserStore()
const countStroe = useCountStore()
</script>

<template>
  <RouterView></RouterView>

  <br />
  <hr />
  <hr />
  <hr />
  <!-- ElementPlus 例子 -->
  <Base-Test></Base-Test>
  <div class="box">我是Box</div>
  <!-- 路由跳转测试 -->
  <el-button @click="$router.push('/home')">home</el-button>
  <el-button @click="getList">list</el-button>
  <!-- 按钮样式 -->
  <el-button type="primary">primary</el-button>
  <el-button type="success">success</el-button>

  <!-- 仓库 -->
  <p>{{ UserStore.token }}</p>
  <el-button @click="UserStore.setToken('awasdkuhaskf')">登录</el-button>
  <el-button @click="UserStore.removeToken">退出</el-button>
  <br /><br />
  <p>{{ countStroe.count }}</p>
  <button @click="countStroe.addCount(2)">加2</button>
</template>

<style scoped></style>
