// infra/broker/rabbitmq/rabbitmq.producer.ts
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Channel, Connection, connect } from 'amqplib';
import { envs } from 'src/config/envs';
import type { QueueMessage } from './consumer';


@Injectable()
export class RabbitMQProducer implements OnModuleInit, OnModuleDestroy {
  private channel: Channel;
  private connection: Connection;
  private readonly logger = new Logger(RabbitMQProducer.name);
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // 1 second
  private connected = false;

  async onModuleInit() {
    await this.initialize();
  }

  private async initialize(retryCount = 0) {
    try {
      this.connection = await connect(envs.RABBIT.URI);
      this.channel = await this.connection.createChannel();

      // Setup queue with dead letter exchange
      await this.channel.assertQueue(envs.RABBIT.QUEUES.CSV, {
        durable: true,
        deadLetterExchange: 'dlx',
        deadLetterRoutingKey: `${envs.RABBIT.QUEUES.CSV}.dlq`
      });

      this.connection.on('close', () => {
        this.connected = false;
        this.logger.warn('RabbitMQ connection closed');
      });

      // Handle connection errors
      this.connection.on('error', (error) => {
        this.logger.error('RabbitMQ connection error:', error);
        this.attemptReconnect();
      });

      this.connected = true;

      this.logger.log('RabbitMQ Producer initialized successfully');
    } catch (error) {
      if (retryCount < this.maxRetries) {
        this.logger.warn(`Failed to connect. Retrying (${retryCount + 1}/${this.maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        await this.initialize(retryCount + 1);
      } else {
        this.logger.error('Failed to initialize RabbitMQ producer:', error);
        throw error;
      }
    }
  }

  private async attemptReconnect() {
    try {
      await this.closeConnections();
      await this.initialize();
    } catch (error) {
      this.logger.error('Failed to reconnect:', error);
    }
  }

  async sendToQueue(message: QueueMessage): Promise<boolean> {
    try {
      if (!this.isConnectionHealthy()) {
        await this.initialize();
      }

      await this.channel.sendToQueue(
        envs.RABBIT.QUEUES.CSV,
        Buffer.from(JSON.stringify(message)),
        {
          persistent: true,
          timestamp: Date.now(),
          messageId: message.id
        }
      );

      this.logger.debug(`Message sent successfully: ${message.id}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send message ${message.id}:`, error);
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }

  private isConnectionHealthy(): boolean {
    return this.connection && this.connected;
  }

  private async closeConnections() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
    } catch (error) {
      this.logger.error('Error closing connections:', error);
    }
  }

  async onModuleDestroy() {
    await this.closeConnections();
    this.logger.log('RabbitMQ Producer shutdown complete');
  }
}
