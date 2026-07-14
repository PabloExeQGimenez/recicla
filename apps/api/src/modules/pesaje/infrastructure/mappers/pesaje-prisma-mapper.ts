import { Prisma } from '@prisma/client';
import { Pesaje } from '../../domain/pesaje.entity';
import { PesajeItem } from '../../domain/pesaje-item.vo';
import { PesajeStatus } from '../../domain/pesaje-status.enum';

type PrismaPesajeWithRelations = Prisma.PesajeGetPayload<{
  include: {
    recuperador: true;
    items: {
      include: {
        material: true;
      };
    };
  };
}>;

export class PesajePrismaMapper {
  static toDomain(pesaje: PrismaPesajeWithRelations): Pesaje {
    return new Pesaje({
      id: pesaje.id,
      recuperadorId: pesaje.recuperadorId,
      status: pesaje.status as PesajeStatus,
      date: pesaje.date,
      createdAt: pesaje.createdAt,
      updatedAt: pesaje.updatedAt,
      recuperador: {
        id: pesaje.recuperador.id,
        name: pesaje.recuperador.name,
        lastName: pesaje.recuperador.lastName,
        dni: pesaje.recuperador.dni ?? undefined,
      },
      items: pesaje.items.map(
        (item) =>
          new PesajeItem({
            id: item.id,
            materialId: item.materialId,
            weight: item.weight.toNumber(),
            pricePerKgAtMoment: item.pricePerKgAtMoment.toNumber(),
            material: {
              id: item.material.id,
              name: item.material.name,
            },
          }),
      ),
    });
  }
}
