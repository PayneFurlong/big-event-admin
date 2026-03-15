<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  artEditService,
  artGetDetailService,
  artPublishService
} from '@/api/article'
import { ElMessage } from 'element-plus'
import { baseURL } from '@/utils/request'
import axios from 'axios'
// 控制抽屉的显示隐藏
const visibleDrawer = ref(false)

// 默认数据
const defaultForm = {
  // 标题
  title: '',
  // 分类 id
  cate_id: '',
  // 文章内容 string
  content: '',
  // 文章封面 file 对象
  cover_img: '',
  // 状态
  state: ''
}

// 准备数据
const formModel = ref({ ...defaultForm })

// 图片上传有关逻辑
// 控制图片的显示
const imgUrl = ref('')
// 文件状态改变时的逻辑
const onSelectFile = (uploadFile) => {
  // 预览图片
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
  // 立刻将图片对象，存入 formModel.value.cover_img 将来用于提交
  formModel.value.cover_img = uploadFile.raw
}

// 提交
const emit = defineEmits(['success'])
const onPublish = async (state) => {
  // 将已发布还是草稿状态，存入 formModel
  formModel.value.state = state
  // 注意：当前接口需要的是 FormData 对象
  // 所以需要将普通对象 转换 成 FormData 对象
  const fd = new FormData()
  // 遍历对象依次填入 formData 对象中
  for (let key in formModel.value) {
    // 使用 append 方法存入键和值
    fd.append(key, formModel.value[key])
  }
  // 发请求
  if (formModel.value.id) {
    // 编辑操作
    await artEditService(fd)
    // 给予反馈
    ElMessage.success('修改成功')
    // 关闭抽屉
    visibleDrawer.value = false
    // 需要通知父组件编辑成功，重新渲染表格
    emit('success', 'edit')
  } else {
    // 添加操作
    await artPublishService(fd)
    // 给予反馈
    ElMessage.success('添加成功')
    // 关闭抽屉
    visibleDrawer.value = false
    // 需要通知父组件添加成功，重新渲染表格
    emit('success', 'add')
  }
}
// 获取富文本 dom 对象
const editorRef = ref('')
// 组件对外暴露一个方法 open，基于 open 传来的参数，区分添加还是编辑
// open({}) => 表单无需渲染，说明是添加
// open({ id, ..., ... }) => 表单需要渲染，说明是编辑
// open 调用后，可以打开抽屉
const open = async (row) => {
  // 调用该方法打开抽屉
  visibleDrawer.value = true
  // 默认的 row 中的信息不足以回显
  if (row.id) {
    // 需要基于 row.id 发送请求，获取编辑对应的详情数据，进行回显
    const res = await artGetDetailService(row.id)
    // 将获取到的数据存入 formModel 进行数据回显
    formModel.value = res.data.data
    // 图片需要单独处理回显
    imgUrl.value = baseURL + formModel.value.cover_img
    // 注意：提交给后台，需要的数据格式，是 file 对象
    // 需要将网络图片地址 => 转换成 file 对象，存储起来，将来便于提交
    const file = await imageUrlToFile(imgUrl.value, formModel.value.cover_img)
    // 将转换后的 file 对象存入 formModel 中
    formModel.value.cover_img = file
  } else {
    // 需要重置 formModel 为了避免重新再写一遍，可以将其内容拿出作为默认模板
    // 基于默认的数据重置 formModel
    // 重置表单的数据
    formModel.value = { ...defaultForm }
    // 手动重置 预览图片 的数据
    imgUrl.value = ''
    // 手动重置 富文本 的数据
    editorRef.value.setHTML('')
  }
}
// 向外暴露方法
defineExpose({
  open
})

// chatGPT prompt：封装一个函数，
// 基于 axios，网络图片地址，转 file 对象。
// 将网络图片地址转换为File对象
async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const imageData = response.data

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], {
      type: response.headers['content-type']
    })

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type })

    return file
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error)
    throw error
  }
}
</script>

<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
  >
    <!-- 发表文章表单 -->
    <el-form
      :model="formModel"
      ref="formRef"
      label-width="100px"
    >
      <el-form-item
        label="文章标题"
        prop="title"
      >
        <el-input
          v-model="formModel.title"
          placeholder="请输入标题"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="文章分类"
        prop="cate_id"
      >
        <channel-select
          v-model="formModel.cate_id"
          width="100%"
        ></channel-select>
      </el-form-item>
      <el-form-item
        label="文章封面"
        prop="cover_img"
      >
        <!-- 需要关闭 element plus 的自动上传，不需要配置 action 等参数
          只需要做前端的本地预览图片即可，无需在提交前上传
          语法：URL.createObjectURL(...地址) 创建本地预览的地址，来预览
      -->
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSelectFile"
        >
          <img
            v-if="imgUrl"
            :src="imgUrl"
            class="avatar"
          />
          <el-icon
            v-else
            class="avatar-uploader-icon"
            ><Plus
          /></el-icon>
        </el-upload>
      </el-form-item>
      <!-- 富文本编辑器 -->
      <el-form-item
        label="文章内容"
        prop="content"
      >
        <div class="editor">
          <quill-editor
            v-model:content="formModel.content"
            content-type="html"
            theme="snow"
            ref="editorRef"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          @click="onPublish('已发布')"
          type="primary"
          >发布</el-button
        >
        <el-button
          @click="onPublish('草稿')"
          type="info"
          >草稿</el-button
        >
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
