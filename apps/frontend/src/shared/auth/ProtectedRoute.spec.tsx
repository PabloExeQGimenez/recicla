import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

vi.mock('./useAuth', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from './useAuth'
const mockUseAuth = vi.mocked(useAuth)

function renderAuthenticated(isAuth: boolean) {
  mockUseAuth.mockReturnValue({
    isAuth,
    user: isAuth
      ? { id: '1', name: 'Juan', lastName: 'Pérez', dni: null, email: 'juan@test.com', role: 'ADMIN' as const }
      : null,
    logout: vi.fn(),
  })

  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>Dashboard Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects to /login when not authenticated', () => {
    renderAuthenticated(false)

    expect(screen.queryByText('Dashboard Content')).not.toBeInTheDocument()
  })

  it('renders child when authenticated', () => {
    renderAuthenticated(true)

    expect(screen.getByText('Dashboard Content')).toBeInTheDocument()
  })
})
