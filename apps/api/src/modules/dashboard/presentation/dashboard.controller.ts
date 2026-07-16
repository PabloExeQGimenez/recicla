import { Controller, Get, Query } from '@nestjs/common';
import { ZodValidationPipe } from 'src/shared/pipes/zod-validation.pipe';
import {
  DashboardQuerySchema,
  type DashboardQueryDTO,
} from 'src/shared/validation/dashboard-query.schema';
import { GetDashboardDataUseCase } from '../application/get-dashboard-data.usecase';
import type { DashboardData } from '@recicla/shared';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly getDashboardDataUseCase: GetDashboardDataUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener datos del dashboard',
    description: 'Retorna métricas y estadísticas para el panel de control',
  })
  @ApiQuery({ name: 'from', required: false, description: 'Fecha desde (ISO)' })
  @ApiQuery({ name: 'to', required: false, description: 'Fecha hasta (ISO)' })
  @ApiQuery({
    name: 'recuperadorId',
    required: false,
    description: 'Filtrar por recuperador',
  })
  @ApiResponse({ status: 200, description: 'Datos del dashboard retornados' })
  async getDashboard(
    @Query(new ZodValidationPipe(DashboardQuerySchema))
    query: DashboardQueryDTO,
  ): Promise<DashboardData> {
    return this.getDashboardDataUseCase.execute(query);
  }
}
