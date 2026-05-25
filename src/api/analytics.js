// src/api/analytics.js
import request from './request'

export const getUserStatistics = () => request.get('/analytics/statistics/')
export const getLearningTimeline = (days = 30) => request.get('/analytics/timeline/', { params: { days } })
export const getDashboard = () => request.get('/analytics/dashboard/')