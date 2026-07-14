import {
  Body,
  Controller,
  Post,
  Param,
  Get,
  Patch,
  Query,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/shared/pipes/zod-validation.pipe';
import { CreateRecuperadorUseCase } from '../application/create-recuperador.usecase';
import {
  type CreateRecuperadorDTO,
  createRecuperadorSchema,
} from '../presentation/schemas/create-recuperador.schema';
import { IdSchema, type IdDTO } from '../../../shared/validation/id.schema';
import {
  type UpdateRecuperadorDTO,
  updateRecuperadorSchema,
} from '../presentation/schemas/update-recuperador.schema';
import { GetRecuperadorByIdUseCase } from '../application/get-recuperador-by-id.usecase';
import { GetRecuperadoresUseCase } from '../application/get-recuperadores.usecases';
import { UpdateRecuperadorUseCase } from '../application/update-recuperador.usecase';
import { ActivateRecuperadorUseCase } from '../application/activate-recuperador.usecase';
import { DeactivateRecuperadorUseCase } from '../application/deactivate-recuperador.usecase';
import { RecuperadorResponseMapper } from './mappers/recuperador-response.mapper';
import type { Recuperador as RecuperadorResponseDTO } from '@recicla/shared';
import {
  listRecuperadoresSchema,
  type ListRecuperadoresDTO,
} from '../presentation/schemas/list-recuperadores.schema';
import { PaginatedResponseDTO } from '../../../shared/dtos/paginated-response.dto';
import { PaginateResponseMapper } from 'src/shared/mappers/paginated-response.mapper';

@Controller('recuperadores')
export class RecuperadorController {
  constructor(
    private readonly createRecuperadorUseCase: CreateRecuperadorUseCase,
    private readonly getRecuperadorByIdUseCase: GetRecuperadorByIdUseCase,
    private readonly getRecuperadoresUseCase: GetRecuperadoresUseCase,
    private readonly updateRecuperadorUseCase: UpdateRecuperadorUseCase,
    private readonly activateRecuperadorUseCase: ActivateRecuperadorUseCase,
    private readonly deactivateRecuperadorUseCase: DeactivateRecuperadorUseCase,
  ) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createRecuperadorSchema))
    body: CreateRecuperadorDTO,
  ): Promise<RecuperadorResponseDTO> {
    const recuperador = await this.createRecuperadorUseCase.execute(body);
    return RecuperadorResponseMapper.toResponse(recuperador);
  }

  @Get(':id')
  async findById(
    @Param(new ZodValidationPipe(IdSchema))
    params: IdDTO,
  ): Promise<RecuperadorResponseDTO> {
    const recuperador = await this.getRecuperadorByIdUseCase.execute(params.id);
    return RecuperadorResponseMapper.toResponse(recuperador);
  }

  @Get()
  async findAll(
    @Query(new ZodValidationPipe(listRecuperadoresSchema))
    query: ListRecuperadoresDTO,
  ): Promise<PaginatedResponseDTO<RecuperadorResponseDTO>> {
    const result = await this.getRecuperadoresUseCase.execute(query);
    return PaginateResponseMapper.map(result, (item) =>
      RecuperadorResponseMapper.toResponse(item),
    );
  }

  @Patch(':id')
  async update(
    @Param(new ZodValidationPipe(IdSchema))
    params: IdDTO,
    @Body(new ZodValidationPipe(updateRecuperadorSchema))
    body: UpdateRecuperadorDTO,
  ): Promise<RecuperadorResponseDTO> {
    const recuperador = await this.updateRecuperadorUseCase.execute(
      params.id,
      body,
    );
    return RecuperadorResponseMapper.toResponse(recuperador);
  }

  @Patch(':id/activate')
  async activate(
    @Param(new ZodValidationPipe(IdSchema))
    params: IdDTO,
  ): Promise<RecuperadorResponseDTO> {
    const recuperador = await this.activateRecuperadorUseCase.execute(
      params.id,
    );
    return RecuperadorResponseMapper.toResponse(recuperador);
  }

  @Patch(':id/deactivate')
  async deactivate(
    @Param(new ZodValidationPipe(IdSchema))
    params: IdDTO,
  ): Promise<RecuperadorResponseDTO> {
    const recuperador = await this.deactivateRecuperadorUseCase.execute(
      params.id,
    );
    return RecuperadorResponseMapper.toResponse(recuperador);
  }
}
