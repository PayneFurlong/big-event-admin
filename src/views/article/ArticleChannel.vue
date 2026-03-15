<script setup>
import { artDelChannelService, artGetChannelsService } from '@/api/article'
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import ChannelEdit from './components/ChannelEdit.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// import ' @element-plus/es/components/buton/style/css'
// 列表数据
const channelList = ref([])
// 加载切换
const loading = ref(false)
// 用于绑定组件
const dialog = ref()
// 获取数据 进页面时进行渲染
const getChannelList = async () => {
  // 发请求前开启 loading
  loading.value = true
  // 获取分类列表
  const res = await artGetChannelsService()
  // 将获取到的值存入列表容器
  channelList.value = res.data.data
  // 接收到数据后结束 loading
  loading.value = false
}
getChannelList()
// 添加按钮
const onAddChannel = () => {
  dialog.value.open({})
}
// 编辑按钮
const onEditChannel = (row) => {
  dialog.value.open(row)
}
// 删除按钮
const onDelChannel = async (row) => {
  // 添加确认框
  await ElMessageBox.confirm('你确认要删除该分类吗', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  // 调用接口提交 id 进行删除数据
  await artDelChannelService(row.id)
  // 添加反馈
  ElMessage('删除成功')
  // 重新渲染
  getChannelList()
}
// 重新渲染子组件
const onSuccess = () => {
  // 重新渲染
  getChannelList()
}
</script>

<template>
  <PageContainer title="文章分类">
    <template #extra>
      <el-button
        type="primary"
        @click="onAddChannel"
        >添加分类</el-button
      >
    </template>
    <el-table
      v-loading="loading"
      :data="channelList"
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="序号"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="cate_name"
        label="分类名称"
      ></el-table-column>
      <el-table-column
        prop="cate_alias"
        label="分类别名"
      ></el-table-column>
      <el-table-column
        lable="操作"
        width="150"
      >
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

    <ChannelEdit
      ref="dialog"
      @success="onSuccess"
    ></ChannelEdit>
  </PageContainer>
</template>
