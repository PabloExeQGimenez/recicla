import { authStorage, AuthUser } from './authStorage'

const mockUser: AuthUser = {
  id: '1',
  name: 'Juan',
  lastName: 'Pérez',
  dni: '12345678',
  email: 'juan@test.com',
  role: 'ADMIN',
}

describe('authStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('setSession', () => {
    it('stores token and user in localStorage', () => {
      authStorage.setSession('abc-123', mockUser)

      expect(localStorage.getItem('token')).toBe('abc-123')
      expect(JSON.parse(localStorage.getItem('user')!)).toEqual(mockUser)
    })
  })

  describe('getToken', () => {
    it('returns null when no token', () => {
      expect(authStorage.getToken()).toBeNull()
    })

    it('returns stored token', () => {
      localStorage.setItem('token', 'my-token')
      expect(authStorage.getToken()).toBe('my-token')
    })
  })

  describe('getUser', () => {
    it('returns null when no user', () => {
      expect(authStorage.getUser()).toBeNull()
    })

    it('returns null for invalid JSON', () => {
      localStorage.setItem('user', 'not-json')
      expect(authStorage.getUser()).toBeNull()
    })

    it('returns parsed user for valid JSON', () => {
      localStorage.setItem('user', JSON.stringify(mockUser))
      expect(authStorage.getUser()).toEqual(mockUser)
    })
  })

  describe('isAuthenticated', () => {
    it('returns false when no token', () => {
      expect(authStorage.isAuthenticated()).toBe(false)
    })

    it('returns true when token exists', () => {
      localStorage.setItem('token', 'some-token')
      expect(authStorage.isAuthenticated()).toBe(true)
    })
  })

  describe('clearSession', () => {
    it('removes token and user from localStorage', () => {
      localStorage.setItem('token', 'abc')
      localStorage.setItem('user', JSON.stringify(mockUser))

      authStorage.clearSession()

      expect(localStorage.getItem('token')).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
    })
  })
})
