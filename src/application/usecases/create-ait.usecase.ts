import { IAITRepository } from '@/application/contracts/repositories/ait';
import { Injectable } from '@nestjs/common';

import { AIT } from '@/domain/ait.entity';

@Injectable()
export class CreateAITUseCase {
  constructor(private readonly aitRepository: IAITRepository) { }
  async execute(request: AIT) {
    await this.aitRepository.create(request);
    return request;
  }
}
