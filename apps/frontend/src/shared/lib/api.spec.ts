import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { apiFetch, apiFetchBlob } from './api'
import { authStorage } from '../auth/authStorage'

const API_URL = '/api'

describe('apiFetch', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls fetch with correct URL and headers', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    )

    const result = await apiFetch('/test')

    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${API_URL}/test`,
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    )
    expect(result).toEqual({ ok: true })
  })

  it('includes Authorization header when token exists', async () => {
    localStorage.setItem('token', 'my-token')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ data: 1 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    )

    await apiFetch('/test')

    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${API_URL}/test`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer my-token',
        }),
      })
    )
  })

  it('clears session and dispatches auth:logout on 401', async () => {
    localStorage.setItem('token', 'my-token')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('Unauthorized', { status: 401 })
    )
    const handler = vi.fn()
    window.addEventListener('auth:logout', handler)

    await expect(apiFetch('/test')).rejects.toThrow()

    expect(authStorage.getToken()).toBeNull()
    expect(handler).toHaveBeenCalled()
    window.removeEventListener('auth:logout', handler)
  })

  it('throws ApiError with status code on non-ok response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    )

    try {
      await apiFetch('/test')
    } catch (err: unknown) {
      const apiErr = err as { statusCode?: number; message: string }
      expect(apiErr.statusCode).toBe(404)
      expect(apiErr.message).toBe('Not found')
    }
  })

  it('returns undefined for 204 response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, { status: 204 })
    )

    const result = await apiFetch('/test')
    expect(result).toBeUndefined()
  })
})

describe('apiFetchBlob', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns blob on success', async () => {
    const blob = new Blob(['file content'], { type: 'application/pdf' })
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(blob, { status: 200 })
    )

    const result = await apiFetchBlob('/export')

    expect(result).toBeInstanceOf(Blob)
  })

  it('throws on error response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    )

    await expect(apiFetchBlob('/export')).rejects.toThrow()
  })
})
