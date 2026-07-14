import { UpdateRecuperadorUseCase } from './update-recuperador.usecase';
import { RecuperadorRepository } from '../domain/recuperador.repository';
import { Recuperador } from '../domain/recuperador.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('UpdateRecuperadorUseCase', () => {
  let useCase: UpdateRecuperadorUseCase;
  let mockRepository: jest.Mocked<RecuperadorRepository>;

  const existingRecuperador = new Recuperador({
    id: 'rec-1',
    name: 'Juan',
    lastName: 'Pérez',
    dni: '12345678',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      findByDni: jest.fn(),
      update: jest.fn(),
    } as any;
    useCase = new UpdateRecuperadorUseCase(mockRepository);
  });

  it('debería lanzar NotFoundException si el recuperador no existe', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('rec-1', { name: 'María' })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('debería lanzar ConflictException si el DNI ya existe en otro recuperador', async () => {
    mockRepository.findById.mockResolvedValue(existingRecuperador);
    mockRepository.findByDni.mockResolvedValue({
      id: 'rec-2',
      dni: '99999999',
    } as any);

    await expect(useCase.execute('rec-1', { dni: '99999999' })).rejects.toThrow(
      ConflictException,
    );
  });

  it('debería permitir actualizar el DNI si pertenece al mismo recuperador', async () => {
    mockRepository.findById.mockResolvedValue(existingRecuperador);
    mockRepository.findByDni.mockResolvedValue(existingRecuperador);
    mockRepository.update.mockResolvedValue(undefined);

    const result = await useCase.execute('rec-1', { dni: '12345678' });

    expect(result.dni).toBe('12345678');
    expect(mockRepository.update).toHaveBeenCalled();
  });

  it('debería actualizar los campos y guardar', async () => {
    mockRepository.findById.mockResolvedValue(existingRecuperador);
    mockRepository.update.mockResolvedValue(undefined);

    const result = await useCase.execute('rec-1', { name: 'María' });

    expect(result.name).toBe('María');
    expect(mockRepository.update).toHaveBeenCalled();
  });
});
