// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue'), meta: { guest: true } },
  { path: '/register', name: 'Register', component: () => import('../views/Register.vue'), meta: { guest: true } },
  {
    path: '/',
    component: () => import('../components/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Home', component: () => import('../views/Home.vue') },
      { path: 'course/:id', name: 'CourseDetail', component: () => import('../views/CourseDetail.vue') },
      { path: 'learning/:courseId/:chapterId?', name: 'Learning', component: () => import('../views/Learning.vue') },
      { path: 'resources', name: 'Resources', component: () => import('../views/Resources.vue') },
      { path: 'ai-assistant', name: 'AIAssistant', component: () => import('../views/AIAssistant.vue') },
      { path: 'knowledge-graph', name: 'KnowledgeGraph', component: () => import('../views/KnowledgeGraph.vue') },
      { path: 'dashboard', name: 'Dashboard', component: () => import('../views/Dashboard.vue') },
      { path: 'profile', name: 'Profile', component: () => import('../views/Profile.vue') },
    ],
  },
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) next('/login')
  else if (to.meta.guest && token) next('/')
  else next()
})

export default router