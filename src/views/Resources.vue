<template>
  <div class="resources">
    <div class="filters">
      <el-select v-model="filters.category" placeholder="分类" clearable>
        <el-option v-for="cat in (categories || [])" :key="cat.id" :label="cat.name" :value="cat.name" />
      </el-select>
      <el-select v-model="filters.difficulty" placeholder="难度" clearable>
        <el-option label="入门" value="beginner" />
        <el-option label="中级" value="intermediate" />
        <el-option label="高级" value="advanced" />
      </el-select>
      <el-input v-model="filters.search" placeholder="搜索资源" clearable @keyup.enter="handleSearch" />
    </div>

    <div class="resource-grid">
      <el-card v-for="res in (resources || [])" :key="res.id" class="resource-card" shadow="hover">
        <div class="card-header">
          <span>{{ res.title }}</span>
          <el-button text @click="toggleFavorite(res)">
            <el-icon><StarFilled v-if="res.is_favorited" /><Star v-else /></el-icon>
          </el-button>
        </div>
        <p>{{ res.description || '暂无描述' }}</p>
        <div class="footer">
          <el-link :href="res.url" target="_blank">查看资源</el-link>
          <el-tag size="small">{{ res.difficulty_level }}</el-tag>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getResources, getResourceCategories, toggleFavoriteResource } from '@/api/resources'
import { Star, StarFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const resources = ref([])
const categories = ref([])
const filters = ref({ category: '', difficulty: '', search: '' })

const fetchResources = async () => {
  try {
    const res = await getResources(filters.value)
    resources.value = res.data.results || res.data || []
  } catch (error) {
    console.error('加载资源失败', error)
    resources.value = []
  }
}

const handleSearch = () => {
  fetchResources()
}

const toggleFavorite = async (res) => {
  try {
    await toggleFavoriteResource(res.id)
    res.is_favorited = !res.is_favorited
    ElMessage.success(res.is_favorited ? '已收藏' : '已取消收藏')
  } catch {
    ElMessage.error('操作失败')
  }
}

const fetchCategories = async () => {
  try {
    const res = await getResourceCategories()
    categories.value = Array.isArray(res.data) ? res.data : []
  } catch (error) {
    categories.value = []
    console.error('加载分类失败', error)
  }
}

onMounted(() => {
  fetchResources()
  fetchCategories()
})
</script>

<style scoped>
/* 保持不变 */
</style>