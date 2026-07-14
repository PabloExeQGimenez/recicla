import { z } from 'zod'
import { zodIssuesToFieldErrors, zodErrorToFieldErrors } from './zodHelpers'

describe('zodIssuesToFieldErrors', () => {
  it('returns empty object for empty issues', () => {
    expect(zodIssuesToFieldErrors([])).toEqual({})
  })

  it('maps issue path to message', () => {
    const issues = [{ path: ['name'], message: 'Required', code: 'too_small' as const }]
    expect(zodIssuesToFieldErrors(issues)).toEqual({ name: 'Required' })
  })

  it('keeps first error per field', () => {
    const issues = [
      { path: ['name'], message: 'First error', code: 'too_small' as const },
      { path: ['name'], message: 'Second error', code: 'too_small' as const },
    ]
    expect(zodIssuesToFieldErrors(issues)).toEqual({ name: 'First error' })
  })

  it('ignores issues with non-string path keys', () => {
    const issues = [
      { path: [0], message: 'Array index error', code: 'too_small' as const },
    ]
    expect(zodIssuesToFieldErrors(issues)).toEqual({})
  })
})

describe('zodErrorToFieldErrors', () => {
  it('delegates to zodIssuesToFieldErrors', () => {
    const schema = z.object({ email: z.string().email() })
    const result = schema.safeParse({ email: 'invalid' })

    if (!result.success) {
      const fieldErrors = zodErrorToFieldErrors(result.error)
      expect(fieldErrors).toHaveProperty('email')
      expect(typeof fieldErrors.email).toBe('string')
    }
  })
})
