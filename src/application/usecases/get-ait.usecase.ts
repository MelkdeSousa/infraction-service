import { Injectable } from '@nestjs/common';
import { IGetAITContract } from '../contracts/usecases/get-ait.contract';
import { IAITRepository } from '../contracts/repositories/ait.repository';
import { AIT } from '../../domain';

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
@Injectable()
export class GetAITUseCase implements IGetAITContract {
  constructor(private aitRepository: IAITRepository) {}
  async getByPlacaVeiculo(request: GetAITDetailRequest): Promise<AIT> {
    const { placaVeiculo } = request;
    const ait = await this.aitRepository.findByPlacaVeiculo(placaVeiculo);
    if (ait == null) {
      throw Error('placa não encontrada');
    }
    return ait;
  }

  async getAll(request: GetAITListRequest): Promise<GetAITListResponse> {
    const { limit, page } = request;
    const ait = await this.aitRepository.findAll(limit, page);
    if (ait == null) {
      throw Error('ait não encontrada');
    }
    return { data: ait, metadata: ait.total };
  }
}
