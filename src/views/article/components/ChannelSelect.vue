<script setup>
import { artGetChannelsService } from '@/api/article'
import { ref } from 'vue'

// 获取传入的值
defineProps({
  modelValue: {
    type: [Number, String]
  },
  width: {
    type: String
  }
})
// 父组件可触发的事件
const emit = defineEmits(['update:modelValue'])

// 分类列表容器
const channelList = ref([])

// 获取分类列表
const getChannelList = async () => {
  // 发送请求
  const res = await artGetChannelsService()
  // 将获取到的值存入列表容器中
  channelList.value = res.data.data
}
getChannelList()
</script>

<template>
  <!-- label 是展示给用户看的，value 是提交给后台的 -->
  <el-select
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    :style="{ width }"
  >
    <el-option
      v-for="item in channelList"
      :key="item.id"
      :label="item.cate_name"
      :value="item.id"
    ></el-option>
  </el-select>
</template>
