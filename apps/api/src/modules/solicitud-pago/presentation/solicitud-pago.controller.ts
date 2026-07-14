import {
  Controller,
  Get,
  Body,
  Post,
  Param,
  Res,
  Patch,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { CreateSolicitudPagoUseCase } from '../application/create-solicitud-pago.usecase';
import { ZodValidationPipe } from 'src/shared/pipes/zod-validation.pipe';
import {
  type SolicitudPagoDTO,
  solicitudPagoSchema,
} from './schemas/solicitud-pago.schema';
import {
  type ExcludePesajesDTO,
  excludePesajesSchema,
} from './schemas/exclude-pesajes.schema';
import type { SolicitudPagoDetail as SolicitudPagoResponseDTO } from '@recicla/shared';
import { SolicitudPagoResponseMapper } from './mappers/solicitud-pago.mapper';
import { type IdDTO, IdSchema } from '../../../shared/validation/id.schema';
import { GetSolicitudPagoByIdUseCase } from '../application/get-solicitud-pago-by-id.usecase';
import { ExportSolicitudPagoUseCase } from '../application/export-solicitud-pago.usecase';
import { MarkSolicitudPagoPaidUseCase } from '../application/mark-solicitud-pago-paid.usecase';
import { ExcludePesajesFromSolicitudPagoUseCase } from '../application/exclude-pesajes-from-solicitud-pago.usecase';
import { DeleteSolicitudPagoUseCase } from '../application/delete-solicitud-pago.usecase';
import { GetSolicitudesPagoUseCase } from '../application/get-solicitudes-pago.usecase';
import { SolicitudPagoListItemResponseDTO } from './dtos/solicitud-pago-list-response.dto';
import { Roles } from '../../auth/infrastructure/decorators/roles.decorator';
import { RolesGuard } from '../../auth/infrastructure/guards/roles.guard';

@Controller('solicitudes-pago')
export class SolicitudPagoController {
  constructor(
    private readonly createSolicitudPagoUseCase: CreateSolicitudPagoUseCase,
    private readonly getSolicitudPagoByIdUseCase: GetSolicitudPagoByIdUseCase,
    private readonly getSolicitudesPagoUseCase: GetSolicitudesPagoUseCase,
    private readonly exportSolicitudPagoUseCase: ExportSolicitudPagoUseCase,
    private readonly markSolicitudPagoPaidUseCase: MarkSolicitudPagoPaidUseCase,
    private readonly excludePesajesFromSolicitudPagoUseCase: ExcludePesajesFromSolicitudPagoUseCase,
    private readonly deleteSolicitudPagoUseCase: DeleteSolicitudPagoUseCase,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async create(
    @Body(new ZodValidationPipe(solicitudPagoSchema))
    body: SolicitudPagoDTO,
  ): Promise<SolicitudPagoResponseDTO> {
    const solicitudPago = await this.createSolicitudPagoUseCase.execute(body);
    return SolicitudPagoResponseMapper.toResponse(solicitudPago);
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ): Promise<SolicitudPagoListItemResponseDTO> {
    const filters = {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      ...(from && { from: new Date(from) }),
      ...(to && { to: new Date(to) }),
    };

    return this.getSolicitudesPagoUseCase.execute(filters);
  }

  @Get(':id')
  async findById(
    @Param(new ZodValidationPipe(IdSchema))
    param: IdDTO,
  ): Promise<SolicitudPagoResponseDTO> {
    const solicitudPago = await this.getSolicitudPagoByIdUseCase.execute(
      param.id,
    );
    return SolicitudPagoResponseMapper.toResponse(solicitudPago);
  }

  @Get(':id/export')
  async export(
    @Param(new ZodValidationPipe(IdSchema))
    param: IdDTO,
    @Res()
    response: Response,
  ): Promise<void> {
    const file = await this.exportSolicitudPagoUseCase.execute(param.id);

    response.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

      'Content-Disposition': `attachment; filename="solicitud-pago-${param.id}.xlsx"`,
    });

    response.send(file);
  }

  @Patch(':id/pay')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async markAsPaid(
    @Param(new ZodValidationPipe(IdSchema))
    param: IdDTO,
    @Body('excludePesajeIds')
    excludePesajeIds?: string[],
  ): Promise<SolicitudPagoResponseDTO> {
    const solicitudPago = await this.markSolicitudPagoPaidUseCase.execute(
      param.id,
      excludePesajeIds,
    );
    return SolicitudPagoResponseMapper.toResponse(solicitudPago);
  }

  @Patch(':id/exclude-pesajes')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async excludePesajes(
    @Param(new ZodValidationPipe(IdSchema))
    param: IdDTO,
    @Body(new ZodValidationPipe(excludePesajesSchema))
    body: ExcludePesajesDTO,
  ): Promise<SolicitudPagoResponseDTO | null> {
    const solicitudPago =
      await this.excludePesajesFromSolicitudPagoUseCase.execute(
        param.id,
        body.pesajeIds,
      );

    if (!solicitudPago) {
      return null;
    }

    return SolicitudPagoResponseMapper.toResponse(solicitudPago);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async delete(
    @Param(new ZodValidationPipe(IdSchema))
    param: IdDTO,
  ): Promise<void> {
    await this.deleteSolicitudPagoUseCase.execute(param.id);
  }
}
