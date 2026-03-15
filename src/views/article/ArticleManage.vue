<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import ChannelSelect from './components/ChannelSelect.vue'
import { artDeleteService, artGetListService } from '@/api/article'
import { formatTime } from '@/utils/format'
import ArticleEdit from './components/ArticleEdit.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// 文章列表容器
const articleList = ref([])
// 总条数容器
const total = ref()
// loading 状态
const loading = ref(false)

// 定义请求参数对象
const params = ref({
  // 当前页
  pagenum: 1,
  // 当前生效的每页条数
  pagesize: 5,
  // 文章分类 id
  cate_id: '',
  // 文章状态 (已发布 / 草稿)
  state: ''
})

// 基于 params 参数获取文章列表
const getArticleList = async () => {
  // 请求之前添加 loading 效果
  loading.value = true
  // 请求获取数据
  const res = await artGetListService(params.value)
  // 存入列表容器中
  // 请求页码数据
  articleList.value = res.data.data
  // 请求条数总数
  total.value = res.data.total
  // 请求之后移除 loading 效果
  loading.value = false
}
getArticleList()

// 处理分页逻辑
// 每页条数改变时
const onSizeChange = (size) => {
  // 只要是每页条数变化了，那么原本正在访问的当前页意义不大了
  // 数据大概率不再当前页，所以需要重新从第一页开始渲染
  params.value.pagenum = 1
  params.value.pagesize = size
  // 基于最新的 pagenum 和 pagesize 重新渲染
  getArticleList()
}
// 页码改变时
const onCurrentChange = (page) => {
  // 更新当前页
  params.value.pagenum = page
  // 基于最新的 pagenum 重新渲染
  getArticleList()
}

// 搜索按钮逻辑 => 按照最新的条件，重新检索，从第一页开始
const onSearch = () => {
  // 重置页码
  params.value.pagenum = 1
  // 进行 id 筛选
  getArticleList()
}

// 重置按钮逻辑 => 将筛选条件清空，重新检索，从第一页开始
const onReset = () => {
  // 重置页码
  params.value.pagenum = 1
  // 清空筛选逻辑
  params.value.cate_id = ''
  params.value.state = ''
  // 重新检索
  getArticleList()
}

// 绑定抽屉组件
const articleEditRef = ref()

// 添加逻辑
const onAddArticle = () => {
  // 传过去空对象表添加
  articleEditRef.value.open({})
}

// 编辑逻辑
const onEditArticle = (row) => {
  // 传过去 row 表编辑
  articleEditRef.value.open(row)
}

// 删除逻辑
const onDeleteArticle = async (row) => {
  // 删除确认
  await ElMessageBox.confirm('你确认要删除该文章信息吗', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  // 删除操作
  await artDeleteService(row.id)
  // 反馈
  ElMessage.success('删除成功')
  // 重新渲染列表
  getArticleList()
}

// 添加或编辑成功的回调
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加，最好渲染最后一页
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    // 更新成最大的页码数，再渲染
    params.value.pagenum = lastPage
  }
  // 无论添加还是编辑，都需要进行渲染
  getArticleList()
}
</script>

<template>
  <PageContainer title="文章管理">
    <template #extra>
      <el-button
        type="primary"
        @click="onAddArticle"
        >发布文章</el-button
      >
    </template>

    <!-- 表单区域 -->
    <!-- 通过给 el-form 添加 inline 属性使其在一行显示 -->
    <el-form inline>
      <el-form-item
        label="文章分类："
        style="width: 300px"
      >
        <!-- Vue2 => v-model :value 和 @input 的简写 -->
        <!-- Vue3 => v-model :modelValue 和 @update:modelValue 的简写 -->
        <!-- v-model 的全写为 v-model:modelValue -->
        <!-- 即如果 v-model:cid="变量"，那么 v-model 就是 :cid 和 @update:cid 的简写 -->
        <!-- <ChannelSelect v-model:cid="params.cate_id"></ChannelSelect> -->
        <ChannelSelect v-model="params.cate_id"></ChannelSelect>
      </el-form-item>
      <el-form-item
        label="发布状态："
        style="width: 300px"
      >
        <!-- 这里后台标记发布状态，就是通过中文标记的，已发布/草稿
            所以 label 和 value 写一样的值即可 -->
        <el-select v-model="params.state">
          <el-option
            label="已发布"
            value="已发布"
          ></el-option>
          <el-option
            label="草稿"
            value="草稿"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          @click="onSearch"
          type="primary"
          >搜索</el-button
        >
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table
      v-loading="loading"
      :data="articleList"
    >
      <!-- 获取数据一个是通过 prop 来进行绑定 -->
      <el-table-column
        label="文章标题"
        prop="title"
      >
        <!-- 获取数据另一个是通过作用域插槽获取 row 再利用里面的数据 -->
        <template #default="{ row }">
          <el-link
            type="primary"
            underline="false"
            >{{ row.title }}</el-link
          >
        </template>
      </el-table-column>
      <el-table-column
        label="分类"
        prop="cate_name"
      ></el-table-column>
      <el-table-column
        label="发表时间"
        prop="pub_date"
      >
        <!-- 如果配置了默认插槽则显示的数据以默认插槽优先 -->
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        prop="state"
      ></el-table-column>
      <!-- 利用作用域插槽 row 可以获取当前行的数据 => v-for 中的 item -->
      <!-- 可以将 row 理解为遍历数据列表中的每一项 -->
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            circle
            plain
            type="primary"
            :icon="Edit"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            circle
            plain
            type="danger"
            :icon="Delete"
            @click="onDeleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :background="true"
      layout="jumper, total, sizes, prev, pager, next"
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- 添加编辑的抽屉 -->
    <ArticleEdit
      ref="articleEditRef"
      @success="onSuccess"
    ></ArticleEdit>
  </PageContainer>
</template>
