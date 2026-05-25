<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-statistic title="总课程" :value="stats.total_courses || 0" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="完成课程" :value="stats.completed_courses || 0" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="完成率" :value="stats.completion_rate || 0" suffix="%" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="学习时长" :value="stats.estimated_learning_hours || 0" suffix="小时" />
      </el-col>
    </el-row>

    <!-- 学习趋势图表（改进：显示每日学习时长，反映起伏） -->
    <div class="chart">
      <h3>学习趋势（过去30天）</h3>
      <v-chart :option="timelineOption" style="height: 400px" autoresize />
    </div>

    <!-- 进行中的课程（改进：使用紧凑型进度条） -->
    <div class="recent">
      <h3>进行中的课程</h3>
      <div v-for="c in inProgress" :key="c.id" class="course-progress-item">
        <div class="course-title">{{ c.title }}</div>
        <div class="progress-wrapper">
          <el-progress
            :percentage="c.progress"
            :stroke-width="8"
            :show-text="true"
            :format="() => `${c.progress}%`"
          />
        </div>
      </div>
      <el-empty v-if="!inProgress.length" description="暂无进行中的课程" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getUserStatistics, getLearningTimeline, getDashboard } from '@/api/analytics'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([LineChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent, CanvasRenderer])

const stats = ref({})
const timeline = ref([])
const inProgress = ref([])

const timelineOption = computed(() => {
  const dates = timeline.value.map(d => d.date)
  const completedCounts = timeline.value.map(d => d.chapters_completed)
  return {
    title: { text: '每日完成章节数' },
    xAxis: { type: 'category', data: dates, name: '日期' },
    yAxis: { type: 'value', name: '完成章节数' },
    series: [{
      data: completedCounts,
      type: 'line',
      smooth: true,
      areaStyle: { opacity: 0.3 },
      lineStyle: { width: 3, color: '#409EFF' }
    }]
  }
})

onMounted(async () => {
  try {
    const [statRes, timelineRes, dashRes] = await Promise.all([
      getUserStatistics(),
      getLearningTimeline(30),
      getDashboard()
    ])
    stats.value = statRes.data
    timeline.value = timelineRes.data
    inProgress.value = dashRes.data.in_progress_courses || []
  } catch (error) {
    console.error('加载仪表板失败', error)
  }
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
.chart {
  margin: 40px 0;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
}
.recent {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
}
.course-progress-item {
  margin-bottom: 24px;
}
.course-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #303133;
}
.progress-wrapper {
  max-width: 500px;  /* 限制进度条最大宽度，避免过长 */
}
</style>