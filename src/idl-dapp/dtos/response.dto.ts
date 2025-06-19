import { Idl } from '@coral-xyz/anchor';
import { Idl as IdlV31 } from 'anchor-v31';
import { ApiProperty } from '@nestjs/swagger';
import { Cluster } from 'src/database/entities/rpc.entity';

export class IdlDappResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  version: string;

  @ApiProperty()
  idlJson: Idl | IdlV31;

  @ApiProperty()
  hashId: string;

  @ApiProperty()
  programId: string;

  @ApiProperty()
  network: Cluster;

  constructor(partial: Partial<IdlDappResponse>) {
    Object.assign(this, partial);
  }
}
