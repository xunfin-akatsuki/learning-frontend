// src/api/auth.js
import request from './request'

export const register = (data) => request.post('/accounts/register/', data)
export const login = (data) => request.post('/accounts/login/', data)
export const logout = () => request.post('/accounts/logout/')
export const getProfile = () => request.get('/accounts/profile/')
export const updateProfile = (data) => request.put('/accounts/profile/', data)