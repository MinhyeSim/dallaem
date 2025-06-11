// src/lib/auth.ts
import { apiFetch } from './api'

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