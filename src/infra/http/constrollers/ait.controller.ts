import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AIT } from 'domain/ait.entity';
import { CreateAITDto } from '../dtos/create-ait.dto';
import { AITViewModel } from '../view-models/ait-view-model';
import { UpdateAITDto } from '../dtos/update-ait.dto';
import { IAITRepository } from 'application/contracts/repositories/ait.repository';
import { ICreateAITContract } from 'application/contracts/usecases/create-ait.contract';
import { Decimal } from '@prisma/client/runtime/library';
import { IGetAITContract } from 'application/contracts/usecases/get-ait.contract';
import { IUpdateAITContract } from 'application/contracts/usecases/update-ait.contract';
import { IRemoveAITContract } from 'application/contracts/usecases/remove-ait.contract';

@ApiTags('AITs')
@Controller('aits')
export class AITController {
  constructor(
    private createAit: ICreateAITContract,
    private getAit: IGetAITContract,
    private updateAit: IUpdateAITContract,
    private removeAit: IRemoveAITContract,
  ) {}
  @ApiOperation({ summary: 'Create a new AIT' })
  @Post()
  async create(@Body() body: CreateAITDto) {
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
  async update(@Param('id') id: string, @Body() body: UpdateAITDto) {
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
}
