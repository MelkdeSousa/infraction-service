import { Decimal } from '@prisma/client/runtime/library';
import { AIT } from 'domain/ait.entity';

interface PutAitRequest {
  id: string;
  ait: {
    placa_veiculo: string;
    data_infracao: Date;
    descricao: string;
    valor_multa: Decimal;
  };
}
export abstract class IUpdateAITContract {
  abstract execute(request: PutAitRequest): Promise<void>;
}
