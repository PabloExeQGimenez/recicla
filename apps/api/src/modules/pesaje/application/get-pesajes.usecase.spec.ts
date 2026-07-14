import { GetPesajesUseCase } from './get-pesajes.usecase';
import { PesajeRepository } from '../domain/pesaje.repository';
import { Pesaje } from '../domain/pesaje.entity';
import { PesajeStatus } from '../domain/pesaje-status.enum';
import { PesajeItem } from '../domain/pesaje-item.vo';

describe('GetPesajesUseCase', () => {
  let useCase: GetPesajesUseCase;
  let mockRepository: jest.Mocked<PesajeRepository>;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      count: jest.fn(),
      countItems: jest.fn(),
    } as any;
    useCase = new GetPesajesUseCase(mockRepository);
  });

  it('debería retornar pesajes paginados', async () => {
    const pesajes = [
      new Pesaje({
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
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    mockRepository.findAll.mockResolvedValue(pesajes);
    mockRepository.count.mockResolvedValue(1);
    mockRepository.countItems.mockResolvedValue(3);

    const result = await useCase.execute({ page: 1, limit: 15 });

    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.totalItems).toBe(3);
    expect(result.totalPages).toBe(1);
  });

  it('debería calcular totalPages basado en totalItems', async () => {
    mockRepository.findAll.mockResolvedValue([]);
    mockRepository.count.mockResolvedValue(10);
    mockRepository.countItems.mockResolvedValue(50);

    const result = await useCase.execute({ page: 1, limit: 15 });

    expect(result.totalPages).toBe(4);
  });
});
