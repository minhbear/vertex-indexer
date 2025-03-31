import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TypeColumn } from 'src/common/constant';
import { ColumnType } from 'src/common/types/column-type';

export class CreateIndexerSpaceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  idlId: number;

  @Exclude()
  accountId: number;
}

export class TableSchemaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIn(TypeColumn, {
    message: `type must be one of the predefined column types ${TypeColumn.map((t) => `"${t}"`).join(', ')}`,
  })
  type: ColumnType;

  @ApiPropertyOptional()
  @IsOptional()
  nullable: boolean;
}

export class CreateTableDto {
  indexerId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  tableName: string;

  @ApiProperty({ type: [TableSchemaDto] })
  @ValidateNested({ each: true })
  @Type(() => TableSchemaDto)
  schema: TableSchemaDto[];

  accountId: number;
}
