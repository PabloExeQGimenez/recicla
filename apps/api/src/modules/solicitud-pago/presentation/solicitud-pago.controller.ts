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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('solicitudes-pago')
@ApiBearerAuth()
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
  @ApiOperation({
    summary: 'Crear solicitud de pago',
    description:
      'Genera una solicitud de pago a partir de pesajes de un recuperador (solo ADMIN)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        recuperadorId: {
          type: 'string',
          example: 'uuid-del-recuperador',
          description: 'ID del recuperador',
        },
        pesajeIds: {
          type: 'array',
          items: { type: 'string', example: 'uuid-del-pesaje' },
          description: 'IDs de los pesajes a incluir',
        },
      },
      required: ['recuperadorId', 'pesajeIds'],
    },
  })
  @ApiResponse({ status: 201, description: 'Solicitud creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({
    status: 404,
    description: 'Recuperador o pesajes no encontrados',
  })
  async create(
    @Body(new ZodValidationPipe(solicitudPagoSchema))
    body: SolicitudPagoDTO,
  ): Promise<SolicitudPagoResponseDTO> {
    const solicitudPago = await this.createSolicitudPagoUseCase.execute(body);
    return SolicitudPagoResponseMapper.toResponse(solicitudPago);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar solicitudes de pago',
    description: 'Retorna solicitudes paginadas con filtros de fecha',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Número de página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Resultados por página',
  })
  @ApiQuery({ name: 'from', required: false, description: 'Fecha desde (ISO)' })
  @ApiQuery({ name: 'to', required: false, description: 'Fecha hasta (ISO)' })
  @ApiResponse({ status: 200, description: 'Lista paginada de solicitudes' })
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
  @ApiOperation({
    summary: 'Obtener solicitud de pago',
    description: 'Retorna el detalle de una solicitud por su ID',
  })
  @ApiParam({ name: 'id', description: 'ID de la solicitud' })
  @ApiResponse({ status: 200, description: 'Solicitud encontrada' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
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
  @ApiOperation({
    summary: 'Exportar solicitud a Excel',
    description: 'Descarga la solicitud como archivo .xlsx',
  })
  @ApiParam({ name: 'id', description: 'ID de la solicitud' })
  @ApiResponse({ status: 200, description: 'Archivo Excel generado' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Marcar como pagada',
    description: 'Marca una solicitud como pagada (solo ADMIN)',
  })
  @ApiParam({ name: 'id', description: 'ID de la solicitud' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        excludePesajeIds: {
          type: 'array',
          items: { type: 'string', example: 'uuid-del-pesaje' },
          description: 'Pesajes a excluir del pago',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Solicitud marcada como pagada' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
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
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Excluir pesajes',
    description: 'Excluye pesajes de una solicitud de pago (solo ADMIN)',
  })
  @ApiParam({ name: 'id', description: 'ID de la solicitud' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        pesajeIds: {
          type: 'array',
          items: { type: 'string', example: 'uuid-del-pesaje' },
          description: 'IDs de los pesajes a excluir',
        },
      },
      required: ['pesajeIds'],
    },
  })
  @ApiResponse({ status: 200, description: 'Pesajes excluidos' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
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
  @ApiOperation({
    summary: 'Eliminar solicitud de pago',
    description: 'Elimina una solicitud por su ID (solo ADMIN)',
  })
  @ApiParam({ name: 'id', description: 'ID de la solicitud' })
  @ApiResponse({ status: 200, description: 'Solicitud eliminada' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
  async delete(
    @Param(new ZodValidationPipe(IdSchema))
    param: IdDTO,
  ): Promise<void> {
    await this.deleteSolicitudPagoUseCase.execute(param.id);
  }
}
