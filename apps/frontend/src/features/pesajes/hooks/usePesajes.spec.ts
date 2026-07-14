import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { usePesajes } from './usePesajes'

const mockList = vi.fn()
const mockDeleteItem = vi.fn()
const mockExportCsv = vi.fn()
const mockExportExcel = vi.fn()
const mockExportPdf = vi.fn()

vi.mock('../services/pesaje.service', () => ({
  pesajesService: {
    list: (...args: unknown[]) => mockList(...args),
    deleteItem: (...args: unknown[]) => mockDeleteItem(...args),
    exportCsv: (...args: unknown[]) => mockExportCsv(...args),
    exportExcel: (...args: unknown[]) => mockExportExcel(...args),
    exportPdf: (...args: unknown[]) => mockExportPdf(...args),
  },
}))

vi.mock('../../../shared/UI/Toast/useToast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}))

const mockResponse = {
  data: [
    { id: 'p1', itemId: 'i1', recuperador: { id: 'r1', nombre: 'Juan', apellido: 'Pérez' }, material: { id: 'm1', nombre: 'Plástico' }, cantidad: 5, precio: 100, monto: 500, fecha: '2026-07-13', pago: 'pendiente' },
  ],
  meta: { pagina: 1, total: 1, totalItems: 1, limite: 10, paginasTotales: 1 },
}

describe('usePesajes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads pesajes on mount', async () => {
    mockList.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => usePesajes())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual(mockResponse)
    expect(result.current.error).toBeNull()
  })

  it('sets error on failure', async () => {
    mockList.mockRejectedValue(new Error('fail'))

    const { result } = renderHook(() => usePesajes())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBeTruthy()
  })

  it('deletePesajeItem removes item optimistically', async () => {
    mockList.mockResolvedValue(mockResponse)
    mockDeleteItem.mockResolvedValue(undefined)

    const { result } = renderHook(() => usePesajes())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.deletePesajeItem('p1', 'i1')
    })

    expect(mockDeleteItem).toHaveBeenCalledWith('i1')
  })

  it('exposes pagination and export controls', async () => {
    mockList.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => usePesajes())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(typeof result.current.setPage).toBe('function')
    expect(typeof result.current.setLimit).toBe('function')
    expect(typeof result.current.refresh).toBe('function')
    expect(typeof result.current.downloadCsv).toBe('function')
    expect(typeof result.current.confirmExport).toBe('function')
    expect(typeof result.current.openExportDialog).toBe('function')
    expect(typeof result.current.closeExportDialog).toBe('function')
  })
})
