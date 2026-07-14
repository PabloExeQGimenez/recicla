import { Inject, Injectable } from '@nestjs/common';
import {
  DASHBOARD_REPOSITORY,
  type DashboardRepository,
} from '../domain/dashboard.repository';
import { DashboardData } from '../domain/dashboard-data';

@Injectable()
export class GetDashboardDataUseCase {
  constructor(
    @Inject(DASHBOARD_REPOSITORY)
    private readonly dashboardRepository: DashboardRepository,
  ) {}

  async execute(query?: {
    year?: number;
    month?: number;
  }): Promise<DashboardData> {
    const now = new Date();
    const year = query?.year ?? now.getFullYear();
    const month = query?.month ?? now.getMonth() + 1;

    const from = new Date(year, month - 1, 1);
    const to = new Date(year, month, 0, 23, 59, 59, 999);

    return this.dashboardRepository.getCurrentMonthData(from, to);
  }
}
