import { ApiProperty } from '@nestjs/swagger';
import { RpcEntity } from 'src/database/entities/rpc.entity';

export class RpcResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  url: string;

  @ApiProperty()
  cluster: string;

  constructor(rpc: RpcEntity) {
    this.id = rpc.id;
    this.url = rpc.url;
    this.cluster = rpc.cluster;
  }
}
