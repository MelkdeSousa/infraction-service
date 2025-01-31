import { Module } from '@nestjs/common';
import { RABBITMQ_SERVICE } from 'src/config/constants';
import { envs } from 'src/config/envs';
import { ProcessCSVConsumer } from './consumer';
import { RabbitMQProducer } from './producer';

@Module({
  providers: [
    RabbitMQProducer,
    {
      provide: RABBITMQ_SERVICE,
      useFactory: async () => {
        const amqp = await import('amqplib');
        const url = envs.RABBIT.QUEUES.CSV;

        try {
          const connection = await amqp.connect(url, {
            heartbeat: 60,
            timeout: 60000,
          });

          connection.on('error', (err) => {
            console.error('RabbitMQ connection error:', err);
          });

          process.on('SIGINT', async () => {
            await connection.close();
            process.exit(0);
          });

          return connection;
        } catch (error) {
          console.error('Failed to connect to RabbitMQ:', error);
          throw error;
        }
      },
    },
    ProcessCSVConsumer,
  ],
  exports: [RabbitMQProducer, ProcessCSVConsumer],
})
export class RabbitMQModule { }
