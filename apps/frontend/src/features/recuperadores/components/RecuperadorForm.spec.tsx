import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { theme } from '../../../shared/styles/Theme'
import RecuperadorForm from './RecuperadorForm'

function renderForm(props: Partial<React.ComponentProps<typeof RecuperadorForm>> = {}) {
  const defaultProps = {
    onSubmit: vi.fn().mockResolvedValue(undefined),
    onCancel: vi.fn(),
    submitLabel: 'Crear',
    ...props,
  }

  return {
    ...render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <RecuperadorForm {...defaultProps} />
        </ThemeProvider>
      </MemoryRouter>
    ),
    props: defaultProps,
  }
}

describe('RecuperadorForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders name and lastName fields', () => {
    renderForm()

    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument()
  })

  it('renders submit button with default label', () => {
    renderForm()

    expect(screen.getByRole('button', { name: /crear/i })).toBeInTheDocument()
  })

  it('renders custom submit label', () => {
    renderForm({ submitLabel: 'Guardar' })

    expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument()
  })

  it('shows validation errors on empty required fields', async () => {
    const { container } = renderForm()

    const form = container.querySelector('form')!
    fireEvent.submit(form)

    expect(await screen.findByText(/el nombre es obligatorio/i)).toBeInTheDocument()
    expect(screen.getByText(/el apellido es obligatorio/i)).toBeInTheDocument()
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()

    renderForm({ onCancel })

    await user.click(screen.getByRole('button', { name: /cancelar/i }))

    expect(onCancel).toHaveBeenCalled()
  })
})
