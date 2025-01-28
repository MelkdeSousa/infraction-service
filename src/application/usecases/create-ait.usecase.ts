import { Injectable } from '@nestjs/common';
import { ICreateAITContract } from '../contracts/usecases/create-ait.contract';
import { IAITRepository } from '../contracts/repositories/ait.repository';
import { AIT } from '../../domain';

@Injectable()
export class CreateAITUseCase implements ICreateAITContract {
  constructor(private aitRepository: IAITRepository) {}
  async execute(request: AIT) {
    await this.aitRepository.create(request);
    return request;
  }
}
