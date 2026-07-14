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
  async create(
    @Body(new ZodValidationPipe(CreatePesajeSchema))
    body: CreatePesajeDTO,
  ): Promise<PesajeResponseDTO> {
    const pesaje = await this.createPesajeUseCase.execute(body);
    return PesajeResponseMapper.toResponse(pesaje);
  }

  @Get('export/excel')
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
  async deleteItem(@Param('itemId') itemId: string): Promise<void> {
    await this.deletePesajeItemUseCase.execute(itemId);
  }

  @Get(':id')
  async findById(
    @Param(new ZodValidationPipe(IdSchema))
    param: IdDTO,
  ): Promise<PesajeResponseDTO> {
    const pesaje = await this.getPesajeByIdUseCase.execute(param.id);
    return PesajeResponseMapper.toResponse(pesaje);
  }

  @Get()
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
  async delete(
    @Param(new ZodValidationPipe(IdSchema))
    param: IdDTO,
  ): Promise<void> {
    await this.deletePesajeUseCase.execute(param.id);
  }
}
