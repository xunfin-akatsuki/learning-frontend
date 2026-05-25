// src/api/assessments.js
import request from './request'

export const getQuizByChapter = (chapterId) => request.get(`/quizzes/?chapter=${chapterId}`)
export const submitQuiz = (quizId, answers) => request.post(`/quizzes/${quizId}/submit/`, { answers })
export const getMyAttempt = (quizId) => request.get(`/quizzes/${quizId}/my_attempt/`)