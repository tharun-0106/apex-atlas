/** Response of GET /api/v1/health */
export interface HealthResponse {
  status: 'ok' | 'degraded'
  service: string
  version: string
  environment: string
  database: 'up' | 'down'
}
