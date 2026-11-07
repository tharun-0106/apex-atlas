import { ConstructorStandingResponse, DriverStandingResponse } from '../types/api'
import { http } from './http'

export async function getDriverStandings(year?: number, limit = 10): Promise<DriverStandingResponse[]> {
  const { data } = await http.get<DriverStandingResponse[]>('/standings/drivers', {
    params: { year, limit },
  })
  return data
}

export async function getConstructorStandings(year?: number, limit = 10): Promise<ConstructorStandingResponse[]> {
  const { data } = await http.get<ConstructorStandingResponse[]>('/standings/constructors', {
    params: { year, limit },
  })
  return data
}
