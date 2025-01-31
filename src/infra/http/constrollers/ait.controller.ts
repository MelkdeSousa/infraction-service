import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Decimal } from '@prisma/client/runtime/library';

import type { CreateAITUseCase } from '@/application/usecases/create-ait.usecase';
import type { GetAITUseCase } from '@/application/usecases/get-ait.usecase';
import type { ProcessAITUseCase } from '@/application/usecases/process-ait.usecase';
import type { RemoveAITUseCase } from '@/application/usecases/remove-ait.usecase';
import type { UpdateAITUseCase } from '@/application/usecases/update-ait.usecase';
import { AIT } from '@/domain/ait.entity';
import { CreateAITInputDto, type ProcessAitsInputDTO, type UpdateAITInputDto } from '../dtos/ait';
import { AITViewModel } from '../view-models/ait-view-model';

@ApiTags('AITs')
@Controller('aits')
export class AITController {
  constructor(
    private readonly createAit: CreateAITUseCase,
    private readonly getAit: GetAITUseCase,
    private readonly updateAit: UpdateAITUseCase,
    private readonly removeAit: RemoveAITUseCase,
    private readonly processAITUseCase: ProcessAITUseCase,
  ) { }
  @ApiOperation({ summary: 'Create a new AIT' })
  @Post()
  async create(@Body() body: CreateAITInputDto) {
    const { placa_veiculo, data_infracao, descricao, valor_multa } = body;

    // Criar instância de AIT corretamente
    const [ait, error] = AIT.create({
      placaVeiculo: placa_veiculo,
      dataInfracao: new Date(data_infracao), // Certifique-se de que é um Date válido
      descricao,
      valorMulta: new Decimal(valor_multa), // Convertendo para Decimal corretamente
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    // Agora chamamos `execute` passando a instância correta de AIT
    const createdAIT = await this.createAit.execute(ait);

    return createdAIT;
  }

  @ApiOperation({ summary: 'Get all AITs with pagination' })
  @ApiResponse({
    status: 200,
    description: 'The list of AITs has been retrieved successfully.',
  })
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const ait = await this.getAit.getAll({ limit, page });
    if (!ait) return 'aits not found';
    return {
      data: AITViewModel.toHttpList(ait.data.aits),
      total: ait.metadata,
    };
  }

  @ApiOperation({ summary: 'Get AITs by Placa Veiculo' })
  @ApiResponse({
    status: 200,
    description: 'AITs retrieved successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Placa não encontrada.', // Swagger exibe essa mensagem no erro 404
  })
  @Get(':placaVeiculo')
  async findByPlacaVeiculo(@Param('placaVeiculo') placaVeiculo: string) {
    try {
      const aits = await this.getAit.getByPlacaVeiculo({ placaVeiculo });
      return { data: AITViewModel.toHttpList(aits) };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Repassa o erro corretamente
      }
      throw new Error('Erro interno no servidor');
    }
  }

  @ApiOperation({ summary: 'Update an AIT' })
  @ApiResponse({
    status: 200,
    description: 'The AIT has been updated successfully.',
  })
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateAITInputDto) {
    await this.updateAit.execute({ id, ait: body });
    return body;
  }

  @ApiOperation({ summary: 'Delete an AIT' })
  @ApiResponse({
    status: 200,
    description: 'The AIT has been deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'AIT not found.' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const ait = await this.removeAit.removeById({ id });
    if (!ait) {
      return { message: 'AIT not found.' };
    }
    return {
      message: 'AIT successfully deleted.',
      data: AITViewModel.toHttp(ait),
    };
  }

  @ApiOperation({
    summary: 'Gets the list of processed AITs',
  })
  @ApiResponse({
    status: 200,
    description: 'List of processed AITs',
  })
  @ApiResponse({
    status: 500,
    description: 'Error while querying processed AITs',
  })
  @Post('gerar-csv')
  async processAit(@Body() body: ProcessAitsInputDTO): Promise<string> {
    return await this.processAITUseCase.processAndGenerateCsv(body);
  }
}
