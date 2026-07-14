import { Module } from '@nestjs/common';
import { RecuperadorController } from './presentation/recuperador.controller';
import { CreateRecuperadorUseCase } from './application/create-recuperador.usecase';
import { RECUPERADOR_REPOSITORY } from './domain/recuperador.repository';
import { PrismaRecuperadorRepository } from './infrastructure/repositories/prisma-recuperador.repository';
import { GetRecuperadorByIdUseCase } from './application/get-recuperador-by-id.usecase';
import { GetRecuperadoresUseCase } from './application/get-recuperadores.usecases';
import { UpdateRecuperadorUseCase } from './application/update-recuperador.usecase';
import { ActivateRecuperadorUseCase } from './application/activate-recuperador.usecase';
import { DeactivateRecuperadorUseCase } from './application/deactivate-recuperador.usecase';

@Module({
  controllers: [RecuperadorController],
  providers: [
    {
      provide: RECUPERADOR_REPOSITORY,
      useClass: PrismaRecuperadorRepository,
    },
    GetRecuperadorByIdUseCase,
    CreateRecuperadorUseCase,
    GetRecuperadoresUseCase,
    UpdateRecuperadorUseCase,
    ActivateRecuperadorUseCase,
    DeactivateRecuperadorUseCase,
  ],
  exports: [RECUPERADOR_REPOSITORY],
})
export class RecuperadorModule {}
