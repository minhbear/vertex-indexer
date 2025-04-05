import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
} from '@nestjs/common';
import * as fs from 'fs';
import { IdlDappService } from './idl-dapp.service';
import { UploadIdlFile } from 'src/common/interceptors';
import { UploadIdlInput } from './idl-dapp.interface';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';

@Controller('idl-dapp')
export class IdlDappController {
  constructor(private readonly idlDappService: IdlDappService) {}

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
      throw new BadRequestException('Invalid JSON file');
    }
  }
}
