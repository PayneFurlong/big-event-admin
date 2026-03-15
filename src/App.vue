<script setup>
import zhCn from 'element-plus/es/locale/lang/zh-cn'
</script>

<template>
  <div>
    <!-- 组件全局切换为中文 -->
    <el-config-provider :locale="zhCn">
      <!-- 路由出口 RouterView -->
      <RouterView></RouterView>
    </el-config-provider>
  </div>
</template>

<style scoped></style>
