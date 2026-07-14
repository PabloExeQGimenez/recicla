import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useSolicitudesPagos } from './useSolicitudesPagos'

const mockList = vi.fn()
const mockDelete = vi.fn()
const mockExportExcel = vi.fn()

vi.mock('../services/solicitudPagoService', () => ({
  default: {
    list: (...args: unknown[]) => mockList(...args),
    delete: (...args: unknown[]) => mockDelete(...args),
    exportExcel: (...args: unknown[]) => mockExportExcel(...args),
  },
}))

const mockResponse = {
  data: [
    { id: 's1', from: '2026-01-01', to: '2026-07-13', status: 'PAYMENT_REQUESTED', createdAt: '', totalAmount: 5000, itemsCount: 10 },
  ],
  page: 1,
  limit: 200,
  total: 1,
  totalPages: 1,
}

describe('useSolicitudesPagos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads solicitudes on mount', async () => {
    mockList.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useSolicitudesPagos())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual(mockResponse)
    expect(result.current.error).toBeNull()
  })

  it('sets error on failure', async () => {
    mockList.mockRejectedValue(new Error('Network'))

    const { result } = renderHook(() => useSolicitudesPagos())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Network')
  })

  it('deleteSolicitud calls service and refetches', async () => {
    mockList.mockResolvedValue(mockResponse)
    mockDelete.mockResolvedValue(undefined)

    const { result } = renderHook(() => useSolicitudesPagos())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.deleteSolicitud('s1')
    })

    expect(mockDelete).toHaveBeenCalledWith('s1')
    expect(mockList).toHaveBeenCalledTimes(2)
  })

  it('deleteSolicitud throws on failure', async () => {
    mockList.mockResolvedValue(mockResponse)
    mockDelete.mockRejectedValue(new Error('Cannot delete'))

    const { result } = renderHook(() => useSolicitudesPagos())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await expect(
      result.current.deleteSolicitud('s1')
    ).rejects.toThrow('Cannot delete')
  })

  it('exposes refetch and downloadExcel', async () => {
    mockList.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useSolicitudesPagos())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(typeof result.current.refetch).toBe('function')
    expect(typeof result.current.downloadExcel).toBe('function')
  })
})
