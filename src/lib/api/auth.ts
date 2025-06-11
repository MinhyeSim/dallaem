import apiClient from './axios'
import { TEAM_ID } from '../config'

export interface SignupPayload {
  name: string
  email: string
  companyName: string
  password: string
}

export const signup = async (data: SignupPayload) => {
  const response = await apiClient.post(`/${TEAM_ID}/auths/signup`, data)
  return response.data
}
