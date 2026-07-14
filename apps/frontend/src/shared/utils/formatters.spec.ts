import { formatDate, safe, formatCurrency, formatNumber, formatPago, capitalize } from './formatters'

describe('formatDate', () => {
  it('returns "-" for null/undefined/empty', () => {
    expect(formatDate(null)).toBe('-')
    expect(formatDate(undefined)).toBe('-')
    expect(formatDate('')).toBe('-')
  })

  it('formats ISO date string', () => {
    expect(formatDate('2026-07-13')).toBe('13/07/2026')
  })

  it('formats Date object', () => {
    expect(formatDate(new Date(2026, 0, 5))).toBe('05/01/2026')
  })
})

describe('safe', () => {
  it('returns "-" for null/undefined/empty', () => {
    expect(safe(null)).toBe('-')
    expect(safe(undefined)).toBe('-')
    expect(safe('')).toBe('-')
  })

  it('trims and returns string', () => {
    expect(safe('  hello  ')).toBe('hello')
  })
})

describe('formatCurrency', () => {
  it('returns "-" for null/undefined', () => {
    expect(formatCurrency(null)).toBe('-')
    expect(formatCurrency(undefined)).toBe('-')
  })

  it('formats number as ARS currency', () => {
    const result = formatCurrency(1234.5)
    expect(result).toContain('1.234,5')
  })
})

describe('formatNumber', () => {
  it('returns "-" for null/undefined', () => {
    expect(formatNumber(null)).toBe('-')
    expect(formatNumber(undefined)).toBe('-')
  })

  it('formats number with locale', () => {
    const result = formatNumber(1234.567)
    expect(result).toContain('1.234,57')
  })
})

describe('formatPago', () => {
  it('capitalizes known statuses', () => {
    expect(formatPago('pendiente')).toBe('Pendiente')
    expect(formatPago('solicitado')).toBe('Solicitado')
    expect(formatPago('pagado')).toBe('Pagado')
  })

  it('returns unknown status as-is', () => {
    expect(formatPago('custom')).toBe('custom')
  })
})

describe('capitalize', () => {
  it('capitalizes first letter', () => {
    expect(capitalize('hello')).toBe('Hello')
  })

  it('returns empty string for empty input', () => {
    expect(capitalize('')).toBe('')
  })
})
