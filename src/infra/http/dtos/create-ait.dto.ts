import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAITDto {
  @ApiProperty({ example: 'ABC1234' })
  placa_veiculo: string;

  @ApiProperty({ example: '2025-01-28T12:00:00Z' })
  data_infracao: Date;

  @ApiProperty({ example: 'Estacionamento proibido' })
  descricao: string;

  @ApiProperty({ example: 150.75 })
  valor_multa: number;
}
