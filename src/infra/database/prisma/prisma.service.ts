import {
  INestApplication,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['query', 'info', 'warn'],
    });
  }

  // Conectar ao banco de dados quando o módulo for inicializado
  async onModuleInit() {
    await this.$connect();
  }

  // Desconectar do banco de dados quando o módulo for destruído
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
