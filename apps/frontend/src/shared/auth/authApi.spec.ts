import { describe, it, expect, vi, beforeEach } from 'vitest'
import { login, logout } from './authApi'
import { authStorage } from './authStorage'

vi.mock('../lib/api', () => ({
  apiFetch: vi.fn(),
}))

import { apiFetch } from '../lib/api'

const mockUser = {
  id: '1',
  name: 'Juan',
  lastName: 'Pérez',
  dni: '12345678',
  email: 'juan@test.com',
  role: 'ADMIN' as const,
}

describe('login', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('calls apiFetch with correct endpoint and body', async () => {
    vi.mocked(apiFetch).mockResolvedValue({ token: 'abc', user: mockUser })

    await login('juan@test.com', 'secret123')

    expect(apiFetch).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'juan@test.com', password: 'secret123' }),
    })
  })

  it('stores session in localStorage', async () => {
    vi.mocked(apiFetch).mockResolvedValue({ token: 'abc', user: mockUser })

    await login('juan@test.com', 'secret123')

    expect(authStorage.getToken()).toBe('abc')
    expect(authStorage.getUser()).toEqual(mockUser)
  })

  it('dispatches auth:login event', async () => {
    vi.mocked(apiFetch).mockResolvedValue({ token: 'abc', user: mockUser })
    const handler = vi.fn()
    window.addEventListener('auth:login', handler)

    await login('juan@test.com', 'secret123')

    expect(handler).toHaveBeenCalled()
    window.removeEventListener('auth:login', handler)
  })
})

describe('logout', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('clears session from localStorage', () => {
    authStorage.setSession('abc', mockUser)
    logout()

    expect(authStorage.getToken()).toBeNull()
    expect(authStorage.getUser()).toBeNull()
  })

  it('dispatches auth:logout event', () => {
    const handler = vi.fn()
    window.addEventListener('auth:logout', handler)

    logout()

    expect(handler).toHaveBeenCalled()
    window.removeEventListener('auth:logout', handler)
  })
})
