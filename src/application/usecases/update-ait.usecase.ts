import { Injectable } from '@nestjs/common';
import { IAITRepository } from '../contracts/repositories/ait.repository';
import { AIT } from '../../domain';
import { IUpdateAITContract } from '../contracts/usecases/update-ait.contract';

@Injectable()
export class UpdateAITUseCase implements IUpdateAITContract {
  constructor(private aitRepository: IAITRepository) {}

  async execute(request: AIT) {
    await this.aitRepository.update(request.id, request);
    return request;
  }
}
