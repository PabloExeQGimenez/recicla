type MaterialProps = {
  id: string;
  name: string;
  currentPrice: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class Material {
  readonly id: string;
  readonly name: string;
  currentPrice: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: MaterialProps) {
    Object.assign(this, props);
  }

  changePrice(price: number) {
    if (price < 0) {
      throw new Error('El precio debe ser mayor a 0');
    }
    this.currentPrice = price;
    this.updatedAt = new Date();
  }

  activate() {
    this.active = true;
    this.updatedAt = new Date();
  }

  deactivate() {
    this.active = false;
    this.updatedAt = new Date();
  }
}
