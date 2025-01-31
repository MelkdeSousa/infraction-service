import { Injectable } from '@nestjs/common';
import type { ProcessAitsInputDTO } from 'infra/http/dtos/ait';
import { RabbitMQProducer } from 'src/infra/broker/rabbitmq/producer';

@Injectable()
export class ProcessAITUseCase {
  constructor(
    private readonly rabbitMQProducer: RabbitMQProducer,
  ) { }

  async processAndGenerateCsv({ endDate, startDate }: ProcessAitsInputDTO): Promise<string> {
    await this.rabbitMQProducer.sendToQueue({
      id: Date.now().toString(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      timestamp: Date.now(),
    });

    return `Solicitação de geração de CSV enviada para processamento.`;
  }
}
