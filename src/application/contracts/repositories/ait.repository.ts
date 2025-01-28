import { AIT } from '../../../domain';

export interface GetListAitsResponse {
  aits: AIT[];
  total: number;
}
export abstract class IAITRepository {
  abstract create(ait: AIT): Promise<void>;

  abstract findAll(
    limit: number,
    page: number,
  ): Promise<GetListAitsResponse | null>;

  abstract findByPlacaVeiculo(placaVeiculo: string): Promise<AIT | null>;

  abstract update(id: string, ait: AIT): Promise<void>;

  abstract removeById(id: string): Promise<AIT | null>;
}
