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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('recuperadores')
@ApiBearerAuth()
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
  @ApiOperation({
    summary: 'Crear recuperador',
    description: 'Crea un nuevo recuperador',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Juan',
          description: 'Nombre del recuperador',
        },
        lastName: {
          type: 'string',
          example: 'Pérez',
          description: 'Apellido del recuperador',
        },
        dni: {
          type: 'string',
          example: '12345678',
          description: 'DNI (opcional)',
        },
        phone: {
          type: 'string',
          example: '1234567890',
          description: 'Teléfono (opcional)',
        },
        email: {
          type: 'string',
          example: 'juan@email.com',
          description: 'Email (opcional)',
        },
      },
      required: ['name', 'lastName'],
    },
  })
  @ApiResponse({ status: 201, description: 'Recuperador creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(
    @Body(new ZodValidationPipe(createRecuperadorSchema))
    body: CreateRecuperadorDTO,
  ): Promise<RecuperadorResponseDTO> {
    const recuperador = await this.createRecuperadorUseCase.execute(body);
    return RecuperadorResponseMapper.toResponse(recuperador);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener recuperador',
    description: 'Retorna un recuperador por su ID',
  })
  @ApiParam({ name: 'id', description: 'ID del recuperador' })
  @ApiResponse({ status: 200, description: 'Recuperador encontrado' })
  @ApiResponse({ status: 404, description: 'Recuperador no encontrado' })
  async findById(
    @Param(new ZodValidationPipe(IdSchema))
    params: IdDTO,
  ): Promise<RecuperadorResponseDTO> {
    const recuperador = await this.getRecuperadorByIdUseCase.execute(params.id);
    return RecuperadorResponseMapper.toResponse(recuperador);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar recuperadores',
    description: 'Retorna una lista paginada de recuperadores',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número de página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Elementos por página',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Buscar por nombre o apellido',
  })
  @ApiResponse({ status: 200, description: 'Lista paginada de recuperadores' })
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
  @ApiOperation({
    summary: 'Actualizar recuperador',
    description: 'Actualiza parcialmente un recuperador',
  })
  @ApiParam({ name: 'id', description: 'ID del recuperador' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Juan',
          description: 'Nombre del recuperador',
        },
        lastName: {
          type: 'string',
          example: 'Pérez',
          description: 'Apellido del recuperador',
        },
        dni: { type: 'string', example: '12345678', description: 'DNI' },
        phone: {
          type: 'string',
          example: '1234567890',
          description: 'Teléfono',
        },
        email: {
          type: 'string',
          example: 'juan@email.com',
          description: 'Email',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Recuperador actualizado' })
  @ApiResponse({ status: 404, description: 'Recuperador no encontrado' })
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
  @ApiOperation({
    summary: 'Activar recuperador',
    description: 'Activa un recuperador desactivado',
  })
  @ApiParam({ name: 'id', description: 'ID del recuperador' })
  @ApiResponse({ status: 200, description: 'Recuperador activado' })
  @ApiResponse({ status: 404, description: 'Recuperador no encontrado' })
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
  @ApiOperation({
    summary: 'Desactivar recuperador',
    description: 'Desactiva un recuperador',
  })
  @ApiParam({ name: 'id', description: 'ID del recuperador' })
  @ApiResponse({ status: 200, description: 'Recuperador desactivado' })
  @ApiResponse({ status: 404, description: 'Recuperador no encontrado' })
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
