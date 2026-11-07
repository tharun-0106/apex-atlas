import type { HealthResponse } from '../types/api'
import { http } from './http'

export async function getHealth(): Promise<HealthResponse> {
  const { data } = await http.get<HealthResponse>('/health')
  return data
}
