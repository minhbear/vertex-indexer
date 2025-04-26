import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IndexerService } from './indexer.service';
import {
  CreateIndexerSpaceDto,
  CreateTableDto,
  DeleteTriggerDto,
  ExecuteQueryDto,
  RegisterIndexerWithTransformDto,
  UpdateTransformerDto,
} from './dtos/request.dto';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { AccessTokenGuard } from 'src/common/guards/auth.guard';
import { UploadIdlFile } from 'src/common/interceptors';
import * as fs from 'fs';
import {
  IndexerResponse,
  IndexerTableMetadataResponse,
  IndexerTriggerAndTransformerResponse,
  ResultExecuteQueryResponse,
  TransformerResponse,
} from './dtos/response.dto';
import { IndexerTableService } from './indexer-table.service';
import { IndexerGuard } from 'src/common/guards/indexer.guard';

@ApiTags('Indexer')
@Controller('indexers')
@UseGuards(AccessTokenGuard, IndexerGuard)
export class IndexerController {
  constructor(
    private readonly indexerService: IndexerService,
    private readonly indexerTableService: IndexerTableService,
  ) {}

  @ApiBearerAuth()
  @Post('/create')
  async createIndexerSpace(
    @Body() input: CreateIndexerSpaceDto,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    return await this.indexerService.createIndexerSpace(input, req.user);
  }

  @ApiOperation({ summary: 'Get indexers by accountId' })
  @ApiResponse({
    status: 200,
    description: 'List of indexers',
    type: [IndexerResponse],
  })
  @Get('/')
  async getIndexersByAccountId(
    @Req() req: RequestWithUser,
  ): Promise<IndexerResponse[]> {
    const accountId = req.user.id;
    return (await this.indexerService.getIndexers(accountId)).map((indexer) => {
      return new IndexerResponse(indexer);
    });
  }

  @ApiOperation({ summary: 'Get all Trigger and Transformer of Table' })
  @ApiResponse({
    status: 200,
    description: 'List of indexers',
    type: [IndexerTableMetadataResponse],
  })
  @Get(':indexerId/tables/:tableId/trigger-transformer')
  async getAllIndexerTriggerAndTransformOfTable(
    @Param('indexerId') indexerId: string,
    @Param('tableId') tableId: string,
    @Req() req: RequestWithUser,
  ): Promise<IndexerTriggerAndTransformerResponse[]> {
    return (
      await this.indexerService.getAllIndexerTriggerAndTransformOfTable({
        indexerId: parseInt(indexerId),
        tableId: parseInt(tableId),
        accountId: req.user.id,
      })
    ).map((c) => new IndexerTriggerAndTransformerResponse(c));
  }

  @Post(':indexerId/tables/create')
  async createTable(
    @Body() input: CreateTableDto,
    @Param('indexerId') indexerId: string,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    input.indexerId = parseInt(indexerId);

    return await this.indexerService.createTable(input, req.user);
  }

  @Delete(':indexerId/tables/:tableName')
  async deleteTable(
    @Param('indexerId') indexerId: string,
    @Param('tableName') tableName: string,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    return await this.indexerService.deleteTable({
      accountId: req.user.id,
      indexerId: parseInt(indexerId),
      tableName,
    });
  }

  @ApiResponse({ status: 200, type: [IndexerTableMetadataResponse] })
  @Get(':indexerId/tables')
  async getAllTablesInIndexer(
    @Param('indexerId') indexerIdStr: string,
    @Req() req: RequestWithUser,
  ): Promise<IndexerTableMetadataResponse[]> {
    const accountId = req.user.id;
    const indexerId = parseInt(indexerIdStr);

    const tables = await this.indexerService.getAllTablesInIndexer(
      indexerId,
      accountId,
    );
    return tables.map((table) => new IndexerTableMetadataResponse(table));
  }

  @ApiOperation({
    summary: 'Register PDA of Program to transform data to index',
  })
  @Post(':indexerId/register')
  @UploadIdlFile('transformer')
  async registerIndexerWithTransform(
    @Body() input: RegisterIndexerWithTransformDto,
    @UploadedFile() file: Express.Multer.File,
    @Param('indexerId') indexerId: string,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    if (!file) {
      throw new BadRequestException('Missing file transform');
    }

    const fileContent = fs.readFileSync(file.path, 'utf-8');
    input.accountId = req.user.id;
    input.indexerId = parseInt(indexerId);

    await this.indexerService.registerIndexerWithTransform(input, fileContent);
  }

  @ApiResponse({
    status: 200,
    type: ResultExecuteQueryResponse,
  })
  @ApiOperation({
    summary: 'Execute query on indexer table',
  })
  @Post('/query')
  async executeQuery(
    @Body() input: ExecuteQueryDto,
    @Req() req: RequestWithUser,
  ): Promise<ResultExecuteQueryResponse> {
    return await this.indexerTableService.executeQuery(input.query);
  }

  @ApiOperation({
    summary: 'Delete trigger of indexer',
  })
  @Delete(':indexerId/triggers')
  async deleteTrigger(
    @Param('indexerId') indexerId: string,
    @Body() input: DeleteTriggerDto,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    input.accountId = req.user.id;
    input.indexerId = parseInt(indexerId);

    return await this.indexerService.deleteTrigger(input);
  }

  @ApiOperation({
    summary: 'Update transformer of indexer',
  })
  @Patch(':indexerId/transformers')
  @UploadIdlFile('transformer')
  async updateTransformer(
    @Body() input: UpdateTransformerDto,
    @UploadedFile() file: Express.Multer.File,
    @Param('indexerId') indexerId: string,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    if (!file) {
      throw new BadRequestException('Missing file transform');
    }
    const fileContent = fs.readFileSync(file.path, 'utf-8');

    input.accountId = req.user.id;
    input.indexerId = parseInt(indexerId);
    input.script = fileContent;

    return await this.indexerService.updateTransformer(input);
  }

  @ApiOperation({
    summary: 'Get all transformer of indexer',
  })
  @Get(':indexerId/transformers')
  async getAllTransformerOfIndexer(
    @Param('indexerId') indexerId: string,
    @Req() req: RequestWithUser,
  ): Promise<TransformerResponse[]> {
    return (
      await this.indexerService.getAllTransformersOfIndexer(
        parseInt(indexerId),
        req.user.id,
      )
    ).map((transformer) => new TransformerResponse(transformer));
  }
}
