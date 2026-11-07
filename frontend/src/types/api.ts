/** Response of GET /api/v1/health */
export interface HealthResponse {
  status: 'ok' | 'degraded'
  service: string
  version: string
  environment: string
  database: 'up' | 'down'
}

export interface SeasonSummaryResponse {
  year: number
  total_races: number
  completed_races: number
  total_drivers: number
  total_constructors: number
}

export interface CircuitResponse {
  id: number
  circuit_ref: string
  name: string
  location: string | null
  country: string | null
  latitude: number | null
  longitude: number | null
  url: string | null
}

export interface DriverResponse {
  id: number
  driver_ref: string
  code: string | null
  permanent_number: number | null
  forename: string
  surname: string
  date_of_birth: string | null
  nationality: string | null
  url: string | null
}

export interface ConstructorResponse {
  id: number
  constructor_ref: string
  name: string
  nationality: string | null
  url: string | null
}

export interface RaceResponse {
  id: number
  season_year: number
  round: number
  name: string
  date: string
  time: string | null
  url: string | null
  circuit: CircuitResponse | null
}

export interface ResultResponse {
  id: number
  number: number | null
  grid: number | null
  position: number | null
  position_text: string | null
  points: number
  laps: number
  status: string | null
  time_text: string | null
  time_millis: number | null
  fastest_lap_rank: number | null
  fastest_lap_time: string | null
  driver: DriverResponse | null
  constructor: ConstructorResponse | null
}

export interface RaceWithResultsResponse {
  race: RaceResponse
  results: ResultResponse[]
}

export interface DriverStandingResponse {
  position: number
  position_text: string | null
  points: number
  wins: number
  driver: DriverResponse
}

export interface ConstructorStandingResponse {
  position: number
  position_text: string | null
  points: number
  wins: number
  constructor: ConstructorResponse
}
