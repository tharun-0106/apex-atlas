import axios, { AxiosError } from 'axios'

const baseURL = `${import.meta.env.VITE_API_BASE_URL ?? ''}/api/v1`

export const http = axios.create({ baseURL, timeout: 10_000 })

/** Turn any thrown value into a message that is safe to show in the UI. */
export function toErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.code === 'ECONNABORTED') return 'The server took too long to respond.'
    if (!error.response) return 'Cannot reach the Apex Atlas API.'
    const detail = (error.response.data as { detail?: unknown } | undefined)?.detail
    if (typeof detail === 'string') return detail
    return `Request failed (${error.response.status}).`
  }
  return error instanceof Error ? error.message : 'Something went wrong.'
}
