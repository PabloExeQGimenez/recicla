type RecuperadorProps = {
  id: string;
  name: string;
  lastName: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  dni?: string;
  cuil?: string;
  birthdate?: Date;
  address?: string;
  phone?: string;
  email?: string;
  account?: string;
  route?: string;
  program?: string;
};

export type UpdateRecuperadorProps = {
  name?: string;
  lastName?: string;
  dni?: string;
  cuil?: string;
  birthdate?: Date;
  address?: string;
  phone?: string;
  email?: string;
  account?: string;
  route?: string;
  program?: string;
};

export class Recuperador {
  readonly id: string;
  name: string;
  lastName: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  dni?: string;
  cuil?: string;
  birthdate?: Date;
  address?: string;
  phone?: string;
  email?: string;
  account?: string;
  route?: string;
  program?: string;

  constructor(props: RecuperadorProps) {
    Object.assign(this, props);
  }

  update(data: UpdateRecuperadorProps) {
    if (data.name !== undefined) {
      this.name = data.name;
    }
    if (data.lastName !== undefined) {
      this.lastName = data.lastName;
    }
    if (data.dni !== undefined) {
      this.dni = data.dni;
    }
    if (data.cuil !== undefined) {
      this.cuil = data.cuil;
    }
    if (data.birthdate !== undefined) {
      this.birthdate = data.birthdate;
    }
    if (data.address !== undefined) {
      this.address = data.address;
    }
    if (data.phone !== undefined) {
      this.phone = data.phone;
    }
    if (data.email !== undefined) {
      this.email = data.email;
    }
    if (data.account !== undefined) {
      this.account = data.account;
    }
    if (data.route !== undefined) {
      this.route = data.route;
    }
    if (data.program !== undefined) {
      this.program = data.program;
    }
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
