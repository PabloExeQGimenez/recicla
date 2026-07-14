import { Pesaje } from './pesaje.entity';
import { PesajeFilters } from './pesaje-filters';

export const PESAJE_REPOSITORY = Symbol('PESAJE_REPOSITORY');

export interface PesajeRepository {
  findAll(filters: PesajeFilters): Promise<Pesaje[]>;
  count(filters: PesajeFilters): Promise<number>;
  countItems(filters: PesajeFilters): Promise<number>;
  findById(id: string): Promise<Pesaje | null>;
  save(pesaje: Pesaje): Promise<void>;
  update(pesaje: Pesaje): Promise<void>;
  delete(id: string): Promise<void>;
  deleteItem(itemId: string): Promise<void>;
  findPendingPesajesByDateRange(from: Date, to: Date): Promise<Pesaje[]>;
  assignToPaymentRequest(
    pesajeIds: string[],
    solicitudPagoId: string,
  ): Promise<void>;
  markAsPaid(pesajeIds: string[]): Promise<void>;
  removeFromPaymentRequest(pesajeIds: string[]): Promise<void>;
}
