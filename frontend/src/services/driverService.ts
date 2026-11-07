import { DriverResponse } from '../types/api'
import { http } from './http'

export async function getDrivers(nationality?: string, limit = 100): Promise<DriverResponse[]> {
  const { data } = await http.get<DriverResponse[]>('/drivers', {
    params: { nationality, limit },
  })
  return data
}

export async function getDriver(ref: string): Promise<DriverResponse> {
  const { data } = await http.get<DriverResponse>(`/drivers/${ref}`)
  return data
}
