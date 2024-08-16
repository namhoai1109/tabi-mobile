export function interpolate(endpoint: string, params: Record<string, any>): string {
  let interpolatedEndpoint = endpoint
  for (const [key, value] of Object.entries(params)) {
    interpolatedEndpoint = interpolatedEndpoint.replace(`:${key}`, value)
  }
  return interpolatedEndpoint
}
