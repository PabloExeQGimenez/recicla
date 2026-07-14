import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { theme } from '../../shared/styles/Theme'
import Menu from './Menu'

vi.mock('../../shared/auth/useAuth', () => ({
  useAuth: () => ({
    isAuth: true,
    user: { id: '1', name: 'Admin', lastName: '', dni: null, email: 'admin@test.com', role: 'ADMIN' },
    logout: vi.fn(),
  }),
}))

function renderMenu() {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <Menu />
      </ThemeProvider>
    </MemoryRouter>
  )
}

describe('Menu', () => {
  it('renders app name and version', () => {
    renderMenu()

    expect(screen.getByText(/Recicla/)).toBeInTheDocument()
    expect(screen.getByText(/v1.0.0/)).toBeInTheDocument()
  })

  it('renders menu items for ADMIN', () => {
    renderMenu()

    expect(screen.getByText('Inicio')).toBeInTheDocument()
    expect(screen.getByText('Pesajes')).toBeInTheDocument()
    expect(screen.getByText('Materiales')).toBeInTheDocument()
    expect(screen.getByText('Crear pago')).toBeInTheDocument()
    expect(screen.getByText('Usuarios')).toBeInTheDocument()
  })

  it('renders logo image', () => {
    renderMenu()

    expect(screen.getByAltText(/Recicladores/)).toBeInTheDocument()
  })
})
