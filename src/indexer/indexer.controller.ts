import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IndexerService } from './indexer.service';
import {
  CreateIndexerSpaceDto,
  CreateTableDto,
  RegisterIndexerWithTransformDto,
} from './dtos/request.dto';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { AccessTokenGuard } from 'src/common/guards/auth.guard';
import { UploadIdlFile } from 'src/common/interceptors';
import * as fs from 'fs';

@ApiTags('Indexer')
@Controller('indexer')
// @UseGuards(AccessTokenGuard)
export class IndexerController {
  constructor(private readonly indexerService: IndexerService) {}

  @ApiBearerAuth()
  @Post('/create')
  async createIndexerSpace(
    @Body() input: CreateIndexerSpaceDto,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    // input.accountId = req.user.id;
    input.accountId = 1;

    return await this.indexerService.createIndexerSpace(input);
  }

  @ApiOperation({ summary: 'Get indexers by accountId' })
  @ApiResponse({ status: 200, description: 'List of indexers' })
  @ApiResponse({ status: 400, description: 'Invalid accountId' })
  @Get('/')
  async getIndexersByAccountId(@Req() req: RequestWithUser): Promise<any> {
    // const accountId = req.user.id;
    const accountId = 1;
    if (!accountId) {
      throw new BadRequestException('accountId is required');
    }

    return await this.indexerService.getIndexers(accountId);
  }

  @Post(':indexerId/table/create')
  async createTable(
    @Body() input: CreateTableDto,
    @Param('indexerId') indexerId: string,
  ): Promise<void> {
    input.indexerId = parseInt(indexerId);

    return await this.indexerService.createTable(input);
  }

  @Delete(':indexerId/table/:tableName')
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
    // input.accountId = req.user.id;
    input.accountId = 1;
    input.indexerId = parseInt(indexerId);

    await this.indexerService.registerIndexerWithTransform(input, fileContent);
  }
}
