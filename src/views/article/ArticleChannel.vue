<script setup>
import { artGetChannelsService } from '@/api/article'
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
// 列表数据
const channelList = ref([])
// 加载切换
const loading = ref(false)
// 获取数据 进页面时
const getChannelList = async () => {
  // 发请求前开启 loading
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  // 接收到数据后结束 loading
  loading.value = false
}
getChannelList()
// 编辑按钮
const onEditChannel = (row, $index) => {
  console.log(row, $index)
}
// 删除按钮
const onDelChannel = (row, $index) => {
  console.log(row, $index)
}
</script>

<template>
  <PageContainer title="文章分类">
    <template #extra>
      <el-button type="primary">添加分类</el-button>
    </template>
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="cate_name" label="分类名称"></el-table-column>
      <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
      <el-table-column lable="操作" width="150">
        <!-- row 就是 channelList 的一项，$index 下标 
             row (相当于 v-for 中的 item) -->
        <template #default="{ row, $index }">
          <el-button
            circle
            plain
            type="primary"
            :icon="Edit"
            @click="onEditChannel(row, $index)"
          >
          </el-button>
          <el-button
            circle
            plain
            type="danger"
            :icon="Delete"
            @click="onDelChannel(row, $index)"
          >
          </el-button>
        </template>
      </el-table-column>

      <!-- 添加没有数据时的页面 -->
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
  </PageContainer>
</template>
