import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { theme } from '../../shared/styles/Theme'
import { UserAvatar } from './UserAvatar'

function renderAvatar(email = 'admin@test.com', size?: number) {
  return render(
    <ThemeProvider theme={theme}>
      <UserAvatar email={email} {...(size !== undefined ? { size } : {})} />
    </ThemeProvider>
  )
}

describe('UserAvatar', () => {
  it('renders first letter of email as initial', () => {
    renderAvatar('admin@test.com')

    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('capitalizes the initial', () => {
    renderAvatar('juan@test.com')

    expect(screen.getByText('J')).toBeInTheDocument()
  })

  it('renders avatar element', () => {
    renderAvatar()

    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('handles single character email', () => {
    renderAvatar('a@test.com')

    expect(screen.getByText('A')).toBeInTheDocument()
  })
})
