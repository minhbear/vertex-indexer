import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/auth.guard';
import { RpcService } from './rpc.service';
import { RpcResponse } from './dtos/response.dto';

@ApiBearerAuth()
@Controller('rpc')
@UseGuards(AccessTokenGuard)
export class RpcController {
  constructor(private readonly rpcService: RpcService) {}

  @Get('')
  @ApiResponse({
    status: 200,
    description: 'Get all RPCs',
    type: RpcResponse,
    isArray: true,
  })
  async findAll(): Promise<RpcResponse[]> {
    const rpcs = await this.rpcService.findAll();
    return rpcs.map((rpc) => new RpcResponse(rpc));
  }
}
