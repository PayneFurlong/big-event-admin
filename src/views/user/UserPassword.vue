<script setup>
import { userUpdatePasswordService } from '@/api/user'
import PageContainer from '@/components/PageContainer.vue'
import router from '@/router'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

// 获取表单
const FormRef = ref()
// 表单数据
const formList = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})
// 新密码的自定义校验 不能与原密码一致
const checkOldSame = (rule, value, callback) => {
  // 判断 value 和当前 form 中收集的 old_pwd 是否一致
  if (value === formList.value.old_pwd) {
    callback(new Error('原密码和新密码不能一样'))
  } else {
    callback() // 就算校验成功，也需要 callback，即 else 必须写
  }
}
// 确认密码的自定义校验 要与新密码一致
const checkNewSame = (rule, value, callback) => {
  // 判断 value 和当前 form 中收集的 new_pwd 是否一致
  if (value !== formList.value.new_pwd) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback() // 就算校验成功，也需要 callback，即 else 必须写
  }
}
// 校验规则
const rules = {
  old_pwd: [
    { require: true, message: '请输入原密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/, // \S 非空字符
      message: '密码必须是 6-15 位的非空字符',
      trigger: 'blur'
    }
  ],
  new_pwd: [
    { require: true, message: '请输入原密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/, // \S 非空字符
      message: '密码必须是 6-15 位的非空字符',
      trigger: 'blur'
    },
    { validator: checkOldSame, trigger: 'blur' }
  ],
  re_pwd: [
    { require: true, message: '请输入原密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/, // \S 非空字符
      message: '密码必须是 6-15 位的非空字符',
      trigger: 'blur'
    },
    { validator: checkNewSame, trigger: 'blur' }
  ]
}

// 获取 userStore
const userStore = useUserStore()
// 修改密码按钮逻辑
const submitForm = async () => {
  // 预校验
  await FormRef.value.validator()
  // 发送请求
  await userUpdatePasswordService(formList.value)
  // 反馈
  ElMessage.success('修改成功')
  // 密码修改成功后要重新登录
  userStore.removeToken()
  // 清除本地个人信息
  userStore.setUser({})
  // 拦截到登录页
  router.push('/login')
}
// 重置表单逻辑
const resetForm = () => {
  // 重置表单
  FormRef.value.resetFields()
}
</script>

<template>
  <PageContainer title="重置密码">
    <el-row>
      <el-col :span="12">
        <el-form
          :model="formList"
          :rules="rules"
          label-width="100px"
          size="large"
          ref="FormRef"
        >
          <el-form-item
            label="原密码"
            prop="old_pwd"
          >
            <el-input
              v-model="formList.old_pwd"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="新密码"
            prop="new_pwd"
          >
            <el-input
              v-model="formList.new_pwd"
              type="password"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="确认新密码"
            prop="re_pwd"
          >
            <el-input
              v-model="formList.re_pwd"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm"
              >修改密码</el-button
            >
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </PageContainer>
</template>
