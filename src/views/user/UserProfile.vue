<script setup>
import { userUpdateInfoService } from '@/api/user'
import PageContainer from '@/components/PageContainer.vue'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

// 获取表单对象
const formRef = ref()
// 使用仓库中的初始数据，无需响应式
const {
  user: { username, nickname, email, id },
  getUser
} = useUserStore()
// 表单数据
const formList = ref({
  username,
  nickname,
  email,
  id
})
// 表单规则
const rules = {
  nickName: [
    { require: true, message: '请输入用户名称', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '名称必须是 2-10 个非空字符',
      trigger: 'blur'
    }
  ],
  userEmail: [
    { require: true, message: '请输入用户邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正常的邮箱格式', trigger: 'blur' }
  ]
}
const submitForm = async () => {
  // 预校验
  await formRef.value.validate()
  // 发送修改请求
  await userUpdateInfoService(formList.value)
  // 通知 userStore 重新获取最新的信息
  getUser()
  // 反馈
  ElMessage.success('修改成功')
}
</script>

<template>
  <PageContainer title="基本资料">
    <!-- 表单部分 -->
    <el-form
      :model="formList"
      :rules="rules"
      label-width="100px"
      size="large"
      ref="formRef"
    >
      <el-form-item label="登录名称">
        <el-input
          v-model="formList.username"
          style="width: 50%"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item
        label="用户名称"
        prop="nickName"
      >
        <el-input
          v-model="formList.nickname"
          style="width: 50%"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="用户邮箱"
        prop="userEmail"
      >
        <el-input
          v-model="formList.email"
          style="width: 50%"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm"
          >提交修改</el-button
        >
      </el-form-item>
    </el-form>
  </PageContainer>
</template>
