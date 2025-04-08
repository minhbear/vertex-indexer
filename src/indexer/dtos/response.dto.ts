import { ApiProperty } from '@nestjs/swagger';
import { TriggerType } from 'src/common/enum/common.enum';
import {
  IndexerTableMetadataEntity,
  IndexerTriggerEntity,
  ISchemaTableDefinition,
  TransformerPdaEntity,
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

export class TransformerResponse {
  @ApiProperty()
  script: string;

  constructor(transformer: TransformerPdaEntity) {
    this.script = transformer.script;
  }
}

export class IndexerTriggerAndTransformerResponse {
  @ApiProperty()
  triggerType: TriggerType;

  @ApiProperty()
  pdaPubkey: string;

  @ApiProperty()
  pdaName: string;

  @ApiProperty()
  transformerPdaId: number;

  @ApiProperty({ type: IndexerTableMetadataResponse })
  transformerPda: TransformerResponse;

  @ApiProperty({ type: IndexerTableMetadataResponse })
  indexerTableId: number;

  @ApiProperty({ type: IndexerTableMetadataResponse })
  indexerId: number;

  constructor(trigger: IndexerTriggerEntity) {
    this.triggerType = trigger.triggerType;
    this.pdaPubkey = trigger.pdaPubkey;
    this.pdaName = trigger.pdaName;
    this.transformerPdaId = trigger.transformerPdaId;
    this.indexerTableId = trigger.indexerTableId;
    this.indexerId = trigger.indexerId;
    this.transformerPda = new TransformerResponse(trigger.transformerPda);
  }
}
