<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { userLoginService, userRegisterService } from '@/api/user'
import { ElMessage } from 'element-plus'
import { watch } from 'vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

// 控制注册与登录页面切换
const isRegister = ref(true)

// 整个的用于提交的 form 数据对象
const formModel = ref({
  username: '',
  password: '',
  repassword: ''
})
// 整个表单的校验规则通过 rules 进行提供
// 不需要响应式所以直接提供对象
const rules = {
  // 规则是一个数组 可以配置很多条规则 内部是对象
  // 1. 非空校验 required: true
  //    消息提示 message: '内容'
  //    触发校验的时机(事件) trigger: 'change' (实时校验) 'blur' (失焦触发)
  // 2. 长度校验 min:xx, max:xx
  // 3. 正则校验 pattern: 正则规则
  // 4. 自定义校验 => 自己写逻辑校验 (校验函数)
  //    validator: (rule, value, callback)
  //    rule 当前校验规则相关的信息
  //    value 所校验的表单元素目前的表单值
  //    callback 无论成功还是失败，都需要 callback 回调
  //       => callback() 校验成功
  //       => callback(new Error(错误信息)) 校验失败
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 10, message: '用户名必须是 5-10 位的字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/, // \S 非空字符
      message: '密码必须是 6-15 位的非空字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/, // \S 非空字符
      message: '密码必须是 6-15 位的非空字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        // 判断 value 和当前 form 中收集的 password 是否一致
        if (value !== formModel.value.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback() // 就算校验成功，也需要 callback，即 else 必须写
        }
      },
      // 如果不写触发时机，则默认是实施校验的
      trigger: 'blur'
    }
  ]
}

// 获取 form 表单 dom
const form = ref()
// 注册请求
const register = async () => {
  // 注册成功之前，先进行校验
  // 校验成功 → 请求，校验失败 → 自动提示
  await form.value.validate()
  // 发送注册请求
  await userRegisterService(formModel.value)
  // 注册成功的提示框
  ElMessage.success('注册成功')
  // 切换为登录页
  isRegister.value = false
}
// 获取 user 仓库
const userStore = useUserStore()
// 获取 router
const router = useRouter()

// 登录请求
const login = async () => {
  // 预校验
  await form.value.validate()
  // 发送登录请求
  const res = await userLoginService(formModel.value)
  // 存入 token
  userStore.setToken(res.data.token)
  // 登录成功的提示框
  ElMessage.success('登录成功')
  // 跳转至首页
  router.push('/')
}

// 切换的时候，重置表单
watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: ''
  }
})
</script>

<template>
  <!-- 
    1. 结构相关
      el-row 表示一行，一行分成 24 份
        el-col表示列
        (1) :span="12"   代表在一行中，占 12 份 (50%)
        (2) :span="6"    代表在一行中，占 6 份 (25%)
        (3) :offset="3"  代表在一行中，左侧 margin 份数

          el-form 整个表单组件
          el-form-item 表单的一行 (一个表单域) 用于存放表单元素
          el-input 表单元素 (输入框) 但并不局限于 input
            并且 input 前面的 icon 和 placeholder 是可以替换的

    2. 校验相关
      (1) el-form => :model="ruleForm"      绑定的是整个 form 的数据对象 { xxx, xxx, xxx }
      (2) el-form => :rules="rules"         绑定的是整个 rules 规则对象  { xxx, xxx, xxx }
      (3) 表单元素 => v-model="ruleForm.xxx" 给表单元素，绑定 form 的子属性
      (4) el-form-itme => prop 配置生效的是哪个校验规则 (与 rules 中的字段要对应)
  -->
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 注册相关表单 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="register"
            class="button"
            type="primary"
            auto-insert-space
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>
      <!-- 登录相关表单 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-else
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="login"
            class="button"
            type="primary"
            auto-insert-space
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;

  .bg {
    background:
      url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;

    .title {
      margin: 0 auto;
    }

    .button {
      width: 100%;
    }

    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
