<!-- src/views/Home.vue -->
<template>
  <div class="home-container">
    <el-card class="welcome-card" shadow="never">
      <div class="welcome-text">
        <h1>欢迎回来，{{ userStore.userInfo?.username }} 👋</h1>
        <p>继续你的学习之旅</p>
      </div>
    </el-card>

    <section class="section" v-if="dashboardData.in_progress_courses?.length">
      <h2>继续学习</h2>
      <div class="course-list">
        <CourseCard 
          v-for="course in dashboardData.in_progress_courses" 
          :key="course.id"
          :course="course"
          :progress="course.progress"
          show-progress
        />
      </div>
    </section>

    <section class="section">
      <h2>推荐课程</h2>
      <div class="course-list">
        <CourseCard v-for="course in hybridRecommendations" :key="course.id" :course="course" />
      </div>
    </section>

    <section class="section" v-if="becauseYouLiked.length">
      <h2>猜你喜欢</h2>
      <div class="course-list">
        <CourseCard v-for="course in becauseYouLiked" :key="course.id" :course="course" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { getHybridRecommendations, getBecauseYouLiked } from '../api/recommendations'
import { getDashboard } from '../api/analytics'
import CourseCard from '../components/CourseCard.vue'

const userStore = useUserStore()
const hybridRecommendations = ref([])
const becauseYouLiked = ref([])
const dashboardData = ref({})

onMounted(async () => {
  try {
    const [hybrid, liked, dashboard] = await Promise.all([
      getHybridRecommendations(),
      getBecauseYouLiked(),
      getDashboard()
    ])
    hybridRecommendations.value = hybrid.data
    becauseYouLiked.value = liked.data
    dashboardData.value = dashboard.data
  } catch (error) {
    console.error('加载首页数据失败', error)
  }
})
</script>

<style scoped>
.home-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
.welcome-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; margin-bottom: 20px; }
.section { margin: 40px 0; }
.course-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px,1fr)); gap: 20px; }
</style>