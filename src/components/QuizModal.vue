<!-- src/components/QuizModal.vue -->
<template>
  <el-dialog v-model="visible" :title="`章节测验：${quizTitle}`" width="700px" @close="close">
    <div v-if="!submitted && questions && questions.length">
      <div v-for="(q, idx) in questions" :key="q.id" class="question-item">
        <p><strong>{{ idx+1 }}. {{ q.text }}</strong></p>
        <el-radio-group v-model="answers[q.id]" class="options">
          <el-radio :label="'A'">A. {{ q.option_a }}</el-radio>
          <el-radio :label="'B'">B. {{ q.option_b }}</el-radio>
          <el-radio :label="'C'">C. {{ q.option_c }}</el-radio>
          <el-radio :label="'D'">D. {{ q.option_d }}</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div v-else-if="submitted" class="result">
      <el-alert :title="resultMsg" :type="passed ? 'success' : 'error'" :closable="false" />
      <div class="score">得分：{{ score }} 分</div>
      <div v-if="!passed" class="advice">未通过，请重新学习本章节后再试。</div>
    </div>
    <div v-else>暂无测验题目</div>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button v-if="!submitted" type="primary" @click="submit" :loading="submitting">提交</el-button>
      <el-button v-else type="primary" @click="close">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { submitQuiz } from '@/api/assessments'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  quizId: { type: Number, default: 0 },
  quizTitle: { type: String, default: '章节测验' },
  questions: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:modelValue', 'success'])

const visible = ref(props.modelValue)
const answers = ref({})
const submitted = ref(false)
const passed = ref(false)
const score = ref(0)
const submitting = ref(false)

const resultMsg = computed(() => 
  passed.value ? '恭喜！测验通过，可以进入下一章。' : '测验未通过'
)

watch(() => props.modelValue, (val) => { visible.value = val })
watch(visible, (val) => { if (!val) emit('update:modelValue', false) })

const submit = async () => {
  if (!props.quizId || props.quizId === 0) {
    ElMessage.error('无效的测验ID')
    return
  }
  if (Object.keys(answers.value).length !== props.questions.length) {
    ElMessage.warning('请答完所有题目')
    return
  }
  submitting.value = true
  try {
    const res = await submitQuiz(props.quizId, answers.value)
    passed.value = res.data.passed
    score.value = res.data.score
    submitted.value = true
    if (passed.value) {
      emit('success')
    }
  } catch (err) {
    ElMessage.error('提交失败')
  } finally {
    submitting.value = false
  }
}

const close = () => {
  visible.value = false
  submitted.value = false
  answers.value = {}
}
</script>

<style scoped>
/* 样式不变 */
</style>