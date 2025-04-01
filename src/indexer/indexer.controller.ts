import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IndexerService } from './indexer.service';
import { ResponseOk } from 'src/common/dtos/common.dto';
import { CreateIndexerSpaceDto, CreateTableDto } from './dtos/request.dto';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { AccessTokenGuard } from 'src/common/guards/auth.guard';

@ApiTags('Indexer')
@Controller('indexer')
@UseGuards(AccessTokenGuard)
export class IndexerController {
  constructor(private readonly indexerService: IndexerService) {}

  @ApiResponse({ type: ResponseOk })
  @ApiBearerAuth()
  @Post('/create')
  async createIndexerSpace(
    @Body() input: CreateIndexerSpaceDto,
    @Req() req: RequestWithUser,
  ): Promise<ResponseOk> {
    input.accountId = req.user.id;

    return await this.indexerService.createIndexerSpace(input);
  }

  @ApiResponse({ type: ResponseOk })
  @Post(':indexerId/table/create')
  async createTable(
    @Body() input: CreateTableDto,
    @Param('indexerId') indexerId: string,
  ): Promise<ResponseOk> {
    input.indexerId = parseInt(indexerId);

    return await this.indexerService.createTable(input);
  }

  @ApiResponse({ type: ResponseOk })
  @Delete(':indexerId/table/:tableName')
  async deleteTable(
    @Param('indexerId') indexerId: string,
    @Param('tableName') tableName: string,
    @Req() req: RequestWithUser,
  ): Promise<ResponseOk> {
    return await this.indexerService.deleteTable({
      accountId: req.user.id,
      indexerId: parseInt(indexerId),
      tableName,
    });
  }
}
