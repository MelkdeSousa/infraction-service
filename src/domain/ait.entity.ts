import { Decimal } from '@prisma/client/runtime/library';
import { handleSafeParseZod } from 'src/lib/handleSafeParseZod';
import { z } from 'zod';

export const aitSchema = z.object({
  id: z.string().optional(),
  placaVeiculo: z.string().min(7, 'a placa do veículo precisa ter no mínimo 7 caracteres'),
  dataInfracao: z.date(),
  descricao: z.string()
    .min(10, 'descrição precisa ter no mínimo 10 caracteres')
    .max(100, 'descrição precisa ter no máximo 100 caracteres'),
  valorMulta: z.instanceof(Decimal)
    .refine((value) => value.gt(new Decimal(0)), {
      message: 'o valor da multa precisa ser maior que zero',
    })
});

export type AITProps = z.infer<typeof aitSchema>;

export class AIT {
  public id?: string;
  public placaVeiculo: string;
  public dataInfracao: Date;
  public descricao: string;
  public valorMulta: Decimal;

  private constructor(props: AITProps) {
    this.id = props.id;
    this.placaVeiculo = props.placaVeiculo;
    this.dataInfracao = props.dataInfracao;
    this.descricao = props.descricao;
    this.valorMulta = props.valorMulta;
  }

  public update(props: Partial<Omit<AITProps, 'id'>>) {
    const updatedAit = {
      placaVeiculo: props.placaVeiculo ?? this.placaVeiculo,
      dataInfracao: props.dataInfracao ?? this.dataInfracao,
      descricao: props.descricao ?? this.descricao,
      valorMulta: props.valorMulta ?? this.valorMulta,
    };

    const result = aitSchema.omit({ id: true }).safeParse(updatedAit);
    if (result.success === false) throw handleSafeParseZod(result);

    Object.assign(this, updatedAit);
  }

  static create(props: AITProps): [AIT | null, Error | null] {
    try {
      const result = aitSchema.safeParse(props);
      if (result.success === false) throw handleSafeParseZod(result);

      return [new AIT(props), null];
    } catch (error) {
      return [null, error as Error];
    }
  }
}
