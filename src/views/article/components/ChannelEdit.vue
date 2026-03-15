<script setup>
import { artAddChannelService, artEditChannelService } from '@/api/article'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
// dialog 弹出框
const dialogVisible = ref(false)
// 绑定表单
const formRef = ref()
// 声明一个存放 form 内数据的容器
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})
// 定义校验规则
const rules = {
  cate_name: [
    { require: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名称必须是 1~10 位的非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { require: true, message: '请输入分类别名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '分类别名必须是 1~10 位的非空字母或数字',
      trigger: 'blur'
    }
  ]
}
const emit = defineEmits('success')
// 提交表单
const onSubmit = async () => {
  // 进行表单预校验
  await formRef.value.validate()
  // 判断 formModel 表单中的值是否有 id 来区分添加和编辑
  if (formModel.value.id) {
    // 有 id 为编辑
    await artEditChannelService(formModel.value)
    ElMessage('编辑成功')
  } else {
    // 无 id 为添加
    await artAddChannelService(formModel.value)
    ElMessage('添加成功')
  }
  // 关闭弹窗
  dialogVisible.value = false
  emit('success')
}

// 组件对外暴露一个方法 open，基于 open 传来的参数，区分添加还是编辑
// open({}) => 表单无需渲染，说明是添加
// open({ id, cateName, ... }) => 表单需要渲染，说明是编辑
// open 调用后，可以打开弹窗
const open = (row) => {
  // 将传入的值存入 formModel 中
  // 添加传入空值 => 重置表单内容
  // 编辑 => 存储了需要回显的数据
  formModel.value = { ...row }
  dialogVisible.value = true
}
// 向外暴露方法
defineExpose({
  open
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '编辑分类' : '添加分类'"
    width="30%"
  >
    <el-form
      ref="formRef"
      :rules="rules"
      :model="formModel"
      label-width="100px"
      padding-right="30px"
    >
      <el-form-item
        label="分类名称"
        prop="cate_name"
      >
        <el-input
          placeholder="请输入分类名称"
          v-model="formModel.cate_name"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="分类别名"
        prop="cate_alias"
      >
        <el-input
          placeholder="请输入分类别名"
          v-model="formModel.cate_alias"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="onSubmit"
        >
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
