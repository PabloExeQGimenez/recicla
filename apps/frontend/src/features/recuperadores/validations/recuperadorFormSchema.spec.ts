import { recuperadorFormSchema } from './recuperador.schema'

describe('recuperadorFormSchema', () => {
  const validData = {
    name: 'Juan',
    lastName: 'Pérez',
  }

  it('accepts valid data with only required fields', () => {
    const result = recuperadorFormSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('accepts valid data with all fields', () => {
    const result = recuperadorFormSchema.safeParse({
      ...validData,
      dni: '12345678',
      cuil: '20-12345678-9',
      birthdate: '1990-01-01',
      address: 'Calle 123',
      phone: '1234567890',
      email: 'juan@test.com',
      account: '123456',
      route: 'Ruta A',
      program: 'Social',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = recuperadorFormSchema.safeParse({ name: '', lastName: 'Pérez' })
    expect(result.success).toBe(false)
  })

  it('rejects empty lastName', () => {
    const result = recuperadorFormSchema.safeParse({ name: 'Juan', lastName: '' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email format', () => {
    const result = recuperadorFormSchema.safeParse({
      ...validData,
      email: 'not-an-email',
    })
    expect(result.success).toBe(false)
  })
})
