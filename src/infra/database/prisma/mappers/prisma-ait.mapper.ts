import { Ait as AITPrisma } from '@prisma/client'; // Modelo de AIT gerado pelo Prisma
import { AIT } from 'domain/ait.entity';

// Mapper para converter de Prisma para a entidade de domínio AIT

export class AITMapper {
  // Método estático para mapear de Prisma para a entidade de domínio
  static toDomain(aitPrisma: AITPrisma): AIT {
    return AIT.create({
      placaVeiculo: aitPrisma.placa_veiculo,
      dataInfracao: aitPrisma.data_infracao,
      descricao: aitPrisma.descricao,
      valorMulta: aitPrisma.valor_multa,
    })[0];
  }

  // Método estático para mapear de domínio para o formato que o Prisma espera
  static toPrisma(aitDomain: AIT): Omit<AITPrisma, 'id'> {
    return {
      placa_veiculo: aitDomain.placaVeiculo,
      data_infracao: aitDomain.dataInfracao,
      descricao: aitDomain.descricao,
      valor_multa: aitDomain.valorMulta,
    };
  }

  static toDomainList(aitsPrisma: AITPrisma[]): AIT[] {
    return aitsPrisma.map(AITMapper.toDomain);
  }

  static toPrismaList(aitsDomain: AIT[]): Omit<AITPrisma, 'id'>[] {
    return aitsDomain.map(AITMapper.toPrisma);
  }
}
