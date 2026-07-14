import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { GetDashboardDataUseCase } from '../application/get-dashboard-data.usecase';
import { DashboardData } from '../domain/dashboard-data';

describe('DashboardController', () => {
  let controller: DashboardController;
  let mockUseCase: jest.Mocked<GetDashboardDataUseCase>;

  const dashboardData: DashboardData = {
    recoverersThisMonth: 5,
    totalKgThisMonth: 100,
    pendingAmount: 200,
    pendingPaymentRequests: 3,
    completedPaymentsAmount: 500,
    materials: [{ name: 'Cartón', totalKg: 60 }],
  };

  beforeEach(async () => {
    mockUseCase = { execute: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [{ provide: GetDashboardDataUseCase, useValue: mockUseCase }],
    }).compile();

    controller = module.get(DashboardController);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('getDashboard', () => {
    it('debería retornar los datos del dashboard', async () => {
      mockUseCase.execute.mockResolvedValue(dashboardData);

      const result = await controller.getDashboard({});

      expect(result.recoverersThisMonth).toBe(5);
      expect(result.totalKgThisMonth).toBe(100);
      expect(result.materials).toHaveLength(1);
    });

    it('debería pasar los query params al use case', async () => {
      mockUseCase.execute.mockResolvedValue(dashboardData);

      await controller.getDashboard({ year: 2025, month: 6 });

      expect(mockUseCase.execute).toHaveBeenCalledWith({
        year: 2025,
        month: 6,
      });
    });
  });
});
