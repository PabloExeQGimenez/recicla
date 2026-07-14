import toCreateRecuperadorPayload from './recuperador.mapper'

describe('toCreateRecuperadorPayload', () => {
  it('trims required fields', () => {
    const result = toCreateRecuperadorPayload({
      name: '  Juan  ',
      lastName: '  Pérez  ',
    })

    expect(result.name).toBe('Juan')
    expect(result.lastName).toBe('Pérez')
  })

  it('converts empty optional strings to undefined', () => {
    const result = toCreateRecuperadorPayload({
      name: 'Juan',
      lastName: 'Pérez',
      dni: '   ',
      cuil: '',
      address: '  ',
      phone: undefined,
    })

    expect(result.dni).toBeUndefined()
    expect(result.cuil).toBeUndefined()
    expect(result.address).toBeUndefined()
    expect(result.phone).toBeUndefined()
  })

  it('keeps valid optional values', () => {
    const result = toCreateRecuperadorPayload({
      name: 'Juan',
      lastName: 'Pérez',
      dni: '12345678',
      email: 'juan@test.com',
      phone: '1234567890',
    })

    expect(result.dni).toBe('12345678')
    expect(result.email).toBe('juan@test.com')
    expect(result.phone).toBe('1234567890')
  })
})
