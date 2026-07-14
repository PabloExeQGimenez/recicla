import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCreateMaterial } from './useCreateMaterial'

const mockCreate = vi.fn()

vi.mock('../services/materialService', () => ({
  default: { create: (...args: unknown[]) => mockCreate(...args) },
}))

const newMaterial = { id: '3', name: 'Vidrio', currentPrice: 30, active: true }

describe('useCreateMaterial', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls service and appends to state', async () => {
    mockCreate.mockResolvedValue(newMaterial)
    const setMateriales = vi.fn()

    const { result } = renderHook(() => useCreateMaterial(setMateriales))

    let created: unknown
    await act(async () => {
      created = await result.current.create({ name: 'Vidrio', currentPrice: 30 })
    })

    expect(mockCreate).toHaveBeenCalledWith({ name: 'Vidrio', currentPrice: 30 })
    expect(setMateriales).toHaveBeenCalledWith(expect.any(Function))
    expect(created).toEqual(newMaterial)
  })

  it('propagates service errors', async () => {
    mockCreate.mockRejectedValue(new Error('Duplicate name'))
    const setMateriales = vi.fn()

    const { result } = renderHook(() => useCreateMaterial(setMateriales))

    await expect(
      act(async () => {
        await result.current.create({ name: 'Vidrio', currentPrice: 30 })
      })
    ).rejects.toThrow('Duplicate name')
  })
})
