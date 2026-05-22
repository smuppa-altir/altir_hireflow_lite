/** Format as DD/MM/YYYY */
export function formatDateDDMMYYYY(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(d.getTime())) return ''
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

/** Format as DD/MM/YYYY, HH:mm (24h) */
export function formatDateTimeDDMMYYYY(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(d.getTime())) return ''
  const datePart = formatDateDDMMYYYY(d)
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${datePart}, ${hours}:${minutes}`
}

/** Parse DD/MM/YYYY → YYYY-MM-DD for API / date inputs */
export function parseDDMMYYYY(value: string): string | null {
  const trimmed = value.trim()
  const match = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (!match) return null
  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])
  if (month < 1 || month > 12 || day < 1 || day > 31) return null
  const d = new Date(year, month - 1, day)
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/** YYYY-MM-DD (from native date input) → DD/MM/YYYY */
export function isoDateToDDMMYYYY(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`
}

/** Local calendar day bounds (for interview filters / dashboard KPI) */
export function getLocalDayBoundsISO(date: Date = new Date()): {
  dateFrom: string
  dateTo: string
} {
  const y = date.getFullYear()
  const m = date.getMonth()
  const d = date.getDate()
  return {
    dateFrom: new Date(y, m, d, 0, 0, 0, 0).toISOString(),
    dateTo: new Date(y, m, d, 23, 59, 59, 999).toISOString(),
  }
}

/** Accept DD/MM/YYYY or YYYY-MM-DD and return YYYY-MM-DD */
export function normalizeDateInput(value: string): string | null {
  if (!value.trim()) return null
  if (value.includes('/')) return parseDDMMYYYY(value)
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  return null
}
