import { RaceResponse, RaceWithResultsResponse, ResultResponse } from '../types/api'
import { http } from './http'

export async function getRaces(year?: number): Promise<RaceResponse[]> {
  const { data } = await http.get<RaceResponse[]>('/races', {
    params: year ? { year } : undefined,
  })
  return data
}

export async function getUpcomingRace(year?: number): Promise<RaceResponse | null> {
  const { data } = await http.get<RaceResponse | null>('/races/upcoming', {
    params: year ? { year } : undefined,
  })
  return data
}

export async function getLatestCompletedRace(year?: number): Promise<RaceWithResultsResponse | null> {
  const { data } = await http.get<RaceWithResultsResponse | null>('/races/latest-completed', {
    params: year ? { year } : undefined,
  })
  return data
}

export async function getRaceResults(raceId: number): Promise<ResultResponse[]> {
  const { data } = await http.get<ResultResponse[]>(`/races/${raceId}/results`)
  return data
}
