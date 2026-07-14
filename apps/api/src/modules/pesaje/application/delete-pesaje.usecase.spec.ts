import { DeletePesajeUseCase } from './delete-pesaje.usecase';
import { PesajeRepository } from '../domain/pesaje.repository';
import { Pesaje } from '../domain/pesaje.entity';
import { PesajeStatus } from '../domain/pesaje-status.enum';
import { PesajeItem } from '../domain/pesaje-item.vo';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('DeletePesajeUseCase', () => {
  let useCase: DeletePesajeUseCase;
  let mockRepository: jest.Mocked<PesajeRepository>;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      delete: jest.fn(),
    } as any;

    useCase = new DeletePesajeUseCase(mockRepository);
  });

  it('debería lanzar NotFoundException si el pesaje no existe', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('p-1')).rejects.toThrow(NotFoundException);
    await expect(useCase.execute('p-1')).rejects.toThrow('El pesaje no existe');
  });

  it('debería lanzar BadRequestException si el pesaje no se puede eliminar', async () => {
    const pesaje = new Pesaje({
      id: 'p-1',
      recuperadorId: 'rec-1',
      status: PesajeStatus.PAYMENT_REQUESTED,
      items: [
        new PesajeItem({
          materialId: 'mat-1',
          weight: 10,
          pricePerKgAtMoment: 2,
        }),
      ],
      date: new Date('2026-01-15'),
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date('2026-01-15'),
    });

    mockRepository.findById.mockResolvedValue(pesaje);

    await expect(useCase.execute('p-1')).rejects.toThrow(BadRequestException);
    await expect(useCase.execute('p-1')).rejects.toThrow(
      'El pesaje ya fue incorporado a una solicitud de pago o está pagado',
    );
  });

  it('debería eliminar el pesaje correctamente', async () => {
    const pesaje = new Pesaje({
      id: 'p-1',
      recuperadorId: 'rec-1',
      status: PesajeStatus.PENDING,
      items: [
        new PesajeItem({
          materialId: 'mat-1',
          weight: 10,
          pricePerKgAtMoment: 2,
        }),
      ],
      date: new Date('2026-01-15'),
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date('2026-01-15'),
    });

    mockRepository.findById.mockResolvedValue(pesaje);
    mockRepository.delete.mockResolvedValue(undefined);

    await useCase.execute('p-1');

    expect(mockRepository.delete).toHaveBeenCalledWith('p-1');
  });
});
