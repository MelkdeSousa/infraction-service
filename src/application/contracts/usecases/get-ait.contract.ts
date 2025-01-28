import { AIT } from '../../../domain';

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

export abstract class IGetAITContract {
  abstract getAll(request: GetAITListRequest): Promise<GetAITListResponse>;

  abstract getByPlacaVeiculo(request: GetAITDetailRequest): Promise<AIT>;
}
