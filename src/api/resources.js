// src/api/resources.js
import request from './request'

export const getResources = (params) => request.get('/resources/', { params })
export const getResourceCategories = () => request.get('/resources/categories/')
export const toggleFavoriteResource = (id) => request.post(`/resources/${id}/favorite/`)
export const getUserFavorites = () => request.get('/resources/favorites/')