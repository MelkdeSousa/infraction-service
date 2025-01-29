import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaAITRepository } from './prisma/repositories/prisma-ait.repository';
import { IAITRepository } from 'application/contracts/repositories/ait.repository';

@Module({
  providers: [
    PrismaService,
    { provide: IAITRepository, useClass: PrismaAITRepository }, // Use a interface e a implementação
  ],
  exports: [IAITRepository], // Exporte a interface para ser usada em outros módulos
})
export class DatabaseModule {}
