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
import { ProcessAITUseCase } from 'application/usecases/process-ait.usecase';
import { PrismaAITRepository } from 'infra/database/prisma/repositories/prisma-ait.repository';
import { IAITRepository } from 'application/contracts/repositories/ait.repository';
import { RabbitMQModule } from '../broker/rabbitmq/rabbitpq.module';
import { RabbitMQProducer } from '../broker/rabbitmq/rabbitmq.producer';
import { RabbitMQConsumer } from '../broker/rabbitmq/rabbitmq.consumer';

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
export class HttpModule {}
