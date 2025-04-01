import { ApiProperty } from '@nestjs/swagger';

export class GetNonceResponse {
  @ApiProperty()
  walletAddress: string;

  @ApiProperty()
  nonce: string;
}

export class LoginResponse {
  @ApiProperty()
  accessToken: string;
}
