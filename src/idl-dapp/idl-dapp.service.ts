import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IdlDappEntity } from 'src/database/entities';
import { Repository } from 'typeorm';
import { UploadIdlInput } from './idl-dapp.interface';
import { generateIdlHash } from 'src/common/utils/hash.utils';
import { isEmpty } from 'lodash';

@Injectable()
export class IdlDappService {
  constructor(
    @InjectRepository(IdlDappEntity)
    private readonly idlDappRepository: Repository<IdlDappEntity>,
  ) {}

  async createIdlDapp(input: UploadIdlInput): Promise<void> {
    const hashId = generateIdlHash(input.programId, input.version);
    const existingIdl = await this.idlDappRepository.findOneBy({ hashId });
    if (!isEmpty(existingIdl)) {
      throw new BadRequestException('IDL already exists');
    }

    await this.idlDappRepository.save({
      idlJson: input.idlJson,
      name: input.name,
      programId: input.programId,
      version: input.version,
      hashId,
    });
  }
}
