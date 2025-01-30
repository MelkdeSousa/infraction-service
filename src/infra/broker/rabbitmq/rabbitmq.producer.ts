// infra/broker/rabbitmq/rabbitmq.producer.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Channel, Connection, connect } from 'amqplib'; // use amqplib para obter Connection e Channel
import { RABBITMQ_SERVICE } from './rabbitmq.constants';

@Injectable()
export class RabbitMQProducer implements OnModuleInit {
  private channel: Channel;
  private connection: Connection;

  // A injeção do serviço RabbitMQ (a conexão)
  constructor() {}

  // Método OnModuleInit garante que a inicialização do canal ocorra após o Nest iniciar o módulo
  async onModuleInit() {
    this.connection = await connect('amqp://localhost'); // Conectar ao RabbitMQ
    this.channel = await this.connection.createChannel(); // Criar o canal
    await this.channel.assertQueue('csv_queue', { durable: true }); // Assegurar que a fila exista
  }

  // Método de envio para a fila do RabbitMQ
  async sendToQueue(message: any) {
    try {
      // Verificar se o canal foi corretamente criado
      if (!this.channel) {
        throw new Error('Canal não foi criado corretamente');
      }
      // Enviar a mensagem para a fila
      this.channel.sendToQueue(
        'csv_queue',
        Buffer.from(JSON.stringify(message)),
      );
    } catch (error) {
      console.error('Erro ao enviar mensagem para o RabbitMQ:', error);
      throw error;
    }
  }
}
