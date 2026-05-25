<!-- src/components/Layout.vue -->
<template>
  <el-container class="layout-container">
    <el-header>
      <div class="logo">智学平台</div>
      <div class="user">
        <span>{{ userStore.userInfo?.username }}</span>
        <el-button link @click="logout">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside width="220px">
        <el-menu router :default-active="activeMenu">
          <el-menu-item index="/">
            <el-icon><HomeFilled /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/resources">
            <el-icon><Files /></el-icon>
            <span>学习资源</span>
          </el-menu-item>
          <el-menu-item index="/ai-assistant">
            <el-icon><ChatDotRound /></el-icon>
            <span>AI助手</span>
          </el-menu-item>
          <el-menu-item index="/knowledge-graph">
            <el-icon><Connection /></el-icon>
            <span>知识图谱</span>
          </el-menu-item>
          <el-menu-item index="/dashboard">
            <el-icon><DataLine /></el-icon>
            <span>学习统计</span>
          </el-menu-item>
          <el-menu-item index="/profile">
            <el-icon><User /></el-icon>
            <span>个人中心</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { HomeFilled, Files, ChatDotRound, Connection, DataLine, User } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const activeMenu = computed(() => route.path)

const logout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  padding: 0 24px;
}
.logo {
  font-size: 20px;
  font-weight: 600;
  color: #409EFF;
}
.user {
  display: flex;
  gap: 12px;
  align-items: center;
}
.el-aside {
  background: #fff;
  border-right: 1px solid #eaeef2;
}
.el-menu {
  border-right: none;
}
.el-main {
  background-color: #f5f7fa;
  padding: 20px;
}
</style>