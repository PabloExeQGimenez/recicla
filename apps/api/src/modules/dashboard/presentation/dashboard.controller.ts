import { Controller, Get, Query } from '@nestjs/common';
import { ZodValidationPipe } from 'src/shared/pipes/zod-validation.pipe';
import {
  DashboardQuerySchema,
  type DashboardQueryDTO,
} from 'src/shared/validation/dashboard-query.schema';
import { GetDashboardDataUseCase } from '../application/get-dashboard-data.usecase';
import type { DashboardData } from '@recicla/shared';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly getDashboardDataUseCase: GetDashboardDataUseCase,
  ) {}

  @Get()
  async getDashboard(
    @Query(new ZodValidationPipe(DashboardQuerySchema))
    query: DashboardQueryDTO,
  ): Promise<DashboardData> {
    return this.getDashboardDataUseCase.execute(query);
  }
}
