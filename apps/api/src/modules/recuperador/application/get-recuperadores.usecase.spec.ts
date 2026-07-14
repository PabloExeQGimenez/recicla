import { GetRecuperadoresUseCase } from './get-recuperadores.usecases';
import { RecuperadorRepository } from '../domain/recuperador.repository';
import { Recuperador } from '../domain/recuperador.entity';

describe('GetRecuperadoresUseCase', () => {
  let useCase: GetRecuperadoresUseCase;
  let mockRepository: jest.Mocked<RecuperadorRepository>;

  beforeEach(() => {
    mockRepository = { findAll: jest.fn(), count: jest.fn() } as any;
    useCase = new GetRecuperadoresUseCase(mockRepository);
  });

  it('debería retornar recuperadores paginados', async () => {
    const recuperadores = [
      new Recuperador({
        id: 'rec-1',
        name: 'Juan',
        lastName: 'Pérez',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    mockRepository.findAll.mockResolvedValue(recuperadores);
    mockRepository.count.mockResolvedValue(1);

    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
  });

  it('debería calcular totalPages correctamente', async () => {
    mockRepository.findAll.mockResolvedValue([]);
    mockRepository.count.mockResolvedValue(25);

    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result.totalPages).toBe(3);
  });
});
