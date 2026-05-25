// src/api/recommendations.js
import request from './request'

export const getHybridRecommendations = () => request.get('/recommendations/hybrid_recommendations/')
export const getBecauseYouLiked = () => request.get('/recommendations/because_you_liked/')
export const getSimilarUsersPaths = () => request.get('/recommendations/similar_users_path/')