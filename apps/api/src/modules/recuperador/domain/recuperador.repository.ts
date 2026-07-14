import { RecuperadorFilters } from './recuperador-filters';
import { Recuperador } from './recuperador.entity';

export const RECUPERADOR_REPOSITORY = Symbol('RECUPERADOR_REPOSITORY');

export interface RecuperadorRepository {
  findById(id: string): Promise<Recuperador | null>;
  findAll(filters: RecuperadorFilters): Promise<Recuperador[]>;
  count(filters: RecuperadorFilters): Promise<number>;
  save(recuperador: Recuperador): Promise<void>;
  update(recuperador: Recuperador): Promise<void>;
  findByDni(dni: string): Promise<Recuperador | null>;
}
