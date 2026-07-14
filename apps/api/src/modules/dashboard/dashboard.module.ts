import { Module } from '@nestjs/common';
import { DashboardController } from './presentation/dashboard.controller';
import { GetDashboardDataUseCase } from './application/get-dashboard-data.usecase';
import { DASHBOARD_REPOSITORY } from './domain/dashboard.repository';
import { PrismaDashboardRepository } from './infrastructure/infrastructure/prisma-dashboard.repository';

@Module({
  controllers: [DashboardController],
  providers: [
    {
      provide: DASHBOARD_REPOSITORY,
      useClass: PrismaDashboardRepository,
    },
    GetDashboardDataUseCase,
  ],
})
export class DashboardModule {}
