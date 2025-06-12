import apiClient from './axios'

export interface SignupPayload {
  name: string
  email: string
  companyName: string
  password: string
}

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID

export const signup = async (data: SignupPayload) => {
  const response = await apiClient.post(`/${TEAM_ID}/auths/signup`, data)
  return response.data
}

export interface LoginPayload {
  email: string
  password: string
}

export const login = async (data: LoginPayload) => {
  const response = await apiClient.post(`/${TEAM_ID}/auths/signin`, data)
  return response.data
}
