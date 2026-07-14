import { flattenPesaje } from './pesaje.mapper'
import type { PesajeAPIResponse } from '../types/pesaje.types'

const buildApiResponse = (overrides?: Partial<PesajeAPIResponse>): PesajeAPIResponse => ({
  id: 'pesaje-1',
  recuperadorId: 'rec-1',
  recuperador: { id: 'rec-1', name: 'Juan', lastName: 'Pérez' },
  status: 'PENDING',
  totalAmount: 500,
  date: '2026-07-13',
  createdAt: '2026-07-13T10:00:00Z',
  updatedAt: '2026-07-13T10:00:00Z',
  items: [
    {
      id: 'item-1',
      materialId: 'mat-1',
      material: { id: 'mat-1', name: 'Plástico' },
      weight: 5,
      pricePerKgAtMoment: 100,
      subtotal: 500,
    },
  ],
  ...overrides,
})

describe('flattenPesaje', () => {
  it('flattens API response to PesajeDTO array', () => {
    const result = flattenPesaje(buildApiResponse())

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      id: 'pesaje-1',
      itemId: 'item-1',
      recuperador: { id: 'rec-1', nombre: 'Juan', apellido: 'Pérez' },
      material: { id: 'mat-1', nombre: 'Plástico' },
      cantidad: 5,
      precio: 100,
      monto: 500,
      fecha: '2026-07-13',
      pago: 'pendiente',
    })
  })

  it('maps PAYMENT_REQUESTED status to solicitado', () => {
    const result = flattenPesaje(buildApiResponse({ status: 'PAYMENT_REQUESTED' }))
    expect(result[0].pago).toBe('solicitado')
  })

  it('maps PAID status to pagado', () => {
    const result = flattenPesaje(buildApiResponse({ status: 'PAID' }))
    expect(result[0].pago).toBe('pagado')
  })

  it('falls back to pendiente for unknown status', () => {
    const result = flattenPesaje(buildApiResponse({ status: 'UNKNOWN' }))
    expect(result[0].pago).toBe('pendiente')
  })

  it('creates one DTO per item', () => {
    const api = buildApiResponse({
      items: [
        { id: 'item-1', materialId: 'mat-1', material: { id: 'mat-1', name: 'Plástico' }, weight: 5, pricePerKgAtMoment: 100, subtotal: 500 },
        { id: 'item-2', materialId: 'mat-2', material: { id: 'mat-2', name: 'Cartón' }, weight: 3, pricePerKgAtMoment: 50, subtotal: 150 },
      ],
    })

    const result = flattenPesaje(api)
    expect(result).toHaveLength(2)
    expect(result[0].material.nombre).toBe('Plástico')
    expect(result[1].material.nombre).toBe('Cartón')
  })
})
