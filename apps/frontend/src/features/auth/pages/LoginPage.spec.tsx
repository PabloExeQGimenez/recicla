import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { theme } from '../../../shared/styles/Theme'
import LoginPage from '../pages/LoginPage'

vi.mock('../../../shared/auth/authApi', () => ({
  login: vi.fn(),
}))

import { login } from '../../../shared/auth/authApi'
const mockLogin = vi.mocked(login)

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <ThemeProvider theme={theme}>
        <LoginPage />
      </ThemeProvider>
    </MemoryRouter>
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders email and password fields', () => {
    renderLogin()

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
  })

  it('renders submit button', () => {
    renderLogin()

    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('shows error message on login failure', async () => {
    mockLogin.mockRejectedValue(new Error('Credenciales inválidas'))

    const { container } = renderLogin()

    const form = container.querySelector('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Credenciales inválidas')
    })
  })

  it('calls login with email and password', async () => {
    mockLogin.mockResolvedValue({ token: 'abc', user: { id: '1', name: 'Admin', lastName: '', dni: null, email: 'admin@demo.com', role: 'ADMIN' } })

    const { container } = renderLogin()

    const form = container.querySelector('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('admin@demo.com', '')
    })
  })
})
