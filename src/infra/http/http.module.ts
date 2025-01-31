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
    GetAITUseCase,
    CreateAITUseCase,
    RemoveAITUseCase,
    UpdateAITUseCase,
    PrismaAITRepository,
    ProcessAITUseCase,
  ],
})
export class HttpModule { }
