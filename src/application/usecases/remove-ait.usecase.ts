import { IAITRepository } from '@/application/contracts/repositories/ait';
import { Injectable, NotFoundException } from '@nestjs/common';

import { AIT } from '@/domain/ait.entity';

interface RemoveAITRequest {
  id: string;
}

@Injectable()
export class RemoveAITUseCase {
  constructor(private readonly aitRepository: IAITRepository) { }

  async removeById(request: RemoveAITRequest): Promise<AIT> {
    const { id } = request;
    const ait = await this.aitRepository.removeById(id);

    if (!ait) {
      throw new NotFoundException(`AIT com ID ${id} não encontrado.`);
    }

    return ait;
  }
}
