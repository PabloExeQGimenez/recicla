import { pesajeFormSchema } from './pesaje.schema'

describe('pesajeFormSchema', () => {
  const validItem = {
    tempId: '1',
    materialId: 'mat-1',
    materialLabel: 'Plástico',
    precio: 100,
    cantidad: 5,
    subtotal: 500,
  }

  const validData = {
    recuperadorId: 'rec-1',
    fecha: '2026-07-13',
    items: [validItem],
  }

  it('accepts valid data', () => {
    const result = pesajeFormSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('rejects empty recuperadorId', () => {
    const result = pesajeFormSchema.safeParse({ ...validData, recuperadorId: '' })
    expect(result.success).toBe(false)
  })

  it('rejects future date', () => {
    const result = pesajeFormSchema.safeParse({ ...validData, fecha: '2099-12-31' })
    expect(result.success).toBe(false)
  })

  it('rejects empty items array', () => {
    const result = pesajeFormSchema.safeParse({ ...validData, items: [] })
    expect(result.success).toBe(false)
  })

  it('rejects item with zero cantidad', () => {
    const result = pesajeFormSchema.safeParse({
      ...validData,
      items: [{ ...validItem, cantidad: 0 }],
    })
    expect(result.success).toBe(false)
  })

  it('rejects item with empty materialId', () => {
    const result = pesajeFormSchema.safeParse({
      ...validData,
      items: [{ ...validItem, materialId: '' }],
    })
    expect(result.success).toBe(false)
  })
})
