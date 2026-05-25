<!-- src/views/Register.vue -->
<template>
  <div class="register-container">
    <el-card class="register-card">
      <h2>注册</h2>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="0">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名" prefix-icon="User" size="large" />
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="form.email" placeholder="邮箱" prefix-icon="Message" size="large" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码" prefix-icon="Lock" size="large" show-password />
        </el-form-item>
        <el-form-item prop="password2">
          <el-input v-model="form.password2" type="password" placeholder="确认密码" prefix-icon="Lock" size="large" show-password />
        </el-form-item>
        <el-form-item prop="knowledge_level">
          <el-select v-model="form.knowledge_level" placeholder="选择你的知识水平" size="large" clearable>
            <el-option label="入门" value="beginner" />
            <el-option label="中级" value="intermediate" />
            <el-option label="高级" value="advanced" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" @click="handleRegister" :loading="loading" block>注册</el-button>
        </el-form-item>
      </el-form>
      <div class="footer">
        已有账号？<el-link @click="goLogin">立即登录</el-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref()
const loading = ref(false)

const form = ref({ username: '', email: '', password: '', password2: '', knowledge_level: 'beginner' })
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { type: 'email', message: '邮箱格式不正确' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, message: '密码至少6位', trigger: 'blur' }],
  password2: [{ required: true, message: '请确认密码', trigger: 'blur' }, { validator: (_, val, cb) => val === form.value.password ? cb() : cb(new Error('两次密码不一致')), trigger: 'blur' }],
}

const handleRegister = async () => {
  await formRef.value.validate()
  loading.value = true
  try {
    await userStore.register(form.value)
    ElMessage.success('注册成功')
    router.push('/')
  } catch (err) {
    ElMessage.error(err.response?.data?.error || '注册失败')
  } finally {
    loading.value = false
  }
}

const goLogin = () => router.push('/login')
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.register-card {
  width: 450px;
  padding: 20px;
}
h2 { text-align: center; margin-bottom: 24px; }
.footer { text-align: center; margin-top: 16px; }
.el-select { width: 100%; }
</style>