import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useMateriales } from './useMateriales'

const mockGetAll = vi.fn()

vi.mock('../services/materialService', () => ({
  default: { getAll: (...args: unknown[]) => mockGetAll(...args) },
}))

const mockMaterials = [
  { id: '1', name: 'Plástico', currentPrice: 100, active: true },
  { id: '2', name: 'Cartón', currentPrice: 50, active: false },
]

describe('useMateriales', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('starts with loading true and empty array', () => {
    mockGetAll.mockReturnValue(new Promise(() => {}))
    const { result } = renderHook(() => useMateriales())

    expect(result.current.loading).toBe(true)
    expect(result.current.materiales).toEqual([])
    expect(result.current.error).toBeNull()
  })

  it('loads materials on mount', async () => {
    mockGetAll.mockResolvedValue(mockMaterials)

    const { result } = renderHook(() => useMateriales())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.materiales).toEqual(mockMaterials)
    expect(result.current.error).toBeNull()
  })

  it('sets error on failure', async () => {
    mockGetAll.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useMateriales())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('No se cargaron los materiales')
    expect(result.current.materiales).toEqual([])
  })

  it('exposes setMateriales for manual updates', async () => {
    mockGetAll.mockResolvedValue(mockMaterials)

    const { result } = renderHook(() => useMateriales())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(typeof result.current.setMateriales).toBe('function')
  })
})
