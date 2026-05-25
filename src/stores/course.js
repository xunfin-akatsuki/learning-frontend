// src/stores/course.js
import { defineStore } from 'pinia'
import { getCourses, getCourseDetail, getCourseProgress } from '../api/courses'

export const useCourseStore = defineStore('course', {
  state: () => ({
    courses: [],
    currentCourse: null,
    progress: {},
  }),
  actions: {
    async fetchCourses(params) {
      const res = await getCourses(params)
      this.courses = res.data.results || res.data
    },
    async fetchCourseDetail(id) {
      const res = await getCourseDetail(id)
      this.currentCourse = res.data
      return res.data
    },
    async fetchProgress(courseId) {
      const res = await getCourseProgress(courseId)
      this.progress[courseId] = res.data
    },
  },
})