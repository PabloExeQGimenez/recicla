import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/shared/pipes/zod-validation.pipe';
import { CreateMaterialUseCase } from '../application/create-material.usecase';
import { GetMaterialByIdUseCase } from '../application/get-material-by-id.usecase';
import { GetMaterialesUseCase } from '../application/get-materiales.usecase';
import {
  type CreateMaterialSchema as CreateMaterialDTO,
  createMaterialSchema,
} from '@recicla/shared';
import type { Material as MaterialResponseDTO } from '@recicla/shared';
import { MaterialResponseMapper } from './mappers/material-response.mapper';
import { IdSchema, type IdDTO } from 'src/shared/validation/id.schema';
import {
  type ActiveDTO,
  ActiveSchema,
} from 'src/shared/validation/active.schema';
import { ChangeMaterialPriceUseCase } from '../application/change-material-price.usecase';
import {
  type ChangeMaterialPriceSchema as ChangeMaterialPriceDTO,
  changeMaterialPriceSchema as ChangeMaterialPriceSchema,
} from '@recicla/shared';
import { ActivateMaterialUseCase } from '../application/activate-material.usecase';
import { DeactivateMaterialUseCase } from '../application/deactivate-material.usecase';
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

@ApiTags('materiales')
@ApiBearerAuth()
@Controller('materiales')
export class MaterialController {
  constructor(
    private readonly createMaterialUseCase: CreateMaterialUseCase,
    private readonly getMaterialByIdUseCase: GetMaterialByIdUseCase,
    private readonly getMaterialesUseCase: GetMaterialesUseCase,
    private readonly changeMaterialPriceUseCase: ChangeMaterialPriceUseCase,
    private readonly activateMaterialUseCase: ActivateMaterialUseCase,
    private readonly deactivateMaterialUseCase: DeactivateMaterialUseCase,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Crear material',
    description: 'Crea un nuevo material (solo ADMIN)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Cartón',
          description: 'Nombre del material',
        },
        currentPrice: {
          type: 'number',
          example: 150.5,
          description: 'Precio actual por kg',
        },
      },
      required: ['name', 'currentPrice'],
    },
  })
  @ApiResponse({ status: 201, description: 'Material creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(
    @Body(new ZodValidationPipe(createMaterialSchema))
    body: CreateMaterialDTO,
  ): Promise<MaterialResponseDTO> {
    const material = await this.createMaterialUseCase.execute(body);
    return MaterialResponseMapper.toResponse(material);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener material',
    description: 'Retorna un material por su ID',
  })
  @ApiParam({ name: 'id', description: 'ID del material' })
  @ApiResponse({ status: 200, description: 'Material encontrado' })
  @ApiResponse({ status: 404, description: 'Material no encontrado' })
  async findById(
    @Param(new ZodValidationPipe(IdSchema))
    param: IdDTO,
  ): Promise<MaterialResponseDTO> {
    const material = await this.getMaterialByIdUseCase.execute(param.id);
    return MaterialResponseMapper.toResponse(material);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar materiales',
    description: 'Retorna todos los materiales',
  })
  @ApiQuery({
    name: 'active',
    required: false,
    description: 'Filtrar por estado activo',
    example: true,
  })
  @ApiResponse({ status: 200, description: 'Lista de materiales' })
  async findAll(
    @Query(new ZodValidationPipe(ActiveSchema))
    query: ActiveDTO,
  ): Promise<MaterialResponseDTO[]> {
    const materiales = await this.getMaterialesUseCase.execute(query.active);
    return materiales.map((item) => MaterialResponseMapper.toResponse(item));
  }

  @Patch(':id/price')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Cambiar precio',
    description: 'Actualiza el precio de un material (solo ADMIN)',
  })
  @ApiParam({ name: 'id', description: 'ID del material' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        newPrice: {
          type: 'number',
          example: 180.0,
          description: 'Nuevo precio por kg',
        },
      },
      required: ['newPrice'],
    },
  })
  @ApiResponse({ status: 200, description: 'Precio actualizado' })
  @ApiResponse({ status: 404, description: 'Material no encontrado' })
  async changePrice(
    @Param(new ZodValidationPipe(IdSchema))
    param: IdDTO,
    @Body(new ZodValidationPipe(ChangeMaterialPriceSchema))
    body: ChangeMaterialPriceDTO,
  ): Promise<MaterialResponseDTO> {
    const material = await this.changeMaterialPriceUseCase.execute(
      param.id,
      body,
    );
    return MaterialResponseMapper.toResponse(material);
  }

  @Patch(':id/activate')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Activar material',
    description: 'Activa un material desactivado (solo ADMIN)',
  })
  @ApiParam({ name: 'id', description: 'ID del material' })
  @ApiResponse({ status: 200, description: 'Material activado' })
  @ApiResponse({ status: 404, description: 'Material no encontrado' })
  async activate(
    @Param(new ZodValidationPipe(IdSchema))
    param: IdDTO,
  ): Promise<MaterialResponseDTO> {
    const material = await this.activateMaterialUseCase.execute(param.id);
    return MaterialResponseMapper.toResponse(material);
  }

  @Patch(':id/deactivate')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Desactivar material',
    description: 'Desactiva un material (solo ADMIN)',
  })
  @ApiParam({ name: 'id', description: 'ID del material' })
  @ApiResponse({ status: 200, description: 'Material desactivado' })
  @ApiResponse({ status: 404, description: 'Material no encontrado' })
  async deactivate(
    @Param(new ZodValidationPipe(IdSchema))
    param: IdDTO,
  ): Promise<MaterialResponseDTO> {
    const material = await this.deactivateMaterialUseCase.execute(param.id);
    return MaterialResponseMapper.toResponse(material);
  }
}
