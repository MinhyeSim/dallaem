// src/lib/auth.ts
import { apiFetch } from './api'
import apiClient from '../lib/api/axios'

export interface AuthPayload {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  user: {
    id: number
    email: string
  }
}

export const login = (payload: { email: string; password: string }) =>
  apiFetch('/auths/signin', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  export interface SignupPayload {
    name: string
    email: string
    companyName: string
    password: string
  }
  
  export const signup = async (data: SignupPayload) => {
    const response = await apiClient.post('/auths/signup', data)
    return response.data
  }