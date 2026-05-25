<template>
  <div class="ai-assistant">
    <div class="chat-panel">
      <div class="messages" ref="messagesContainer">
        <div v-for="(msg, idx) in messages" :key="idx" :class="['message', msg.role]">
          <div class="avatar">
            <el-avatar :icon="msg.role === 'user' ? UserFilled : Service" />
          </div>
          <div class="content">{{ msg.content }}</div>
        </div>
      </div>
      <div class="input-area">
        <el-input v-model="question" placeholder="输入你的问题..." @keyup.enter="sendMessage" clearable />
        <el-button type="primary" @click="sendMessage">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { UserFilled, Service } from '@element-plus/icons-vue'
import { askAI, getSuggestions } from '@/api/ai'
import { ElMessage } from 'element-plus'

const messages = ref([{ role: 'assistant', content: '你好！我是智学助手，有什么可以帮助你的吗？' }])
const question = ref('')
const messagesContainer = ref(null)

const sendMessage = async () => {
  if (!question.value.trim()) return
  const userQ = question.value
  messages.value.push({ role: 'user', content: userQ })
  question.value = ''
  await nextTick()
  scrollToBottom()
  try {
    const res = await askAI(userQ)
    messages.value.push({ role: 'assistant', content: res.data.answer })
    await nextTick()
    scrollToBottom()
  } catch (error) {
    ElMessage.error('AI服务暂时不可用')
    messages.value.push({ role: 'assistant', content: '抱歉，服务暂时不可用，请稍后再试。' })
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 可选：加载学习建议（侧边栏已移除，但你可以加回来）
// 这里只保留聊天核心功能，如需建议可重新添加侧边栏
</script>

<style scoped>
.ai-assistant {
  height: calc(100vh - 100px);
  padding: 20px;
}
.chat-panel {
  background: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}
.message {
  display: flex;
  margin-bottom: 20px;
  align-items: flex-start;
}
.message.user {
  flex-direction: row-reverse;
}
.message.user .content {
  background-color: #409EFF;
  color: white;
  margin-right: 12px;
}
.message.assistant .content {
  background-color: #f4f4f5;
  color: #303133;
  margin-left: 12px;
}
.message .avatar {
  flex-shrink: 0;
}
.message .content {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 18px;
  line-height: 1.5;
  word-break: break-word;
  white-space: pre-wrap; /* 保留换行和缩进 */
}
.input-area {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #ebeef5;
}
.input-area .el-input {
  flex: 1;
}
</style>