import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Recuperador } from '../domain/recuperador.entity';
import {
  RECUPERADOR_REPOSITORY,
  type RecuperadorRepository,
} from '../domain/recuperador.repository';
import type { CreateRecuperadorDTO } from '../presentation/schemas/create-recuperador.schema';

@Injectable()
export class CreateRecuperadorUseCase {
  constructor(
    @Inject(RECUPERADOR_REPOSITORY)
    private readonly recuperadorRepository: RecuperadorRepository,
  ) {}

  async execute(data: CreateRecuperadorDTO): Promise<Recuperador> {
    if (data.dni) {
      const existing = await this.recuperadorRepository.findByDni(data.dni);

      if (existing) {
        throw new ConflictException('Ya existe un recuperador con ese dni');
      }
    }

    const recuperador = new Recuperador({
      id: crypto.randomUUID(),
      name: data.name,
      lastName: data.lastName,
      dni: data.dni,
      cuil: data.cuil,
      birthdate: data.birthdate,
      email: data.email,
      phone: data.phone,
      address: data.address,
      account: data.account,
      route: data.route,
      program: data.program,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.recuperadorRepository.save(recuperador);
    return recuperador;
  }
}
