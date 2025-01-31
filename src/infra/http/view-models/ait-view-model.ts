import type { AIT } from "@/domain/ait.entity";

export class AITViewModel {
  static toHttp(ait: AIT) {
    return {
      id: ait.id,
      placa_veiculo: ait.placaVeiculo, // Mudei para usar `placa_veiculo`
      data_infracao: ait.dataInfracao,
      descricao: ait.descricao,
      valor_multa: ait.valorMulta.toFixed(2), // Convertendo Decimal para string formatada
    };
  }

  static toHttpList(aits: AIT[]) {
    return aits.map((ait) => this.toHttp(ait));
  }
}
