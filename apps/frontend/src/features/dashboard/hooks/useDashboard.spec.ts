import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useDashboard } from './useDashboard'

const mockGet = vi.fn()

vi.mock('../service/dashboard.service', () => ({
  dashboardService: { get: (...args: unknown[]) => mockGet(...args) },
}))

const mockData = {
  recoverersThisMonth: 5,
  totalKgThisMonth: 1234.5,
  pendingAmount: 2000,
  pendingPaymentRequests: 3,
  completedPaymentsAmount: 8000,
  materials: [{ name: 'Plástico', totalKg: 500 }],
}

describe('useDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads dashboard data on mount', async () => {
    mockGet.mockResolvedValue(mockData)

    const { result } = renderHook(() => useDashboard())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual(mockData)
    expect(result.current.error).toBeNull()
  })

  it('passes year and month params to service', async () => {
    mockGet.mockResolvedValue(mockData)

    renderHook(() => useDashboard(2026, 7))

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith(2026, 7)
    })
  })

  it('sets error on failure', async () => {
    mockGet.mockRejectedValue(new Error('Service down'))

    const { result } = renderHook(() => useDashboard())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Service down')
  })

  it('starts with loading true', () => {
    mockGet.mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useDashboard())

    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBeNull()
  })
})
