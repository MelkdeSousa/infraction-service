import { IAITRepository } from '@/application/contracts/repositories/ait.repository';
import { ICreateAITContract } from '@/application/contracts/usecases/create-ait.contract';
import { IGetAITContract } from '@/application/contracts/usecases/get-ait.contract';
import { IRemoveAITContract } from '@/application/contracts/usecases/remove-ait.contract';
import { IUpdateAITContract } from '@/application/contracts/usecases/update-ait.contract';
import { CreateAITUseCase } from '@/application/usecases/create-ait.usecase';
import { GetAITUseCase } from '@/application/usecases/get-ait.usecase';
import { ProcessAITUseCase } from '@/application/usecases/process-ait.usecase';
import { RemoveAITUseCase } from '@/application/usecases/remove-ait.usecase';
import { UpdateAITUseCase } from '@/application/usecases/update-ait.usecase';
import { DatabaseModule } from '@/infra/database/database.module'; // Importação do DatabaseModule
import { PrismaAITRepository } from '@/infra/database/prisma/repositories/prisma-ait.repository';
import { Module } from '@nestjs/common';
import { RabbitMQModule } from '../broker/rabbitmq/module';
import { AITController } from './constrollers/ait.controller';

@Module({
  imports: [DatabaseModule, RabbitMQModule], // Certifique-se de importar o DatabaseModule
  controllers: [AITController],
  providers: [
    { provide: IGetAITContract, useClass: GetAITUseCase },
    { provide: ICreateAITContract, useClass: CreateAITUseCase },
    { provide: IRemoveAITContract, useClass: RemoveAITUseCase },
    { provide: IUpdateAITContract, useClass: UpdateAITUseCase },
    { provide: IAITRepository, useClass: PrismaAITRepository },
    ProcessAITUseCase,
  ],
})
export class HttpModule { }
