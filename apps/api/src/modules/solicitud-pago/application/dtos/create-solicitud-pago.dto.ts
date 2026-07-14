export type CreateSolicitudPagoDTO = {
  from: Date;
  to: Date;
  excludedPesajeIds?: string[];
};
