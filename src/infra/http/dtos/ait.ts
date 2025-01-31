import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { Transform } from 'class-transformer';

export class CreateAITInputDto {
  @ApiProperty({ example: 'ABC1234' })
  placa_veiculo: string;

  @ApiProperty({ example: '2025-01-28T12:00:00Z' })
  data_infracao: Date;

  @ApiProperty({ example: 'Estacionamento proibido' })
  descricao: string;

  @ApiProperty({ example: 150.75 })
  valor_multa: number;
}

export class ProcessAitsInputDTO {
  @ApiProperty({ example: '2025-01-28T12:00:00Z' })
  startDate: Date;

  @ApiProperty({ example: '2025-01-28T12:00:00Z' })
  endDate: Date;
}


export class UpdateAITInputDto {
  @ApiProperty({ example: 'ABC1234' })
  placa_veiculo: string;

  @ApiProperty({ example: '2025-01-28T12:00:00Z' })
  @Transform(({ value }) => new Date(value)) // Convertendo string para Date
  data_infracao: Date;

  @ApiProperty({ example: 'Estacionamento proibido' })
  descricao: string;

  @ApiProperty({ example: 150.75 })
  @Transform(({ value }) => new Decimal(value)) // Convertendo número para Decimal
  valor_multa: Decimal;
}
