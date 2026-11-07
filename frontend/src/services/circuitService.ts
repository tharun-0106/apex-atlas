import { CircuitResponse } from '../types/api'
import { http } from './http'

export async function getCircuits(country?: string, limit = 100): Promise<CircuitResponse[]> {
  const { data } = await http.get<CircuitResponse[]>('/circuits', {
    params: { country, limit },
  })
  return data
}

export async function getCircuit(ref: string): Promise<CircuitResponse> {
  const { data } = await http.get<CircuitResponse>(`/circuits/${ref}`)
  return data
}
