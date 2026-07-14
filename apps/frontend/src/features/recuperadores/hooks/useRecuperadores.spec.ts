import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import useRecuperadores from './useRecuperadores'

const mockGetAll = vi.fn()
const mockCreate = vi.fn()
const mockUpdate = vi.fn()

vi.mock('../services/recuperadores.service', () => ({
  recuperadoresService: {
    getAll: (...args: unknown[]) => mockGetAll(...args),
    create: (...args: unknown[]) => mockCreate(...args),
    update: (...args: unknown[]) => mockUpdate(...args),
  },
}))

const mockPage = {
  data: [
    { id: '1', name: 'Juan', lastName: 'Pérez', active: true, createdAt: '', updatedAt: '' },
  ],
  total: 1,
  totalPages: 1,
  page: 1,
  limit: 10,
}

describe('useRecuperadores', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads recuperadores on mount', async () => {
    mockGetAll.mockResolvedValue(mockPage)

    const { result } = renderHook(() => useRecuperadores())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.recuperadores).toEqual(mockPage.data)
    expect(result.current.totalPages).toBe(1)
    expect(result.current.total).toBe(1)
    expect(result.current.error).toBeNull()
  })

  it('sets error on failure', async () => {
    mockGetAll.mockRejectedValue(new Error('Network'))

    const { result } = renderHook(() => useRecuperadores())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toContain('Network')
  })

  it('calls service with correct params', async () => {
    mockGetAll.mockResolvedValue(mockPage)

    renderHook(() => useRecuperadores())

    await waitFor(() => {
      expect(mockGetAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: '',
        active: true,
      })
    })
  })

  it('exposes pagination controls', async () => {
    mockGetAll.mockResolvedValue(mockPage)

    const { result } = renderHook(() => useRecuperadores())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(typeof result.current.setPage).toBe('function')
    expect(typeof result.current.setSearch).toBe('function')
    expect(typeof result.current.setActive).toBe('function')
    expect(typeof result.current.refetch).toBe('function')
    expect(typeof result.current.create).toBe('function')
    expect(typeof result.current.update).toBe('function')
  })
})
