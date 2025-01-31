import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { Channel, connect, Connection, ConsumeMessage } from 'amqplib';
import { envs } from 'src/config/envs';

interface QueueMessage {
  id: string;
  url: string;
  timestamp: number;
}

@Injectable()
export class ProcessCSVConsumer implements OnModuleInit, OnModuleDestroy {
  private channel: Channel;
  private connection: Connection;
  private readonly logger = new Logger(ProcessCSVConsumer.name);
  private readonly maxRetries = 3;

  constructor() { }

  async onModuleInit() {
    try {
      const url = envs.RABBIT.URI;
      this.connection = await connect(url);
      this.channel = await this.connection.createChannel();

      const queueName = envs.RABBIT.QUEUES.CSV;
      await this.channel.assertQueue(queueName, {
        durable: true,
        deadLetterExchange: 'dlx',
        deadLetterRoutingKey: `${queueName}.dlq`
      });

      // Setup Dead Letter Queue
      await this.channel.assertExchange('dlx', 'direct');
      await this.channel.assertQueue(`${queueName}.dlq`, { durable: true });
      await this.channel.bindQueue(`${queueName}.dlq`, 'dlx', `${queueName}.dlq`);

      await this.consumeQueue(queueName);
      this.logger.log(`RabbitMQ Consumer initialized and listening to ${queueName}`);
    } catch (error) {
      this.logger.error('Failed to initialize RabbitMQ consumer:', error);
      throw error;
    }
  }

  private async consumeQueue(queueName: string) {
    this.channel.consume(
      queueName,
      async (msg: ConsumeMessage | null) => {
        if (!msg) return;

        try {
          const messageContent = JSON.parse(msg.content.toString()) as QueueMessage;
          this.logger.debug(`Processing message: ${messageContent.id}`);

          await this.processMessage(messageContent);
          this.channel.ack(msg);

        } catch (error) {
          const retryCount = this.getRetryCount(msg);

          if (retryCount < this.maxRetries) {
            this.logger.warn(`Retrying message (${retryCount + 1}/${this.maxRetries})`);
            this.channel.nack(msg, false, false);
          } else {
            this.logger.error(`Failed to process message after ${this.maxRetries} retries`, error);
            // Move to DLQ
            this.channel.ack(msg);
          }
        }
      },
      { noAck: false },
    );
  }

  private async processMessage(message: QueueMessage): Promise<void> {
    this.logger.debug(`Downloading from URL: ${message.url}`);
    // Add your processing logic here
    // If any error occurs, it will be caught by the try-catch in consumeQueue
  }

  private getRetryCount(msg: ConsumeMessage): number {
    const deaths = msg.properties.headers['x-death'];
    return deaths ? deaths.length : 0;
  }

  async onModuleDestroy() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      this.logger.log('RabbitMQ connections closed');
    } catch (error) {
      this.logger.error('Error closing RabbitMQ connections:', error);
    }
  }
}
