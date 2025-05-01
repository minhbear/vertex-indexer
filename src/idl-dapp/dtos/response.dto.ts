import { Idl } from '@coral-xyz/anchor';
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
  idlJson: Idl;

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
