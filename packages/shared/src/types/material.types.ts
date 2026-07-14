export interface Material {
  id: string;
  name: string;
  currentPrice: number;
  active: boolean;
}

export interface CreateMaterial {
  name: string;
  currentPrice: number;
}

export interface ChangeMaterialPrice {
  currentPrice: number;
}
