import { CreateRecuperadorUseCase } from './create-recuperador.usecase';
import { RecuperadorRepository } from '../domain/recuperador.repository';
import { ConflictException } from '@nestjs/common';

describe('CreateRecuperadorUseCase', () => {
  let useCase: CreateRecuperadorUseCase;
  let mockRepository: jest.Mocked<RecuperadorRepository>;

  beforeEach(() => {
    mockRepository = { findByDni: jest.fn(), save: jest.fn() } as any;
    useCase = new CreateRecuperadorUseCase(mockRepository);
  });

  it('debería lanzar ConflictException si el DNI ya existe', async () => {
    mockRepository.findByDni.mockResolvedValue({
      id: 'rec-1',
      dni: '12345678',
    } as any);

    await expect(
      useCase.execute({ name: 'Juan', lastName: 'Pérez', dni: '12345678' }),
    ).rejects.toThrow(ConflictException);
    await expect(
      useCase.execute({ name: 'Juan', lastName: 'Pérez', dni: '12345678' }),
    ).rejects.toThrow('Ya existe un recuperador con ese dni');
  });

  it('debería crear el recuperador sin DNI sin validar duplicados', async () => {
    mockRepository.save.mockResolvedValue(undefined);

    const result = await useCase.execute({ name: 'Juan', lastName: 'Pérez' });

    expect(result.name).toBe('Juan');
    expect(result.lastName).toBe('Pérez');
    expect(result.active).toBe(true);
    expect(mockRepository.findByDni).not.toHaveBeenCalled();
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('debería crear el recuperador con DNI único', async () => {
    mockRepository.findByDni.mockResolvedValue(null);
    mockRepository.save.mockResolvedValue(undefined);

    const result = await useCase.execute({
      name: 'Juan',
      lastName: 'Pérez',
      dni: '12345678',
    });

    expect(result.dni).toBe('12345678');
    expect(mockRepository.findByDni).toHaveBeenCalledWith('12345678');
  });
});
