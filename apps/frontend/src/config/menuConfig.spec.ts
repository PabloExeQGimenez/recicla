import { getMenuItems } from './menuConfig'

describe('getMenuItems', () => {
  it('returns all items for ADMIN', () => {
    const items = getMenuItems('ADMIN')
    expect(items.length).toBe(8)
  })

  it('excludes admin-only items for OPERADOR', () => {
    const items = getMenuItems('OPERADOR')
    const paths = items.map((i) => i.path)

    expect(paths).not.toContain('/solicitudes-pagos')
    expect(paths).not.toContain('/usuarios')
    expect(items.length).toBe(6)
  })

  it('always includes items without roles restriction', () => {
    const adminItems = getMenuItems('ADMIN')
    const operadorItems = getMenuItems('OPERADOR')

    const commonPaths = ['/', '/pesajes/cargar', '/solicitudes-pagos/lista', '/pesajes', '/recuperadores', '/materiales']

    for (const path of commonPaths) {
      expect(adminItems.some((i) => i.path === path)).toBe(true)
      expect(operadorItems.some((i) => i.path === path)).toBe(true)
    }
  })
})
