// src/api/courses.js
import request from './request'

export const getCourses = (params) => request.get('/courses/', { params })
export const getCourseDetail = (id) => request.get(`/courses/${id}/`)
export const getCourseChapters = (id) => request.get(`/courses/${id}/chapters/`)
export const getCourseProgress = (id) => request.get(`/courses/${id}/progress/`)
export const favoriteCourse = (id) => request.post(`/courses/${id}/favorite/`)
export const getChapterContent = (chapterId) => request.get(`/chapters/${chapterId}/content/`)
export const completeChapter = (chapterId) => request.post(`/chapters/${chapterId}/complete/`)