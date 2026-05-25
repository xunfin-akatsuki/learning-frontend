<!-- src/views/Learning.vue -->
<template>
  <div class="learning-container">
    <div class="sidebar">
      <el-menu :default-active="String(currentChapterId)">
        <el-menu-item 
          v-for="ch in chapters" 
          :key="ch.id" 
          :index="String(ch.id)"
          @click="loadChapter(ch.id)"
        >
          <span>{{ ch.title }}</span>
          <el-badge v-if="ch.completed" value="✓" type="success" />
        </el-menu-item>
      </el-menu>
    </div>

    <div class="content-area">
      <div v-if="chapterContent" class="chapter-content">
        <h2>{{ chapterContent.title }}</h2>
        <div v-if="chapterContent.content_type !== 'video'" class="text-content" v-html="renderedMarkdown"></div>
        <div v-else class="video-content">
          <video :src="chapterContent.video_url" controls style="width: 100%;"></video>
        </div>

        <!-- 测验按钮 -->
        <div class="quiz-action" v-if="chapterContent.quiz && !quizPassed">
          <el-button type="primary" @click="openQuizModal">开始测验</el-button>
        </div>
        <div v-else-if="quizPassed" class="quiz-passed">
          <el-alert title="测验已通过" type="success" :closable="false" />
          <el-button type="primary" @click="nextChapter">进入下一章</el-button>
        </div>
      </div>
    </div>

    <!-- 测验弹窗 -->
    <QuizModal
      v-model="quizModalVisible"
      :quiz-id="currentQuizId"
      :quiz-title="currentQuizTitle"
      :questions="currentQuestions"
      @success="onQuizSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getChapterContent, completeChapter, getCourseDetail } from '../api/courses'
import { getMyAttempt } from '../api/assessments'
import { marked } from 'marked'
import { ElMessage } from 'element-plus'
import QuizModal from '../components/QuizModal.vue'

const route = useRoute()
const router = useRouter()
const courseId = ref(route.params.courseId)
const currentChapterId = ref(route.params.chapterId)
const chapters = ref([])
const chapterContent = ref(null)
const quizPassed = ref(false)
const quizModalVisible = ref(false)
const currentQuizId = ref(null)
const currentQuizTitle = ref('')
const currentQuestions = ref([])

const renderedMarkdown = computed(() => {
  return marked.parse(chapterContent.value?.text_content || '')
})

const loadChapter = async (chapterId) => {
  const res = await getChapterContent(chapterId)
  chapterContent.value = res.data
  currentChapterId.value = chapterId
  
  if (res.data.quiz) {
    currentQuizId.value = res.data.quiz.id
    currentQuizTitle.value = res.data.quiz.title
    currentQuestions.value = res.data.quiz.questions || []
    // 检查是否已通过
    try {
      const attempt = await getMyAttempt(currentQuizId.value)
      quizPassed.value = attempt.data.passed === true
    } catch {
      quizPassed.value = false
    }
  } else {
    quizPassed.value = true
  }
}

const openQuizModal = () => {
  if (currentQuizId.value) {
    quizModalVisible.value = true
  }
}

const onQuizSuccess = () => {
  quizPassed.value = true
  quizModalVisible.value = false
  ElMessage.success('测验通过！可以进入下一章')
}

const nextChapter = async () => {
  const res = await completeChapter(currentChapterId.value)
  const nextId = res.data.next_chapter_id
  if (nextId) {
    router.push(`/learning/${courseId.value}/${nextId}`)
  } else {
    ElMessage.success('恭喜你完成了整个课程！')
    router.push(`/course/${courseId.value}`)
  }
}

onMounted(async () => {
  const detailRes = await getCourseDetail(courseId.value)
  chapters.value = detailRes.data.chapters
  await loadChapter(currentChapterId.value)
})
</script>

<style scoped>
/* 样式保持不变，增加 quiz-action 区域 */
.learning-container { display: flex; height: calc(100vh - 60px); }
.sidebar { width: 260px; background: #f5f7fa; overflow-y: auto; }
.content-area { flex: 1; padding: 20px; overflow-y: auto; }
.quiz-action, .quiz-passed { margin-top: 40px; text-align: center; }
</style>