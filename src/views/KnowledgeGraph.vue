<template>
  <div class="knowledge-graph">
    <div class="search">
      <el-input v-model="keyword" placeholder="搜索知识点" clearable @keyup.enter="handleSearch" />
      <el-button @click="handleSearch">搜索</el-button>
    </div>
    <div id="graph-container" ref="graphContainer" style="height: 600px; width: 100%; border: 1px solid #ddd;"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { getKnowledgeGraph, searchKnowledge } from '@/api/ai'
import { Network } from 'vis-network/standalone'

const graphContainer = ref(null)
const keyword = ref('')
let network = null

const loadGraph = async () => {
  await nextTick()
  if (!graphContainer.value) return
  // 确保容器有尺寸
  if (graphContainer.value.clientWidth === 0 || graphContainer.value.clientHeight === 0) {
    setTimeout(loadGraph, 200)
    return
  }
  try {
    const res = await getKnowledgeGraph()
    const { nodes = [], links = [] } = res.data
    // 构建 vis 节点
    const visNodes = nodes.map(n => ({
      id: n.id,
      label: n.name,          // 直接显示名称
      title: n.description,   // 鼠标悬停显示描述
      group: n.type,
      shape: n.type === 'Course' ? 'box' : 'ellipse',
      color: n.type === 'Course' ? '#409EFF' : '#67C23A'
    }))
    const visEdges = links.map(l => ({
      from: l.source,
      to: l.target,
      label: l.type === 'COVERS' ? '涵盖' : '属于',
      arrows: 'to'
    }))
    const data = { nodes: visNodes, edges: visEdges }
    const options = {
      nodes: {
        shape: 'ellipse',
        size: 30,
        font: { size: 14, face: 'Arial' },
        margin: 8
      },
      edges: { smooth: true, font: { size: 12, align: 'middle' } },
      physics: { stabilization: true },
      layout: { improvedLayout: true }
    }
    network = new Network(graphContainer.value, data, options)
    // 可选：居中显示
    network.fit()
  } catch (error) {
    console.error('加载知识图谱失败', error)
  }
}

const handleSearch = async () => {
  if (!keyword.value.trim()) return
  try {
    const res = await searchKnowledge(keyword.value)
    // 高亮节点（简化：弹出提示）
    alert(`找到 ${res.data.total} 个相关知识点`)
    // 还可以根据 res.data.results 高亮节点
  } catch (error) {
    console.error('搜索失败', error)
  }
}

onMounted(() => {
  loadGraph()
})
</script>

<style scoped>
.knowledge-graph { padding: 20px; }
.search { display: flex; gap: 12px; margin-bottom: 20px; justify-content: center; }
.search .el-input { width: 300px; }
</style>