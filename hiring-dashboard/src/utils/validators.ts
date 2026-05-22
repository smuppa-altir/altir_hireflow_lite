/** True for http(s) URLs */
export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value.trim())
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/** API origin without /api suffix (for uploads static files) */
export function getApiOrigin(): string {
  const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api'
  return apiBase.replace(/\/api\/?$/, '')
}

/** Normalize resume path to absolute URL for API validation */
export function normalizeResumeUrl(value: string): string {
  const trimmed = value.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  if (trimmed.startsWith('/')) {
    return `${getApiOrigin()}${trimmed}`
  }
  return trimmed
}

/** Build a URL suitable for opening the resume in a new browser tab */
export function resolveResumeViewUrl(resumeUrl: string): string {
  const trimmed = resumeUrl.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  if (trimmed.startsWith('/')) {
    return `${getApiOrigin()}${trimmed}`
  }
  return trimmed
}

export function hasResumeAttached(resumeUrl?: string | null): boolean {
  return Boolean(resumeUrl?.trim())
}
