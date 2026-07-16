import { Module } from '@nestjs/common';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { RecuperadorModule } from './modules/recuperador/recuperador.module';
import { PrismaModule } from './shared/database/prisma.module';
import { MaterialModule } from './modules/material/material.module';
import { PesajeModule } from './modules/pesaje/pesaje.module';
import { SolicitudPagoModule } from './modules/solicitud-pago/solicitud-pago.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/infrastructure/guards/roles.guard';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';
import { ThrottlerModule, ThrottlerGuard, seconds } from '@nestjs/throttler';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: seconds(60),
        limit: 10,
      },
    ]),
    PrismaModule,
    AuthModule,
    RecuperadorModule,
    MaterialModule,
    PesajeModule,
    SolicitudPagoModule,
    DashboardModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
