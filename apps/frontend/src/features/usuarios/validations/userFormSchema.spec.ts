import { userFormSchema } from './user.schema'

describe('userFormSchema', () => {
  const validData = {
    name: 'Juan',
    lastName: 'Pérez',
    email: 'juan@test.com',
    password: 'secret123',
    role: 'ADMIN' as const,
  }

  it('accepts valid data', () => {
    const result = userFormSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = userFormSchema.safeParse({ ...validData, name: '' })
    expect(result.success).toBe(false)
  })

  it('rejects empty lastName', () => {
    const result = userFormSchema.safeParse({ ...validData, lastName: '' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = userFormSchema.safeParse({ ...validData, email: 'not-email' })
    expect(result.success).toBe(false)
  })

  it('rejects short password', () => {
    const result = userFormSchema.safeParse({ ...validData, password: '12345' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid role', () => {
    const result = userFormSchema.safeParse({ ...validData, role: 'INVALID' })
    expect(result.success).toBe(false)
  })
})
