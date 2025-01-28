import { Injectable, NotFoundException } from '@nestjs/common';
import { IAITRepository } from '../contracts/repositories/ait.repository';
import { IRemoveAITContract } from '../contracts/usecases/remove-ait.contract';
import { AIT } from '../../domain';

interface RemoveAITRequest {
  id: string;
}

@Injectable()
export class RemoveAITUseCase implements IRemoveAITContract {
  constructor(private aitRepository: IAITRepository) {}

  async removeById(request: RemoveAITRequest): Promise<AIT> {
    const { id } = request;
    const ait = await this.aitRepository.removeById(id);

    if (!ait) {
      throw new NotFoundException(`AIT com ID ${id} não encontrado.`);
    }

    return ait;
  }
}
