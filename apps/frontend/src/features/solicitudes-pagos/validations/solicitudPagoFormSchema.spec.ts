import { solicitudPagoFormSchema } from './solicitud-pago.schema'

describe('solicitudPagoFormSchema', () => {
  it('accepts valid date range', () => {
    const result = solicitudPagoFormSchema.safeParse({ from: '2026-01-01', to: '2026-07-13' })
    expect(result.success).toBe(true)
  })

  it('accepts same from and to date', () => {
    const result = solicitudPagoFormSchema.safeParse({ from: '2026-07-13', to: '2026-07-13' })
    expect(result.success).toBe(true)
  })

  it('rejects from > to', () => {
    const result = solicitudPagoFormSchema.safeParse({ from: '2026-07-13', to: '2026-01-01' })
    expect(result.success).toBe(false)
  })

  it('rejects empty from field', () => {
    const result = solicitudPagoFormSchema.safeParse({ from: '', to: '2026-07-13' })
    expect(result.success).toBe(false)
  })
})
