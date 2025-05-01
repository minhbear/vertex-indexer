import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IdlDappEntity } from 'src/database/entities';
import { Repository } from 'typeorm';
import { UploadIdlInput } from './idl-dapp.interface';
import { generateIdlHash } from 'src/common/utils/hash.utils';
import { isEmpty } from 'lodash';
import { GetIdlsRequest } from './dtos/request.dto';
import { buildOrderBy } from 'src/common/utils/query.util';
import { SortDirection } from 'src/common/enum/common.enum';

@Injectable()
export class IdlDappService {
  constructor(
    @InjectRepository(IdlDappEntity)
    private readonly idlDappRepository: Repository<IdlDappEntity>,
  ) {}

  async createIdlDapp(input: UploadIdlInput) {
    const hashId = generateIdlHash(input.programId, input.version);
    const existingIdl = await this.idlDappRepository.findOneBy({ hashId });
    if (!isEmpty(existingIdl)) {
      throw new BadRequestException('IDL already exists');
    }

    return await this.idlDappRepository.save({
      idlJson: input.idlJson,
      name: input.name,
      programId: input.programId,
      version: input.version,
      hashId,
    });
  }

  async getAllIdls(params: GetIdlsRequest): Promise<[IdlDappEntity[], number]> {
    const [pageNum, pageSize, sorts] = params.pagination;

    const query = this.idlDappRepository.createQueryBuilder('idl');

    return await buildOrderBy(
      query,
      isEmpty(sorts)
        ? {
            'idl.createdAt': SortDirection.DESC,
          }
        : sorts,
    )
      .take(pageSize)
      .skip(pageNum * pageSize)
      .getManyAndCount();
  }
}
