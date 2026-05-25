# 智学平台 — 智能AI学习资源推荐系统

基于 Vue 3 + Vite 构建的智能学习平台前端，支持个性化学习资源推荐、AI学习助手、知识图谱可视化、学习进度跟踪等功能。

## 核心功能

### 1. 用户认证系统
- 注册 / 登录 / 登出
- 个人资料管理（头像、邮箱、个人简介、知识水平）
- Token 认证，路由守卫保护

### 2. 课程学习系统
- 课程详情页，展示课程目录和学习进度
- 章节学习页，支持图文内容（Markdown 渲染）与视频播放
- 每章学习完毕后进行 **5道选择题测验**，答完所有题目才可进入下一章
- 学习进度实时跟踪（已完成章节、完成率）

### 3. 课程与题库管理
- 预设 Python 基础语法第一章课程内容（图文）
- 预设对应章节的测验题库
- 管理员可通过后台添加课程（图文/视频）、设置题目

### 4. 学习资源中心
- 资源浏览、分类筛选（按类别、难度）
- 关键词搜索
- 资源收藏 / 取消收藏
- 个人收藏列表

### 5. 基于内容的推荐
- 知识点匹配：根据用户知识水平推荐匹配难度的课程
- 难度适配：入门 / 中级 / 高级课程自动匹配

### 6. 协同过滤推荐
- 混合推荐（Hybrid Recommendations）
- 相似学习者路径推荐（"学了这个的人也在学"）
- 猜你喜欢（Based on Your Likes）

### 7. AI 学习助手
- 智能答疑：实时对话式 AI 问答
- 学习建议：根据学习记录提供个性化建议
- 聊天界面，支持流式对话

### 8. AI 知识图谱
- 可视化知识结构网络图
- 节点区分课程与知识点概念
- 边展示包含关系与覆盖关系
- 支持关键词搜索知识点

### 9. 学习进度跟踪与统计
- 学习统计仪表盘（总课程数、完成率、学习时长）
- 30天学习趋势折线图（ECharts）
- 进行中课程进度展示

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3.5 (Composition API, `<script setup>`) |
| 构建工具 | Vite 8 |
| 路由 | Vue Router 4 |
| 状态管理 | Pinia 3 |
| UI 组件库 | Element Plus 2.14 |
| HTTP 客户端 | Axios |
| 图表 | ECharts 6 + vue-echarts |
| 网络图 | vis-network |
| Markdown 渲染 | marked |
| 代码高亮 | highlight.js |
| 后端（配套） | Django REST Framework (API Base: `/api`) |

---

## 项目结构

```
learning-frontend/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── api/                  # API 接口层
│   │   ├── request.js        # Axios 封装（拦截器、Token 注入）
│   │   ├── auth.js           # 认证接口
│   │   ├── courses.js        # 课程接口
│   │   ├── assessments.js    # 测验接口
│   │   ├── ai.js             # AI助手 / 知识图谱接口
│   │   ├── analytics.js      # 统计接口
│   │   ├── recommendations.js # 推荐接口
│   │   └── resources.js      # 学习资源接口
│   ├── components/           # 公共组件
│   │   ├── Layout.vue        # 主布局（侧边栏 + 顶栏）
│   │   ├── CourseCard.vue    # 课程卡片
│   │   └── QuizModal.vue     # 测验弹窗
│   ├── router/
│   │   └── index.js          # 路由配置 + 导航守卫
│   ├── stores/               # Pinia 状态管理
│   │   ├── user.js           # 用户状态
│   │   └── course.js         # 课程状态
│   ├── views/                # 页面视图
│   │   ├── Login.vue         # 登录
│   │   ├── Register.vue      # 注册
│   │   ├── Home.vue          # 首页（推荐 + 继续学习）
│   │   ├── CourseDetail.vue  # 课程详情
│   │   ├── Learning.vue      # 章节学习 + 测验
│   │   ├── Resources.vue     # 学习资源中心
│   │   ├── AIAssistant.vue   # AI 学习助手
│   │   ├── KnowledgeGraph.vue # 知识图谱
│   │   ├── Dashboard.vue     # 学习统计
│   │   └── Profile.vue       # 个人中心
│   ├── assets/               # 静态资源
│   ├── App.vue               # 根组件
│   ├── main.js               # 入口文件
│   └── style.css             # 全局样式
├── index.html
├── vite.config.js
└── package.json
```

---

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

开发服务器默认运行在 `http://localhost:5173`，所有 `/api` 请求自动代理到后端 `http://127.0.0.1:8000`。

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

---

## 预设数据集

项目需要以下 CSV 数据文件用于推荐系统和知识图谱：

| 文件 | 说明 |
|------|------|
| `resources.csv` | 学习资源数据集（标题、分类、难度、链接、知识点标签） |
| `knowledge.csv` | 知识点数据集（名称、描述、前置知识、关联课程） |
| `user_learning.csv` | 用户学习记录（用户ID、课程ID、完成状态、评分、学习时长） |

### Python 基础语法 第一章预设内容

预设课程第一章涵盖：
- Python 简介与环境搭建
- 变量与数据类型
- 基本输入输出

对应测验包含 5 道选择题，覆盖章节核心知识点。

---

## API 接口概览

所有接口以 `/api` 为前缀，通过 Axios 实例统一管理，自动注入认证 Token。

### 认证模块 (`/api/accounts/`)
- `POST /register/` — 用户注册
- `POST /login/` — 用户登录
- `POST /logout/` — 用户登出
- `GET /profile/` — 获取个人资料
- `PUT /profile/` — 更新个人资料

### 课程模块 (`/api/courses/`)
- `GET /` — 课程列表
- `GET /{id}/` — 课程详情
- `GET /{id}/chapters/` — 章节列表
- `GET /{id}/progress/` — 学习进度
- `POST /{id}/favorite/` — 收藏/取消收藏

### 测验模块 (`/api/quizzes/`)
- `GET /?chapter={id}` — 获取章节测验
- `POST /{id}/submit/` — 提交测验答案
- `GET /{id}/my_attempt/` — 查询作答记录

### AI 模块 (`/api/ai/`)
- `POST /chat/` — AI 对话
- `GET /suggestions/` — 学习建议
- `GET /knowledge-graph/` — 知识图谱数据
- `GET /knowledge-search/` — 知识点搜索

### 推荐模块 (`/api/recommendations/`)
- `GET /hybrid_recommendations/` — 混合推荐
- `GET /because_you_liked/` — 基于喜欢的推荐
- `GET /similar_users_path/` — 相似学习者路径

### 分析模块 (`/api/analytics/`)
- `GET /statistics/` — 用户统计数据
- `GET /timeline/` — 学习时间线
- `GET /dashboard/` — 仪表盘数据

### 资源模块 (`/api/resources/`)
- `GET /` — 资源列表（支持分类/难度筛选、搜索）
- `GET /categories/` — 资源分类
- `POST /{id}/favorite/` — 收藏/取消收藏
- `GET /favorites/` — 收藏列表

---

## 推荐算法说明

### 基于内容的推荐
根据用户的知识水平（入门/中级/高级）与课程难度标签的匹配度，以及知识点标签的相似度进行推荐。

### 协同过滤推荐
分析相似用户的学习路径和行为模式，推荐相似学习者喜欢但当前用户尚未学习的课程。

### 混合推荐
综合基于内容和协同过滤的结果，加权排序后给出最终推荐列表。

---

## License

MIT
