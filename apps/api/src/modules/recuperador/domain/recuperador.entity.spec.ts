import { Recuperador } from './recuperador.entity';

describe('Recuperador', () => {
  const defaultProps = {
    id: 'rec-1',
    name: 'Juan',
    lastName: 'Pérez',
    active: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    dni: '12345678',
    cuil: '20-12345678-9',
    birthdate: new Date('1990-05-15'),
    address: 'Calle Falsa 123',
    phone: '1234567890',
    email: 'juan@test.com',
    account: '001',
    route: 'Ruta A',
    program: 'Programa 1',
  };

  describe('constructor', () => {
    it('debería crear un recuperador válido', () => {
      const recuperador = new Recuperador(defaultProps);

      expect(recuperador.id).toBe('rec-1');
      expect(recuperador.name).toBe('Juan');
      expect(recuperador.lastName).toBe('Pérez');
      expect(recuperador.active).toBe(true);
    });
  });

  describe('update', () => {
    it('debería actualizar campos provistos', () => {
      const recuperador = new Recuperador(defaultProps);
      recuperador.update({ name: 'María', email: 'maria@test.com' });

      expect(recuperador.name).toBe('María');
      expect(recuperador.email).toBe('maria@test.com');
    });

    it('no debería sobreescribir campos no provistos', () => {
      const recuperador = new Recuperador(defaultProps);
      recuperador.update({ name: 'María' });

      expect(recuperador.lastName).toBe('Pérez');
      expect(recuperador.dni).toBe('12345678');
      expect(recuperador.email).toBe('juan@test.com');
    });

    it('debería actualizar updatedAt', () => {
      const recuperador = new Recuperador(defaultProps);
      const antes = recuperador.updatedAt;

      recuperador.update({ name: 'María' });

      expect(recuperador.updatedAt.getTime()).toBeGreaterThanOrEqual(
        antes.getTime(),
      );
    });
  });

  describe('activate', () => {
    it('debería activar el recuperador', () => {
      const recuperador = new Recuperador({ ...defaultProps, active: false });
      recuperador.activate();

      expect(recuperador.active).toBe(true);
    });

    it('debería actualizar updatedAt', () => {
      const recuperador = new Recuperador(defaultProps);
      const antes = recuperador.updatedAt;

      recuperador.activate();

      expect(recuperador.updatedAt.getTime()).toBeGreaterThanOrEqual(
        antes.getTime(),
      );
    });
  });

  describe('deactivate', () => {
    it('debería desactivar el recuperador', () => {
      const recuperador = new Recuperador(defaultProps);
      recuperador.deactivate();

      expect(recuperador.active).toBe(false);
    });

    it('debería actualizar updatedAt', () => {
      const recuperador = new Recuperador(defaultProps);
      const antes = recuperador.updatedAt;

      recuperador.deactivate();

      expect(recuperador.updatedAt.getTime()).toBeGreaterThanOrEqual(
        antes.getTime(),
      );
    });
  });
});
