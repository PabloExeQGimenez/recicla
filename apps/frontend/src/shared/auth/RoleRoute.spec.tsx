import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import RoleRoute from './RoleRoute'

vi.mock('./useAuth', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from './useAuth'
const mockUseAuth = vi.mocked(useAuth)

const adminUser = {
  id: '1',
  name: 'Juan',
  lastName: 'Pérez',
  dni: null,
  email: 'juan@test.com',
  role: 'ADMIN' as const,
}

const operadorUser = {
  id: '2',
  name: 'María',
  lastName: 'López',
  dni: null,
  email: 'maria@test.com',
  role: 'OPERADOR' as const,
}

function renderWithRoute(user: ReturnType<typeof useAuth>, allow: ('ADMIN' | 'OPERADOR')[] = ['ADMIN']) {
  mockUseAuth.mockReturnValue(user)

  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route element={<RoleRoute allow={allow} />}>
          <Route path="/admin" element={<div>Protected Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

describe('RoleRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects to /login when not authenticated', () => {
    renderWithRoute({ isAuth: false, user: null, logout: vi.fn() })

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('redirects to /403 when role not in allow list', () => {
    renderWithRoute(
      { isAuth: true, user: operadorUser, logout: vi.fn() },
      ['ADMIN']
    )

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('renders child when role matches', () => {
    renderWithRoute(
      { isAuth: true, user: adminUser, logout: vi.fn() },
      ['ADMIN']
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('renders child when role is in allow list (multiple roles)', () => {
    renderWithRoute(
      { isAuth: true, user: operadorUser, logout: vi.fn() },
      ['ADMIN', 'OPERADOR']
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
})
