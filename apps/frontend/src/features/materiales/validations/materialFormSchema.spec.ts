import { materialFormSchema } from './material.schema'

describe('materialFormSchema', () => {
  it('accepts valid data', () => {
    const result = materialFormSchema.safeParse({ name: 'Plástico', currentPrice: 100 })
    expect(result.success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = materialFormSchema.safeParse({ name: '', currentPrice: 100 })
    expect(result.success).toBe(false)
  })

  it('rejects whitespace-only name', () => {
    const result = materialFormSchema.safeParse({ name: '   ', currentPrice: 100 })
    expect(result.success).toBe(false)
  })

  it('rejects negative price', () => {
    const result = materialFormSchema.safeParse({ name: 'Plástico', currentPrice: -1 })
    expect(result.success).toBe(false)
  })

  it('accepts zero price', () => {
    const result = materialFormSchema.safeParse({ name: 'Plástico', currentPrice: 0 })
    expect(result.success).toBe(true)
  })
})
