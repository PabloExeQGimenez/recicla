import { CreatePesajeUseCase } from './create-pesaje.usecase';
import { PesajeRepository } from '../domain/pesaje.repository';
import { RecuperadorRepository } from 'src/modules/recuperador/domain/recuperador.repository';
import { MaterialRepository } from 'src/modules/material/domain/material.repository';
import { Recuperador } from 'src/modules/recuperador/domain/recuperador.entity';
import { Material } from 'src/modules/material/domain/material.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CreatePesajeUseCase', () => {
  let useCase: CreatePesajeUseCase;
  let mockPesajeRepo: jest.Mocked<PesajeRepository>;
  let mockRecuperadorRepo: jest.Mocked<RecuperadorRepository>;
  let mockMaterialRepo: jest.Mocked<MaterialRepository>;

  const activeRecuperador = new Recuperador({
    id: 'rec-1',
    name: 'Juan',
    lastName: 'Pérez',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const material = new Material({
    id: 'mat-1',
    name: 'Cartón',
    currentPrice: 2.5,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(() => {
    mockPesajeRepo = { save: jest.fn() } as any;
    mockRecuperadorRepo = { findById: jest.fn() } as any;
    mockMaterialRepo = { findById: jest.fn() } as any;
    useCase = new CreatePesajeUseCase(
      mockPesajeRepo,
      mockRecuperadorRepo,
      mockMaterialRepo,
    );
  });

  it('debería lanzar NotFoundException si el recuperador no existe', async () => {
    mockRecuperadorRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        recuperadorId: 'rec-1',
        date: new Date(),
        items: [{ materialId: 'mat-1', weight: 10 }],
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('debería lanzar BadRequestException si el recuperador está inactivo', async () => {
    const inactive = new Recuperador({
      id: 'rec-1',
      name: 'Juan',
      lastName: 'Pérez',
      active: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockRecuperadorRepo.findById.mockResolvedValue(inactive);

    await expect(
      useCase.execute({
        recuperadorId: 'rec-1',
        date: new Date(),
        items: [{ materialId: 'mat-1', weight: 10 }],
      }),
    ).rejects.toThrow(BadRequestException);
    await expect(
      useCase.execute({
        recuperadorId: 'rec-1',
        date: new Date(),
        items: [{ materialId: 'mat-1', weight: 10 }],
      }),
    ).rejects.toThrow('El recuperador está inactivo');
  });

  it('debería lanzar NotFoundException si un material no existe', async () => {
    mockRecuperadorRepo.findById.mockResolvedValue(activeRecuperador);
    mockMaterialRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        recuperadorId: 'rec-1',
        date: new Date(),
        items: [{ materialId: 'mat-999', weight: 10 }],
      }),
    ).rejects.toThrow(NotFoundException);
    await expect(
      useCase.execute({
        recuperadorId: 'rec-1',
        date: new Date(),
        items: [{ materialId: 'mat-999', weight: 10 }],
      }),
    ).rejects.toThrow('El material mat-999 no existe');
  });

  it('debería crear el pesaje con precio snapshot del material', async () => {
    mockRecuperadorRepo.findById.mockResolvedValue(activeRecuperador);
    mockMaterialRepo.findById.mockResolvedValue(material);
    mockPesajeRepo.save.mockResolvedValue(undefined);

    const result = await useCase.execute({
      recuperadorId: 'rec-1',
      date: new Date('2026-01-15'),
      items: [{ materialId: 'mat-1', weight: 10 }],
    });

    expect(result.recuperadorId).toBe('rec-1');
    expect(result.items).toHaveLength(1);
    expect(result.items[0].pricePerKgAtMoment).toBe(2.5);
    expect(result.items[0].weight).toBe(10);
    expect(result.status).toBe('PENDING');
    expect(mockPesajeRepo.save).toHaveBeenCalled();
  });

  it('debería crear pesaje con múltiples items', async () => {
    const material2 = new Material({
      id: 'mat-2',
      name: 'Plástico',
      currentPrice: 3,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockRecuperadorRepo.findById.mockResolvedValue(activeRecuperador);
    mockMaterialRepo.findById
      .mockResolvedValueOnce(material)
      .mockResolvedValueOnce(material2);
    mockPesajeRepo.save.mockResolvedValue(undefined);

    const result = await useCase.execute({
      recuperadorId: 'rec-1',
      date: new Date(),
      items: [
        { materialId: 'mat-1', weight: 10 },
        { materialId: 'mat-2', weight: 5 },
      ],
    });

    expect(result.items).toHaveLength(2);
    expect(result.items[0].pricePerKgAtMoment).toBe(2.5);
    expect(result.items[1].pricePerKgAtMoment).toBe(3);
  });
});
