// src/api/ai.js
import request from './request'

export const askAI = (question) => request.post('/ai/chat/', { question })
export const getSuggestions = () => request.get('/ai/suggestions/')
export const getKnowledgeGraph = () => request.get('/ai/knowledge-graph/')
export const searchKnowledge = (keyword) => request.get('/ai/knowledge-search/', { params: { q: keyword } })