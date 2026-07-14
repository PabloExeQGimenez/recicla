import { Module } from '@nestjs/common';
import { SOLICITUD_PAGO_REPOSITORY } from './domain/solicitud-pago.repository';
import { PrismaSolicitudPagoRepository } from './infrastructure/repositories/prisma-solicitud-pago.respository';
import { CreateSolicitudPagoUseCase } from './application/create-solicitud-pago.usecase';
import { PESAJE_REPOSITORY } from '../pesaje/domain/pesaje.repository';
import { PrismaPesajeRepository } from '../pesaje/infrastructure/repositories/prisma-pesaje.repository';
import { SolicitudPagoController } from './presentation/solicitud-pago.controller';
import { GetSolicitudPagoByIdUseCase } from './application/get-solicitud-pago-by-id.usecase';
import { ExportSolicitudPagoUseCase } from './application/export-solicitud-pago.usecase';
import { EXCEL_EXPORTER } from './domain/excel-exporter';
import { ExcelJsExporter } from './infrastructure/excel/exceljs-exporter';
import { MarkSolicitudPagoPaidUseCase } from './application/mark-solicitud-pago-paid.usecase';
import { ExcludePesajesFromSolicitudPagoUseCase } from './application/exclude-pesajes-from-solicitud-pago.usecase';
import { DeleteSolicitudPagoUseCase } from './application/delete-solicitud-pago.usecase';
import { GetSolicitudesPagoUseCase } from './application/get-solicitudes-pago.usecase';

@Module({
  controllers: [SolicitudPagoController],
  providers: [
    {
      provide: SOLICITUD_PAGO_REPOSITORY,
      useClass: PrismaSolicitudPagoRepository,
    },
    {
      provide: PESAJE_REPOSITORY,
      useClass: PrismaPesajeRepository,
    },
    {
      provide: EXCEL_EXPORTER,
      useClass: ExcelJsExporter,
    },
    CreateSolicitudPagoUseCase,
    GetSolicitudPagoByIdUseCase,
    GetSolicitudesPagoUseCase,
    ExportSolicitudPagoUseCase,
    MarkSolicitudPagoPaidUseCase,
    ExcludePesajesFromSolicitudPagoUseCase,
    DeleteSolicitudPagoUseCase,
  ],
})
export class SolicitudPagoModule {}
