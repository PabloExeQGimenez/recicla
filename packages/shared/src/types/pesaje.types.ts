export interface RecuperadorRef {
  id: string;
  name: string;
  lastName: string;
}

export interface MaterialRef {
  id: string;
  name: string;
}

export interface PesajeItemResponse {
  id: string;
  materialId: string;
  material: MaterialRef;
  weight: number;
  pricePerKgAtMoment: number;
  subtotal: number;
}

export interface PesajeResponse {
  id: string;
  recuperadorId: string;
  recuperador: RecuperadorRef;
  status: string;
  totalAmount: number;
  items: PesajeItemResponse[];
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePesajeItem {
  materialId: string;
  weight: number;
}

export interface CreatePesaje {
  recuperadorId: string;
  date: string;
  items: CreatePesajeItem[];
}
