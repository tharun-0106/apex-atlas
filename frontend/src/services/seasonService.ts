import { SeasonSummaryResponse } from '../types/api'
import { http } from './http'

export async function getSeasons(): Promise<number[]> {
  const { data } = await http.get<number[]>('/seasons')
  return data
}

export async function getSeasonSummary(year?: number): Promise<SeasonSummaryResponse> {
  const { data } = await http.get<SeasonSummaryResponse>('/seasons/summary', {
    params: year ? { year } : undefined,
  })
  return data
}
