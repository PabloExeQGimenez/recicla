import { Material } from './material.entity';

describe('Material', () => {
  const now = new Date('2026-01-01T00:00:00.000Z');

  const defaultProps = {
    id: 'mat-1',
    name: 'Cartón',
    currentPrice: 10,
    active: true,
    createdAt: now,
    updatedAt: now,
  };

  it('Material válido', () => {
    const material = new Material(defaultProps);

    expect(material.id).toBe('mat-1');
    expect(material.name).toBe('Cartón');
    expect(material.currentPrice).toBe(10);
    expect(material.active).toBe(true);
  });

  describe('changePrice', () => {
    it('cambio de precio', () => {
      const material = new Material(defaultProps);
      material.changePrice(20);

      expect(material.currentPrice).toBe(20);
    });

    it('error si el precio es negativo', () => {
      const material = new Material(defaultProps);

      expect(() => {
        material.changePrice(-1);
      }).toThrow('El precio debe ser mayor a 0');
    });
  });

  describe('activate', () => {
    it('activar el material', () => {
      const material = new Material({ ...defaultProps, active: false });
      material.activate();
      expect(material.active).toBe(true);
    });
  });

  describe('deactivate', () => {
    it('desactivar material', () => {
      const material = new Material(defaultProps);
      material.deactivate();
      expect(material.active).toBe(false);
    });
  });
});
