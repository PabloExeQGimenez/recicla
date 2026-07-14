import { PaginatedResponseDTO } from '../dtos/paginated-response.dto';

export class PaginateResponseMapper {
  static map<T, R>(
    result: PaginatedResponseDTO<T>,
    mapper: (item: T) => R,
  ): PaginatedResponseDTO<R> {
    return {
      ...result,
      data: result.data.map(mapper),
    };
  }
}
