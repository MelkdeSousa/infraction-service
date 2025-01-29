import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaAITRepository } from './prisma/repositories/prisma-ait.repository';

@Module({
  providers: [PrismaService, PrismaAITRepository], // Adicione o PrismaService e o PrismaAITRepository
  exports: [PrismaService, PrismaAITRepository], // Exporte o PrismaService e o PrismaAITRepository
})
export class DatabaseModule {}
