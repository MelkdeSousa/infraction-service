import { IAITRepository } from '@/application/contracts/repositories/ait';
import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';


interface PutAitRequest {
  id: string;
  ait: {
    placa_veiculo: string;
    data_infracao: Date;
    descricao: string;
    valor_multa: Decimal;
  };
}
@Injectable()
export class UpdateAITUseCase {
  constructor(private readonly aitRepository: IAITRepository) { }

  async execute(request: PutAitRequest): Promise<void> {
    const { id, ait } = request;
    const aitRequest = await this.aitRepository.findById(id);
    aitRequest.update(
      {
        dataInfracao: ait.data_infracao,
        descricao: ait.descricao,
        placaVeiculo: ait.placa_veiculo,
        valorMulta: ait.valor_multa,
      }
    );
    await this.aitRepository.update(id, aitRequest);
  }
}
