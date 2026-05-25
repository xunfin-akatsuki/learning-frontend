<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>欢迎回来</h1>
        <p>登录你的智学平台账号</p>
      </div>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="0">
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="用户名 / 邮箱"
            prefix-icon="User"
            size="large"
            clearable
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <div class="button-wrapper">
            <el-button type="primary" size="large" @click="handleLogin" :loading="loading">
              登录
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <div class="login-footer">
        <span>还没有账号？</span>
        <el-link @click="goRegister">立即注册</el-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref()
const loading = ref(false)

const form = ref({ username: '', password: '' })
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const handleLogin = async () => {
  try {
    await formRef.value.validate()
    loading.value = true
    await userStore.login(form.value)
    ElMessage.success('登录成功')
    router.push('/')
  } catch (err) {
    ElMessage.error('用户名或密码错误')
  } finally {
    loading.value = false
  }
}

const goRegister = () => router.push('/register')
</script>

<style scoped>
/* 强制清除默认边距和容器样式 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  box-sizing: border-box;
}
.login-card {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 32px 28px;
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s;
}
.login-card:hover {
  transform: translateY(-4px);
}
.login-header {
  text-align: center;
  margin-bottom: 32px;
}
.login-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px;
}
.login-header p {
  color: #7f8c8d;
  margin: 0;
  font-size: 14px;
}
/* 输入框样式覆盖 */
:deep(.el-input__wrapper) {
  border-radius: 12px !important;
  transition: all 0.2s;
}
:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #409eff inset !important;
}
/* 按钮居中 */
.button-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}
.el-button {
  min-width: 120px;
  border-radius: 12px;
  font-weight: 500;
  letter-spacing: 1px;
}
/* 底部文字统一 */
.login-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #5d6b7a;
}
.login-footer span,
.login-footer .el-link {
  font-size: 14px !important;
  font-weight: 500;
  vertical-align: baseline;
}
</style>