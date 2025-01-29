import { Injectable } from '@nestjs/common';
import { IAITRepository } from 'application/contracts/repositories/ait.repository';
import { createObjectCsvWriter } from 'csv-writer'; // Importando o csv-writer
import { join } from 'path'; // Para manipular caminhos de arquivos
import * as fs from 'fs';
import * as iconv from 'iconv-lite'; // Para garantir a codificação correta dos caracteres especiais

@Injectable()
export class ProcessAITUseCase {
  constructor(private readonly aitRepository: IAITRepository) {}

  async processAndGenerateCsv(): Promise<string> {
    const dirPath = join(__dirname, '..', '..', 'exports');

    // Verificar se o diretório existe, e se não, criar
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true }); // { recursive: true } garante a criação de subdiretórios
    }

    // Buscar todas as AITs, você pode adicionar parâmetros de paginação se necessário
    const result = await this.aitRepository.findAll(100, 1); // Exemplo: 100 AITs por página
    if (!result || !result.aits.length) {
      throw new Error('Nenhuma AIT encontrada para gerar o CSV!');
    }

    // Definir o caminho do arquivo CSV
    const filePath = join(
      __dirname,
      '..',
      '..',
      'exports',
      `ait_export_${Date.now()}.csv`,
    );

    // Criar o escritor de CSV
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'placaVeiculo', title: 'Placa Veículo' },
        { id: 'dataInfracao', title: 'Data Infração' },
        { id: 'descricao', title: 'Descrição' },
        { id: 'valorMulta', title: 'Valor Multa' },
      ],
      encoding: 'utf8', // Garantir que o CSV seja gravado com codificação UTF-8
    });

    // Processar e escrever as AITs no arquivo CSV
    await csvWriter.writeRecords(result.aits);

    // Adicionar o BOM no início do arquivo para garantir que o Excel interprete corretamente a codificação UTF-8
    const csvContent = fs.readFileSync(filePath, 'utf-8');
    const bom = '\uFEFF'; // Byte Order Mark para UTF-8
    fs.writeFileSync(filePath, bom + csvContent, 'utf8');

    return `Arquivo CSV gerado com sucesso! Caminho: ${filePath}`;
  }
}
