<!-- src/views/CourseDetail.vue -->
<template>
  <div class="course-detail" v-loading="loading">
    <div class="main">
      <h1>{{ course.title }}</h1>
      <p>{{ course.description }}</p>
      <div class="meta">
        <el-tag :type="difficultyMap[course.difficulty_level]">
          {{ course.difficulty_level === 'beginner' ? '入门' : course.difficulty_level === 'intermediate' ? '中级' : '高级' }}
        </el-tag>
        <span>预计 {{ course.estimated_hours }} 小时</span>
        <el-button type="primary" @click="startLearning" :loading="starting">
          {{ progress ? '继续学习' : '开始学习' }}
        </el-button>
        <el-button @click="toggleFavorite">
          {{ course.is_favorited ? '取消收藏' : '收藏' }}
        </el-button>
      </div>
    </div>

    <div class="chapters">
      <h3>课程目录</h3>
      <el-timeline>
        <el-timeline-item
          v-for="(ch, idx) in course.chapters"
          :key="ch.id"
          :type="ch.completed ? 'success' : 'primary'"
          :hollow="!ch.completed"
        >
          <div class="chapter-item">
            <span>第{{ idx+1 }}章：{{ ch.title }}</span>
            <el-button text @click="goToChapter(ch.id)" v-if="ch.completed || idx===0">学习</el-button>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCourseDetail, getCourseProgress, favoriteCourse } from '../api/courses'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const course = ref({ chapters: [] })
const loading = ref(false)
const progress = ref(null)
const starting = ref(false)

const difficultyMap = { beginner: 'success', intermediate: 'warning', advanced: 'danger' }

onMounted(async () => {
  loading.value = true
  const id = route.params.id
  try {
    const [detailRes, progressRes] = await Promise.all([
      getCourseDetail(id),
      getCourseProgress(id)
    ])
    course.value = detailRes.data
    progress.value = progressRes.data
  } catch (error) {
    ElMessage.error('加载课程失败')
  } finally {
    loading.value = false
  }
})

const startLearning = async () => {
  starting.value = true
  const firstChapter = course.value.chapters[0]
  const startChapterId = progress.value?.current_chapter_id || firstChapter.id
  router.push(`/learning/${course.value.id}/${startChapterId}`)
  starting.value = false
}

const goToChapter = (chapterId) => {
  router.push(`/learning/${course.value.id}/${chapterId}`)
}

const toggleFavorite = async () => {
  try {
    await favoriteCourse(course.value.id)
    course.value.is_favorited = !course.value.is_favorited
    ElMessage.success(course.value.is_favorited ? '已收藏' : '已取消收藏')
  } catch {
    ElMessage.error('操作失败')
  }
}
</script>

<style scoped>
.course-detail { max-width: 1000px; margin: 0 auto; padding: 20px; }
.main { background: white; padding: 24px; border-radius: 8px; margin-bottom: 24px; }
.meta { display: flex; gap: 16px; align-items: center; margin-top: 20px; }
.chapters { background: white; padding: 24px; border-radius: 8px; }
.chapter-item { display: flex; justify-content: space-between; align-items: center; width: 100%; }
</style>