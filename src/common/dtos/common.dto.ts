import { SortDirection } from '../enum/common.enum';
import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiProperty,
  ApiPropertyOptional,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export interface Response<T> {
  statusCode: string;
  data: T;
}

export class PagingRequest {
  //TODO implement sorts
  @ApiPropertyOptional({ default: 1 })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  pageNum: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  pageSize: number = 10;

  sorts: { [k: string]: SortDirection };

  get pagination(): [number, number, { [k: string]: SortDirection }] {
    return [this.pageNum - 1, this.pageSize, this.sorts || null];
  }
}

export class PagingResponse<T> {
  pageData: T[];

  @ApiProperty()
  pageNum: number;

  @ApiProperty()
  total: number;
}

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PagingResponse) },
          {
            properties: {
              pageData: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiSortQuery = (...alias: string[]) => {
  // quite lmao
  const example = {};
  example[(alias && alias?.[0] + '.id') || 'alias'] = SortDirection.DESC;
  return applyDecorators(
    ApiQuery({
      required: false,
      name: 'sorts',
      style: 'deepObject',
      explode: true,
      type: 'object',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'string',
          enum: Object.values(SortDirection),
        },
        example: example,
      },
      description: `alias: [${alias}], directions: ${Object.values(
        SortDirection,
      )}. format sorts[alias.field]=ASC`,
    }),
  );
};
