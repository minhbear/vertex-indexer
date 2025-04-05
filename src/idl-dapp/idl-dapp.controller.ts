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

@Controller('idl-dapp')
export class IdlDappController {
  constructor(private readonly idlDappService: IdlDappService) {}

  @Post('/upload')
  @UploadIdlFile('idlJson')
  async uploadIdl(
    @Body() body: UploadIdlInput,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    if (!body.programId || !body.version || !file) {
      throw new BadRequestException('Missing required fields');
    }

    try {
      const fileContent = fs.readFileSync(file.path, 'utf-8');
      const idlJson = JSON.parse(fileContent);

      await this.idlDappService.createIdlDapp({
        ...body,
        idlJson,
      });
    } catch (error) {
      throw new BadRequestException('Invalid JSON file');
    }
  }
}
