<template>
  <div class="profile">
    <!-- 个人信息卡片 -->
    <el-card>
      <template #header>
        <span>个人资料</span>
      </template>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" disabled />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-upload
            name="avatar"
            :action="avatarUploadUrl"
            :headers="uploadHeaders"
            :on-success="handleAvatarSuccess"
            :show-file-list="false"
          >
            <img v-if="form.avatar" :src="form.avatar" class="avatar" />
            <el-button type="primary">上传头像</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="个人简介" prop="bio">
          <el-input v-model="form.bio" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="知识水平" prop="knowledge_level">
          <el-select v-model="form.knowledge_level">
            <el-option label="入门" value="beginner" />
            <el-option label="中级" value="intermediate" />
            <el-option label="高级" value="advanced" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save" :loading="saving">保存修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 收藏的学习资源卡片（优化样式） -->
    <el-card style="margin-top: 20px">
      <template #header>
        <span>收藏的学习资源</span>
      </template>
      <div class="favorite-list">
        <div v-for="res in favorites" :key="res.id" class="favorite-item">
          <div class="favorite-info">
            <div class="favorite-title">{{ res.title }}</div>
            <el-tag size="small" :type="difficultyTag[res.difficulty_level]">
              {{ difficultyText[res.difficulty_level] }}
            </el-tag>
          </div>
          <div class="favorite-actions">
            <el-button link type="primary" @click="openResource(res.url)">查看</el-button>
            <el-button plain type="danger" size="small" @click="removeFavorite(res.id)">取消收藏</el-button>
          </div>
        </div>
        <el-empty v-if="!favorites.length" description="暂无收藏资源" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { getUserFavorites, toggleFavoriteResource } from '@/api/resources'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const formRef = ref()
const saving = ref(false)
const favorites = ref([])

// 头像上传配置
const avatarUploadUrl = '/api/accounts/upload/avatar/'
const uploadHeaders = {
  Authorization: `Token ${localStorage.getItem('token')}`
}

const form = reactive({
  username: '',
  email: '',
  avatar: '',
  bio: '',
  knowledge_level: 'beginner',
})

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确' }
  ],
}

// 难度映射
const difficultyTag = { beginner: 'success', intermediate: 'warning', advanced: 'danger' }
const difficultyText = { beginner: '入门', intermediate: '中级', advanced: '高级' }

// 打开资源链接
const openResource = (url) => {
  window.open(url, '_blank')
}

// 获取收藏列表
const fetchFavorites = async () => {
  try {
    const res = await getUserFavorites()
    let list = []
    if (res.data && Array.isArray(res.data.results)) {
      list = res.data.results
    } else if (Array.isArray(res.data)) {
      list = res.data
    }
    favorites.value = list
  } catch (error) {
    console.error('获取收藏失败', error)
    favorites.value = []
  }
}

// 取消收藏
const removeFavorite = async (id) => {
  try {
    await toggleFavoriteResource(id)
    favorites.value = favorites.value.filter(f => f.id !== id)
    ElMessage.success('已取消收藏')
  } catch {
    ElMessage.error('操作失败')
  }
}

// 头像上传成功
const handleAvatarSuccess = (response) => {
  if (response.url) {
    form.avatar = response.url
    if (userStore.userInfo) userStore.userInfo.avatar = response.url
    ElMessage.success('头像上传成功')
  }
}

// 保存个人信息
const save = async () => {
  try {
    await formRef.value.validate()
    saving.value = true
    const updateData = {
      email: form.email,
      bio: form.bio,
      knowledge_level: form.knowledge_level,
    }
    await userStore.updateProfile(updateData)
    ElMessage.success('保存成功')
  } catch (err) {
    ElMessage.error('保存失败: ' + (err.response?.data?.email || err.message))
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await userStore.fetchProfile()
  Object.assign(form, userStore.userInfo)
  fetchFavorites()
})
</script>

<style scoped>
.profile {
  max-width: 800px;
  margin: 20px auto;
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 16px;
}
/* 优化后的收藏列表样式 */
.favorite-list {
  margin-top: 8px;
}
.favorite-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}
.favorite-item:last-child {
  border-bottom: none;
}
.favorite-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.favorite-title {
  font-weight: 500;
  color: #303133;
  font-size: 14px;
}
.favorite-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>