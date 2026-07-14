import { DeletePesajeItemUseCase } from './delete-pesaje-item.usecase';
import { PesajeRepository } from '../domain/pesaje.repository';

describe('DeletePesajeItemUseCase', () => {
  let useCase: DeletePesajeItemUseCase;
  let mockRepository: jest.Mocked<PesajeRepository>;

  beforeEach(() => {
    mockRepository = { deleteItem: jest.fn() } as any;
    useCase = new DeletePesajeItemUseCase(mockRepository);
  });

  it('debería delegar la eliminación al repository', async () => {
    mockRepository.deleteItem.mockResolvedValue(undefined);

    await useCase.execute('item-1');

    expect(mockRepository.deleteItem).toHaveBeenCalledWith('item-1');
  });
});
