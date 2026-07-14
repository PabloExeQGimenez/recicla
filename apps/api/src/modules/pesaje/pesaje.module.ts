import { Module } from '@nestjs/common';
import { PESAJE_REPOSITORY } from './domain/pesaje.repository';
import { PrismaPesajeRepository } from './infrastructure/repositories/prisma-pesaje.repository';
import { PesajeController } from './presentation/pesaje.controller';
import { CreatePesajeUseCase } from './application/create-pesaje.usecase';
import { GetPesajeByIdUseCase } from './application/get-pesaje-by-id.usecase';
import { GetPesajesUseCase } from './application/get-pesajes.usecase';
import { DeletePesajeUseCase } from './application/delete-pesaje.usecase';
import { DeletePesajeItemUseCase } from './application/delete-pesaje-item.usecase';
import { ExportPesajesExcelUseCase } from './application/export-pesajes-excel.usecase';
import { ExportPesajesPdfUseCase } from './application/export-pesajes-pdf.usecase';
import { EXCEL_EXPORTER } from './domain/excel-exporter';
import { PDF_EXPORTER } from './domain/pdf-exporter';
import { ExcelJsExporter } from './infrastructure/excel/exceljs-exporter';
import { JsPdfExporter } from './infrastructure/pdf/jspdf-exporter';
import { MaterialModule } from '../material/material.module';
import { RecuperadorModule } from '../recuperador/recuperador.module';

@Module({
  controllers: [PesajeController],
  providers: [
    {
      provide: PESAJE_REPOSITORY,
      useClass: PrismaPesajeRepository,
    },
    {
      provide: EXCEL_EXPORTER,
      useClass: ExcelJsExporter,
    },
    {
      provide: PDF_EXPORTER,
      useClass: JsPdfExporter,
    },
    CreatePesajeUseCase,
    GetPesajeByIdUseCase,
    GetPesajesUseCase,
    DeletePesajeUseCase,
    DeletePesajeItemUseCase,
    ExportPesajesExcelUseCase,
    ExportPesajesPdfUseCase,
  ],
  imports: [MaterialModule, RecuperadorModule],
  exports: [PESAJE_REPOSITORY],
})
export class PesajeModule {}
