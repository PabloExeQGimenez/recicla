import { Recuperador } from '../../domain/recuperador.entity';
import type { Recuperador as RecuperadorResponseDTO } from '@recicla/shared';

export class RecuperadorResponseMapper {
  static toResponse(recuperador: Recuperador): RecuperadorResponseDTO {
    return {
      id: recuperador.id,
      name: recuperador.name,
      lastName: recuperador.lastName,
      dni: recuperador.dni,
      cuil: recuperador.cuil,
      birthdate: recuperador.birthdate?.toISOString(),
      address: recuperador.address,
      phone: recuperador.phone,
      email: recuperador.email,
      account: recuperador.account,
      route: recuperador.route,
      program: recuperador.program,
      active: recuperador.active,
      createdAt: recuperador.createdAt.toISOString(),
      updatedAt: recuperador.updatedAt.toISOString(),
    };
  }
}
