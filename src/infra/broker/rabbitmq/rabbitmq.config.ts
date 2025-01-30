export const RabbitMQConfig = {
  uri: 'amqp://localhost:5672', // URL do RabbitMQ (ajuste se necessário)
  queue: 'csv_queue', // Nome da fila onde os arquivos CSV serão enviados
} as const;
