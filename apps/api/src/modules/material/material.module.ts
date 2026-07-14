import { Module } from '@nestjs/common';
import { MATERIAL_REPOSITORY } from './domain/material.repository';
import { PrismaMaterialRepository } from './infrastructure/repositories/prisma-material.respository';
import { GetMaterialesUseCase } from './application/get-materiales.usecase';
import { GetMaterialByIdUseCase } from './application/get-material-by-id.usecase';
import { CreateMaterialUseCase } from './application/create-material.usecase';
import { MaterialController } from './presentation/material.controller';
import { ChangeMaterialPriceUseCase } from './application/change-material-price.usecase';
import { ActivateMaterialUseCase } from './application/activate-material.usecase';
import { DeactivateMaterialUseCase } from './application/deactivate-material.usecase';

@Module({
  controllers: [MaterialController],
  providers: [
    {
      provide: MATERIAL_REPOSITORY,
      useClass: PrismaMaterialRepository,
    },
    GetMaterialesUseCase,
    GetMaterialByIdUseCase,
    CreateMaterialUseCase,
    ChangeMaterialPriceUseCase,
    ActivateMaterialUseCase,
    DeactivateMaterialUseCase,
  ],
  exports: [MATERIAL_REPOSITORY],
})
export class MaterialModule {}
