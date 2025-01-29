import { Module } from '@nestjs/common';
import { DatabaseModule } from 'infra/database/database.module'; // Importação do DatabaseModule
import { IGetAITContract } from 'application/contracts/usecases/get-ait.contract';
import { GetAITUseCase } from 'application/usecases/get-ait.usecase';
import { ICreateAITContract } from 'application/contracts/usecases/create-ait.contract';
import { CreateAITUseCase } from 'application/usecases/create-ait.usecase';
import { IRemoveAITContract } from 'application/contracts/usecases/remove-ait.contract';
import { RemoveAITUseCase } from 'application/usecases/remove-ait.usecase';
import { IUpdateAITContract } from 'application/contracts/usecases/update-ait.contract';
import { UpdateAITUseCase } from 'application/usecases/update-ait.usecase';
import { AITController } from './constrollers/ait.controller';

@Module({
  imports: [DatabaseModule], // Certifique-se de importar o DatabaseModule
  controllers: [AITController],
  providers: [
    { provide: IGetAITContract, useClass: GetAITUseCase },
    { provide: ICreateAITContract, useClass: CreateAITUseCase },
    { provide: IRemoveAITContract, useClass: RemoveAITUseCase },
    { provide: IUpdateAITContract, useClass: UpdateAITUseCase },
  ],
})
export class HttpModule {}
