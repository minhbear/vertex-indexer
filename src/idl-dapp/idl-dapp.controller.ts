import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import * as fs from 'fs';
import { IdlDappService } from './idl-dapp.service';
import { UploadIdlFile } from 'src/common/interceptors';
import { UploadIdlInput } from './idl-dapp.interface';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/auth.guard';
import { InjectIndexerSystemQueue, SystemQueueJob } from 'src/common/queue';
import { Queue } from 'bull';

@ApiBearerAuth()
// @UseGuards(AccessTokenGuard)
@Controller('idl-dapp')
export class IdlDappController {
  constructor(
    private readonly idlDappService: IdlDappService,
    @InjectIndexerSystemQueue()
    private readonly indexerSystemQueue: Queue,
  ) {}

  @Get('test')
  async test() {
    const programId = 'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK';
    const pdaPubkeyStr = '3ucNos4NbumPLZNWztqGHNFFgkHeRMBQAVemeeomsUxv';

    const jobId = `${SystemQueueJob.UPDATE_INDEXER}:indexer<${21}>:program<${programId}>:pda<${pdaPubkeyStr}>`;
    await this.indexerSystemQueue.add(
      SystemQueueJob.UPDATE_INDEXER,
      {
        indexerId: 21,
        programId,
        pdaPubkeyStr,
      },
      {
        jobId,
      },
    );
  }

  @Post('/upload')
  @ApiOperation({ summary: 'Upload an IDL JSON file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload IDL JSON file with programId and version',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'YourIdlName' },
        programId: { type: 'string', example: 'YourProgramId' },
        version: { type: 'string', example: '1.0.0' },
        idlJson: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UploadIdlFile('idlJson')
  async uploadIdl(
    @Body() body: UploadIdlInput,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!body.programId || !body.version || !file) {
      throw new BadRequestException('Missing required fields');
    }

    try {
      const fileContent = fs.readFileSync(file.path, 'utf-8');
      const idlJson = JSON.parse(fileContent);

      return await this.idlDappService.createIdlDapp({
        ...body,
        idlJson,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('')
  async getAllIdls() {
    return await this.idlDappService.getAllIdls();
  }
}
