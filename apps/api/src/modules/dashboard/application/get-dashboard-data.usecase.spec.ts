import { GetDashboardDataUseCase } from './get-dashboard-data.usecase';
import { DashboardRepository } from '../domain/dashboard.repository';
import { DashboardData } from '../domain/dashboard-data';

describe('GetDashboardDataUseCase', () => {
  let useCase: GetDashboardDataUseCase;
  let mockRepository: jest.Mocked<DashboardRepository>;

  beforeEach(() => {
    mockRepository = { getCurrentMonthData: jest.fn() };
    useCase = new GetDashboardDataUseCase(mockRepository);
  });

  it('debería usar fechas por defecto (mes actual) si no se proveen query params', async () => {
    const dashboardData: DashboardData = {
      recoverersThisMonth: 5,
      totalKgThisMonth: 100,
      pendingAmount: 200,
      pendingPaymentRequests: 3,
      completedPaymentsAmount: 500,
      materials: [],
    };

    mockRepository.getCurrentMonthData.mockResolvedValue(dashboardData);

    const result = await useCase.execute();

    expect(result).toEqual(dashboardData);
    expect(mockRepository.getCurrentMonthData).toHaveBeenCalled();

    const [from, to] = mockRepository.getCurrentMonthData.mock.calls[0];
    expect(from).toBeInstanceOf(Date);
    expect(to).toBeInstanceOf(Date);
  });

  it('debería usar las fechas proporcionadas en query', async () => {
    const dashboardData: DashboardData = {
      recoverersThisMonth: 2,
      totalKgThisMonth: 50,
      pendingAmount: 100,
      pendingPaymentRequests: 1,
      completedPaymentsAmount: 250,
      materials: [],
    };

    mockRepository.getCurrentMonthData.mockResolvedValue(dashboardData);

    const result = await useCase.execute({ year: 2025, month: 6 });

    expect(result).toEqual(dashboardData);

    const [from, to] = mockRepository.getCurrentMonthData.mock.calls[0];
    expect(from.getFullYear()).toBe(2025);
    expect(from.getMonth()).toBe(5);
    expect(to.getFullYear()).toBe(2025);
    expect(to.getMonth()).toBe(5);
    expect(to.getDate()).toBe(30);
  });
});
