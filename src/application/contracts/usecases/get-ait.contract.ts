import { AIT } from 'domain/ait.entity';

interface GetAITListResponse {
  data: {
    aits: AIT[];
  };
  metadata: number;
}

interface GetAITListRequest {
  limit: number;
  page: number;
}

interface GetAITDetailRequest {
  placaVeiculo: string;
}

interface GetAitDetailRequest {
  id: string;
  dataInfracao: Date;
  placaVeiculo: string;
  descricao: string;
  valorMulta: Number;
}

export abstract class IGetAITContract {
  abstract getAll(request: GetAITListRequest): Promise<GetAITListResponse>;

  abstract getByPlacaVeiculo(request: GetAITDetailRequest): Promise<AIT[]>;

  abstract getById(request: GetAitDetailRequest): Promise<AIT>;
}
