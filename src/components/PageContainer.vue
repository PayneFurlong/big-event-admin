<script setup>
defineProps({
  title: {
    require: true,
    type: String
  }
})
</script>

<template>
  <el-card class="pageContainer">
    <template #header>
      <div class="header">
        <span>{{ title }}</span>
        <div class="extra">
          <slot name="extra"></slot>
        </div>
      </div>
    </template>
    <slot></slot>
  </el-card>
</template>

<style lang="scss" scoped>
.pageContainer {
  min-height: 100%;
  box-sizing: border-box;
}

.pageContainer .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
