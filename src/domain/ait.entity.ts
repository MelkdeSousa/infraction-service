import { z } from 'zod';
import { handleSafeParseZod } from '../lib';

export interface AITProps {
  id: string;
  placaVeiculo: string;
  dataInfracao: Date;
  descricao: string;
  valorMulta: number;
}

export type AITJson = {
  id: string;
  placa_veiculo: string;
  data_infracao: Date;
  descricao: string;
  valor_multa: number;
};

export class AIT {
  private _id: string;
  private _placaVeiculo: string;
  private _dataInfracao: Date;
  private _descricao: string;
  private _valorMulta: number;

  private constructor(props: AITProps) {
    this.validate(props);
    this._id = props.id;
    this._placaVeiculo = props.placaVeiculo;
    this._dataInfracao = props.dataInfracao;
    this._descricao = props.descricao;
    this._valorMulta = props.valorMulta;
  }

  private validate(props: AITProps): void {
    const schema = z.object({
      id: z.string().uuid('id precisa ser um uuid válido'),
      placaVeiculo: z
        .string()
        .min(7, 'a placa do veículo precisa ter no mínimo 7 caracteres'),
      dataInfracao: z.date(),
      descricao: z
        .string()
        .min(10, 'descrição precisa ter no mínimo 10 caracteres')
        .max(100, 'descrição precisa ter no máximo 100 caracteres'),
      valorMulta: z
        .number()
        .positive('o valor da multa precisa ser maior que zero'),
    });

    const result = schema.safeParse(props);

    if (result.success === false) throw handleSafeParseZod(result);
  }

  public toJSON(): Readonly<AITJson> {
    return {
      id: this._id,
      placa_veiculo: this._placaVeiculo,
      data_infracao: this._dataInfracao,
      descricao: this._descricao,
      valor_multa: this._valorMulta,
    };
  }

  public get id() {
    return this._id;
  }

  static create(props: AITProps): [AIT | null, Error | null] {
    try {
      return [new AIT(props), null];
    } catch (error) {
      return [null, error as Error];
    }
  }

  static instance(props: AITProps): [AIT | null, Error | null] {
    return [new AIT(props), null];
  }
}
