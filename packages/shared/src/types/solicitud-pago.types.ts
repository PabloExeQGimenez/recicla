import { PesajeResponse } from "./pesaje.types.js";
import { SolicitudPagoStatus } from "../enums/solicitud-pago-status.enum.js";

export interface SolicitudPago {
  id: string;
  from: string;
  to: string;
  status: SolicitudPagoStatus;
  createdAt: string;
}

export interface SolicitudPagoListItem {
  id: string;
  from: string;
  to: string;
  status: SolicitudPagoStatus;
  createdAt: string;
  totalAmount: number;
  itemsCount: number;
}

export interface SolicitudPagoDetail {
  id: string;
  from: string;
  to: string;
  status: SolicitudPagoStatus;
  createdAt: string;
  pesajes: PesajeResponse[];
}

export interface CreateSolicitudPago {
  from: string;
  to: string;
  excludedPesajeIds?: string[];
}
