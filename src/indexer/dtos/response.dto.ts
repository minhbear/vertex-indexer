import { ApiProperty } from '@nestjs/swagger';
import {
  IndexerTableMetadataEntity,
  ISchemaTableDefinition,
} from 'src/database/entities';

export class IndexerTableMetadataResponse {
  @ApiProperty()
  tableName: string;

  @ApiProperty()
  fullTableName: string;

  @ApiProperty({
    type: [ISchemaTableDefinition],
  })
  schema: ISchemaTableDefinition[];

  @ApiProperty()
  indexerId: number;

  constructor(tableMetadata: IndexerTableMetadataEntity) {
    this.tableName = tableMetadata.tableName;
    this.fullTableName = tableMetadata.fullTableName;
    this.schema = tableMetadata.schema;
    this.indexerId = tableMetadata.indexerId;
  }
}

export class ResultExecuteQueryResponse {
  @ApiProperty()
  query: string;

  @ApiProperty()
  schema: { [key: string]: string };

  @ApiProperty()
  rows: { [key: string]: string }[];
}
