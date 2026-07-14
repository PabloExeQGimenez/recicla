export type MaterialRef = {
  id: string;
  name: string;
};

export type PesajeItemProps = {
  id?: string;
  materialId: string;
  weight: number;
  pricePerKgAtMoment: number;
  material?: MaterialRef;
};

export class PesajeItem {
  readonly id?: string;
  readonly materialId: string;
  readonly weight: number;
  readonly pricePerKgAtMoment: number;
  readonly material?: MaterialRef;

  constructor(props: PesajeItemProps) {
    if (props.weight <= 0) {
      throw new Error('El peso debe ser mayor a cero');
    }

    if (props.pricePerKgAtMoment <= 0) {
      throw new Error('El precio debe ser mayor a cero');
    }

    if (!props.materialId.trim()) {
      throw new Error('El material es obligatorio');
    }

    this.id = props.id;
    this.materialId = props.materialId;
    this.weight = props.weight;
    this.pricePerKgAtMoment = props.pricePerKgAtMoment;
    this.material = props.material;
  }

  get subtotal(): number {
    return this.weight * this.pricePerKgAtMoment;
  }
}
