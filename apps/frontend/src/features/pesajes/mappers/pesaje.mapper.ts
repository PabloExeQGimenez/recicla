import type {
  PesajeAPIResponse,
  PesajeDTO,
  PesajePago,
  RecuperadorRefDTO,
  MaterialRefDTO,
} from '../types/pesaje.types';

const STATUS_MAP: Record<string, PesajePago> = {
  PENDING: 'pendiente',
  PAYMENT_REQUESTED: 'solicitado',
  PAID: 'pagado',
};

const mapRecuperador = (api: PesajeAPIResponse['recuperador']): RecuperadorRefDTO => ({
  id: api.id,
  nombre: api.name,
  apellido: api.lastName,
});

const mapMaterial = (api: PesajeAPIResponse['items'][number]['material']): MaterialRefDTO => ({
  id: api.id,
  nombre: api.name,
});

export const flattenPesaje = (api: PesajeAPIResponse): PesajeDTO[] => {
  return api.items.map((item) => ({
    id: api.id,
    itemId: item.id,
    recuperador: mapRecuperador(api.recuperador),
    material: mapMaterial(item.material),
    cantidad: item.weight,
    precio: item.pricePerKgAtMoment,
    monto: item.subtotal,
    fecha: api.date,
    pago: STATUS_MAP[api.status] ?? 'pendiente',
  }));
};


