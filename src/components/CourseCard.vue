<template>
  <el-card class="course-card" shadow="hover" @click="goToDetail">
    <div class="cover">
      <img 
        :src="coverUrl" 
        :alt="course.title"
        @error="handleImageError"
      />
      <el-button
        class="favorite-btn"
        :icon="course.is_favorited ? StarFilled : Star"
        circle
        @click.stop="toggleFavorite"
      />
    </div>
    <div class="info">
      <h3>{{ course.title }}</h3>
      <p class="description">{{ truncate(course.description, 80) }}</p>
      <div class="meta">
        <el-tag :type="difficultyTag[course.difficulty_level]" size="small">
          {{ difficultyText[course.difficulty_level] }}
        </el-tag>
        <span>⏱️ {{ course.estimated_hours }}h</span>
      </div>
      <el-progress
        v-if="showProgress && progress !== undefined"
        :percentage="progress"
        :stroke-width="6"
        :show-text="false"
      />
    </div>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import { Star, StarFilled } from '@element-plus/icons-vue'
import { favoriteCourse } from '@/api/courses'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const props = defineProps({
  course: { type: Object, required: true },
  progress: { type: Number, default: null },
  showProgress: { type: Boolean, default: false },
})

const router = useRouter()

// 在线占位图（当没有本地图片或加载失败时使用）
const ONLINE_PLACEHOLDER = 'https://picsum.photos/400/200?random=1'

// 封面 URL 计算
const coverUrl = computed(() => {
  if (props.course.cover_image && props.course.cover_image.trim() !== '') {
    return props.course.cover_image
  }
  return 'https://picsum.photos/400/200?random=1'
})

// 图片加载失败时的回调（例如本地图片损坏或不存在）
const handleImageError = (e) => {
  e.target.src = ONLINE_PLACEHOLDER
}

// 难度标签颜色映射
const difficultyTag = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'danger'
}

// 难度文本映射
const difficultyText = {
  beginner: '入门',
  intermediate: '中级',
  advanced: '高级'
}

// 截断描述文字
const truncate = (str, len) => {
  if (!str) return ''
  return str.length > len ? str.slice(0, len) + '...' : str
}

// 跳转课程详情
const goToDetail = () => router.push(`/course/${props.course.id}`)

// 切换收藏
const toggleFavorite = async () => {
  try {
    await favoriteCourse(props.course.id)
    props.course.is_favorited = !props.course.is_favorited
    ElMessage.success(props.course.is_favorited ? '已收藏' : '已取消收藏')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}
</script>

<style scoped>
.course-card {
  cursor: pointer;
  transition: transform 0.2s;
  overflow: hidden;
}
.course-card:hover {
  transform: translateY(-4px);
}
.cover {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  height: 160px;
  background-color: #f0f2f5;
}
.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.favorite-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255,255,255,0.8);
}
.info {
  padding: 12px 0 4px;
}
.info h3 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
}
.description {
  color: #666;
  font-size: 13px;
  margin: 0 0 12px;
  line-height: 1.4;
}
.meta {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}
</style>