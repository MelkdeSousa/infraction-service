import { IAITRepository } from '@/application/contracts/repositories/ait.repository';
import { ICreateAITContract } from '@/application/contracts/usecases/create-ait.contract';
import { Injectable } from '@nestjs/common';

import { AIT } from '@/domain/ait.entity';

@Injectable()
export class CreateAITUseCase implements ICreateAITContract {
  constructor(private aitRepository: IAITRepository) { }
  async execute(request: AIT) {
    await this.aitRepository.create(request);
    return request;
  }
}
