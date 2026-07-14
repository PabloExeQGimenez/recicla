import { PesajeItem } from './pesaje-item.vo';

describe('PesajeItem', () => {
  it('debería crear un item válido', () => {
    const item = new PesajeItem({
      materialId: 'mat-1',
      weight: 100,
      pricePerKgAtMoment: 85,
    });

    expect(item.materialId).toBe('mat-1');
    expect(item.weight).toBe(100);
    expect(item.pricePerKgAtMoment).toBe(85);
  });

  it('debería calcular subtotal', () => {
    const item = new PesajeItem({
      materialId: 'mat-1',
      weight: 10,
      pricePerKgAtMoment: 5,
    });

    expect(item.subtotal).toBe(50);
  });

  describe('validaciones del constructor', () => {
    it('error si el peso es cero', () => {
      expect(() => {
        new PesajeItem({
          materialId: 'mat-1',
          weight: 0,
          pricePerKgAtMoment: 15,
        });
      }).toThrow('El peso debe ser mayor a cero');
    });

    it('deberia lanzar error si el peso es negativo', () => {
      expect(() => {
        new PesajeItem({
          materialId: 'mat-1',
          weight: -1,
          pricePerKgAtMoment: 5,
        });
      }).toThrow('El peso debe ser mayor a cero');
    });

    it('error si el precio es cero', () => {
      expect(() => {
        new PesajeItem({
          materialId: 'mat-1',
          weight: 10,
          pricePerKgAtMoment: 0,
        });
      }).toThrow('El precio debe ser mayor a cero');
    });

    it('error si el precio es negativo', () => {
      expect(() => {
        new PesajeItem({
          materialId: 'mat-1',
          weight: 10,
          pricePerKgAtMoment: -1,
        });
      }).toThrow('El precio debe ser mayor a cero');
    });

    it('error si materialId está vacío', () => {
      expect(() => {
        new PesajeItem({
          materialId: '  ',
          weight: 10,
          pricePerKgAtMoment: 5,
        });
      }).toThrow('El material es obligatorio');
    });
  });
});
