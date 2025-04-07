import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { DataSource } from 'typeorm';
import { ResultExecuteQueryResponse } from './dtos/response.dto';

@Injectable()
export class IndexerTableService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(IndexerTableService.name);
  }

  async executeQuery(query: string): Promise<ResultExecuteQueryResponse> {
    // TODO: validate query not have UPDATE to specific table

    const result = await this.dataSource.query(query);
    const schema = Object.keys(result[0]).reduce((acc, key) => {
      acc[key] = typeof result[0][key];
      return acc;
    }, {});
    const rows = result.map((row) => {
      const newRow = {};
      Object.keys(row).forEach((key) => {
        newRow[key] = row[key];
      });
      return newRow;
    });

    return {
      query,
      schema,
      rows,
    };
  }
}
