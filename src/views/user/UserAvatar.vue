<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { Upload } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { userUpdateAvatarService } from '@/api/user'
import { ElMessage } from 'element-plus'

// 获取仓库
const userStore = useUserStore()
// 获取上传框对象
// 基于 store 初始化 imgUrl 的初始值
const imgUrl = ref(userStore.user.user_pic)

// 获取上传头像的 dom
const uploadRef = ref()

// 改变选择文件触发的事件
const onSelectFile = (uploadFile) => {
  // // 将预览图片展示选择的图片
  // imgUrl.value = URL.createObjectURL(uploadFile.raw)
  // 基于 FileReader 读取图片做预览
  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    imgUrl.value = reader.result
  }
}

// 上传头像
const onUpdateAvatar = async () => {
  // 发动请求更新头像
  await userUpdateAvatarService(imgUrl.value)
  // userStore 重新渲染
  await userStore.getUser()
  // 反馈
  ElMessage.success('上传成功')
}
</script>

<template>
  <PageContainer title="更换头像">
    <el-upload
      :auto-upload="false"
      class="avatar-uploader"
      :show-file-list="false"
      ref="uploadRef"
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
    <br />
    <el-button
      type="primary"
      :icon="Plus"
      size="large"
      @click="uploadRef.$el.querySelector('input').click()"
      >选择图片</el-button
    >
    <el-button
      type="success"
      :icon="Upload"
      size="large"
      @click="onUpdateAvatar"
      >上传头像</el-button
    >
  </PageContainer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
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
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>
