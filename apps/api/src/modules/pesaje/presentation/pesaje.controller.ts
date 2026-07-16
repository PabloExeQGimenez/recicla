import {
  Controller,
  Post,
  Query,
  Get,
  Delete,
  Body,
  Param,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { CreatePesajeUseCase } from '../application/create-pesaje.usecase';
import { GetPesajesUseCase } from '../application/get-pesajes.usecase';
import { GetPesajeByIdUseCase } from '../application/get-pesaje-by-id.usecase';
import { DeletePesajeUseCase } from '../application/delete-pesaje.usecase';
import { DeletePesajeItemUseCase } from '../application/delete-pesaje-item.usecase';
import { ExportPesajesExcelUseCase } from '../application/export-pesajes-excel.usecase';
import { ExportPesajesPdfUseCase } from '../application/export-pesajes-pdf.usecase';
import { ZodValidationPipe } from 'src/shared/pipes/zod-validation.pipe';
import {
  type CreatePesajeDTO,
  CreatePesajeSchema,
} from './schemas/create-pesaje.schema';
import type { PesajeResponse as PesajeResponseDTO } from '@recicla/shared';
import { PesajeResponseMapper } from './mappers/pesaje-response.mapper';
import { type IdDTO, IdSchema } from '../../../shared/validation/id.schema';
import {
  type FindPesajeDTO,
  FindPesajesSchema,
} from './schemas/find-pesajes.schema';
import {
  ExportPesajesSchema,
  type ExportPesajesDTO,
} from './schemas/export-pesajes.schema';
import { type PaginatedResponseDTO } from '../../../shared/dtos/paginated-response.dto';
import { PaginateResponseMapper } from '../../../shared/mappers/paginated-response.mapper';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('pesajes')
@Controller('pesajes')
export class PesajeController {
  constructor(
    private readonly createPesajeUseCase: CreatePesajeUseCase,
    private readonly getPesajeByIdUseCase: GetPesajeByIdUseCase,
    private readonly getPesajesUseCase: GetPesajesUseCase,
    private readonly deletePesajeUseCase: DeletePesajeUseCase,
    private readonly deletePesajeItemUseCase: DeletePesajeItemUseCase,
    private readonly exportPesajesExcelUseCase: ExportPesajesExcelUseCase,
    private readonly exportPesajesPdfUseCase: ExportPesajesPdfUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear pesaje',
    description: 'Registra un nuevo pesaje para un recuperador',
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
        materiales: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              materialId: { type: 'string', example: 'uuid-del-material' },
              weight: { type: 'number', example: 25.5 },
            },
          },
        },
      },
      required: ['recuperadorId', 'materiales'],
    },
  })
  @ApiResponse({ status: 201, description: 'Pesaje creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(
    @Body(new ZodValidationPipe(CreatePesajeSchema))
    body: CreatePesajeDTO,
  ): Promise<PesajeResponseDTO> {
    const pesaje = await this.createPesajeUseCase.execute(body);
    return PesajeResponseMapper.toResponse(pesaje);
  }

  @Get('export/excel')
  @ApiOperation({
    summary: 'Exportar pesajes a Excel',
    description: 'Descarga un archivo .xlsx con los pesajes filtrados',
  })
  @ApiResponse({ status: 200, description: 'Archivo Excel generado' })
  async exportExcel(
    @Query(new ZodValidationPipe(ExportPesajesSchema))
    query: ExportPesajesDTO,
    @Res() response: Response,
  ): Promise<void> {
    const buffer = await this.exportPesajesExcelUseCase.execute(query);
    response.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="pesajes.xlsx"',
    });
    response.send(buffer);
  }

  @Get('export/pdf')
  @ApiOperation({
    summary: 'Exportar pesajes a PDF',
    description: 'Descarga un archivo .pdf con los pesajes filtrados',
  })
  @ApiResponse({ status: 200, description: 'Archivo PDF generado' })
  async exportPdf(
    @Query(new ZodValidationPipe(ExportPesajesSchema))
    query: ExportPesajesDTO,
    @Res() response: Response,
  ): Promise<void> {
    const buffer = await this.exportPesajesPdfUseCase.execute(query);
    response.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="pesajes.pdf"',
    });
    response.send(buffer);
  }

  @Delete('items/:itemId')
  @ApiOperation({
    summary: 'Eliminar ítem de pesaje',
    description: 'Elimina un material específico dentro de un pesaje',
  })
  @ApiParam({ name: 'itemId', description: 'ID del ítem del pesaje' })
  @ApiResponse({ status: 200, description: 'Ítem eliminado' })
  @ApiResponse({ status: 404, description: 'Ítem no encontrado' })
  async deleteItem(@Param('itemId') itemId: string): Promise<void> {
    await this.deletePesajeItemUseCase.execute(itemId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener pesaje',
    description: 'Retorna un pesaje por su ID',
  })
  @ApiParam({ name: 'id', description: 'ID del pesaje' })
  @ApiResponse({ status: 200, description: 'Pesaje encontrado' })
  @ApiResponse({ status: 404, description: 'Pesaje no encontrado' })
  async findById(
    @Param(new ZodValidationPipe(IdSchema))
    param: IdDTO,
  ): Promise<PesajeResponseDTO> {
    const pesaje = await this.getPesajeByIdUseCase.execute(param.id);
    return PesajeResponseMapper.toResponse(pesaje);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar pesajes',
    description: 'Retorna paginación de pesajes',
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
  @ApiQuery({
    name: 'recuperadorId',
    required: false,
    description: 'Filtrar por recuperador',
  })
  @ApiQuery({ name: 'from', required: false, description: 'Fecha desde (ISO)' })
  @ApiQuery({ name: 'to', required: false, description: 'Fecha hasta (ISO)' })
  @ApiResponse({ status: 200, description: 'Lista paginada de pesajes' })
  async findAll(
    @Query(new ZodValidationPipe(FindPesajesSchema))
    query: FindPesajeDTO,
  ): Promise<PaginatedResponseDTO<PesajeResponseDTO>> {
    const pesajes = await this.getPesajesUseCase.execute(query);
    return PaginateResponseMapper.map(pesajes, (item) =>
      PesajeResponseMapper.toResponse(item),
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar pesaje',
    description: 'Elimina un pesaje por su ID',
  })
  @ApiParam({ name: 'id', description: 'ID del pesaje' })
  @ApiResponse({ status: 200, description: 'Pesaje eliminado' })
  @ApiResponse({ status: 404, description: 'Pesaje no encontrado' })
  async delete(
    @Param(new ZodValidationPipe(IdSchema))
    param: IdDTO,
  ): Promise<void> {
    await this.deletePesajeUseCase.execute(param.id);
  }
}
