// infra/broker/rabbitmq/rabbitmq.consumer.ts
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Channel, Connection, connect } from 'amqplib'; // Use amqplib para obter Connection e Channel

@Injectable()
export class RabbitMQConsumer implements OnModuleDestroy {
  private channel: Channel;
  private connection: Connection;

  constructor() {}

  // Método OnModuleInit garante que a inicialização do canal ocorra após o Nest iniciar o módulo
  async onModuleInit() {
    this.connection = await connect('amqp://localhost'); // Conectar ao RabbitMQ
    this.channel = await this.connection.createChannel(); // Criar o canal
    await this.channel.assertQueue('csv_queue', { durable: true }); // Assegurar que a fila exista
    this.consumeQueue(); // Consumir a fila
  }

  // Método para consumir a fila
  private consumeQueue() {
    this.channel.consume(
      'csv_queue',
      (msg) => {
        if (msg) {
          const messageContent = JSON.parse(msg.content.toString());
          console.log('Mensagem recebida da fila:', messageContent);

          // Aqui você pode processar a mensagem, por exemplo, fazer o download do arquivo
          this.downloadMessage(messageContent);

          // Confirmar que a mensagem foi processada
          this.channel.ack(msg);
        }
      },
      { noAck: false },
    );
  }

  // Simula o "download" da mensagem, você pode adaptar para o seu caso
  private downloadMessage(messageContent: any) {
    console.log('Baixando a mensagem:', messageContent);
    // Implementação do download ou processamento aqui
  }

  // Método para fechar a conexão corretamente quando o serviço for destruído
  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }
}
