import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { theme } from '../../shared/styles/Theme'
import TopBar from './TopBar'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useLocation: () => ({ pathname: '/materiales', search: '', hash: '', state: null, key: 'test' }) }
})

const mockUser = {
  id: '1',
  name: 'Juan',
  lastName: 'Pérez',
  dni: '12345678',
  email: 'juan@test.com',
  role: 'ADMIN' as const,
}

function renderTopBar(user = mockUser) {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <TopBar user={user} onLogout={vi.fn()} />
      </ThemeProvider>
    </MemoryRouter>
  )
}

describe('TopBar', () => {
  it('renders user email', () => {
    renderTopBar()

    expect(screen.getByText('juan@test.com')).toBeInTheDocument()
  })

  it('renders role tag', () => {
    renderTopBar()

    expect(screen.getByText('ADMIN')).toBeInTheDocument()
  })

  it('renders page title from current path', () => {
    renderTopBar()

    expect(screen.getAllByText('Materiales').length).toBeGreaterThan(0)
  })

  it('renders breadcrumb with Inicio', () => {
    renderTopBar()

    expect(screen.getByText('Inicio')).toBeInTheDocument()
  })

  it('renders null user content gracefully', () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <TopBar user={null} onLogout={vi.fn()} />
        </ThemeProvider>
      </MemoryRouter>
    )

    expect(screen.queryByText('juan@test.com')).not.toBeInTheDocument()
  })
})
