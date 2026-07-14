import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from 'styled-components'
import { theme } from '../../../shared/styles/Theme'
import { MaterialFormModal } from '../../materiales/components/MaterialFormModal'

vi.mock('../../../shared/UI/Modal', () => ({
  default: ({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) =>
    isOpen ? <div data-testid="modal">{children}</div> : null,
}))

function renderModal(props: Partial<React.ComponentProps<typeof MaterialFormModal>> = {}) {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSubmit: vi.fn().mockResolvedValue(undefined),
    material: null,
    ...props,
  }

  return {
    ...render(
      <ThemeProvider theme={theme}>
        <MaterialFormModal {...defaultProps} />
      </ThemeProvider>
    ),
    props: defaultProps,
  }
}

describe('MaterialFormModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders "Agregar material" title when creating', () => {
    renderModal()

    expect(screen.getByText('Agregar material')).toBeInTheDocument()
  })

  it('renders "Editar material" title when editing', () => {
    renderModal({ material: { id: '1', name: 'Plástico', currentPrice: 100, active: true } })

    expect(screen.getByText('Editar material')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    renderModal({ isOpen: false })

    expect(screen.queryByText('Agregar material')).not.toBeInTheDocument()
  })

  it('calls onSubmit with valid data', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    const { container } = renderModal({ onSubmit })

    const nameInput = screen.getByRole('textbox')
    const priceInput = screen.getByRole('spinbutton')
    await userEvent.setup().type(nameInput, 'Plástico')
    await userEvent.setup().type(priceInput, '150')

    const form = container.querySelector('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ name: 'Plástico', currentPrice: 150 }))
    })
  })

  it('shows validation error for empty name', async () => {
    const { container } = renderModal()

    const form = container.querySelector('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      expect(screen.getByText(/nombre es obligatorio/i)).toBeInTheDocument()
    })
  })
})
