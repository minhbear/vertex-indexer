import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { GetNonceResponse, LoginResponse } from './dtos/response.dto';
import { WalletSignatureDTO } from './dtos/request.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/wallet/:walletAddress/nonce')
  @ApiResponse({ type: GetNonceResponse })
  async getNonce(
    @Param('walletAddress') walletAddress: string,
  ): Promise<GetNonceResponse> {
    return this.authService.getNonce(walletAddress);
  }

  @Post('/login')
  @ApiResponse({ type: LoginResponse })
  login(@Body() walletSignature: WalletSignatureDTO): Promise<LoginResponse> {
    return this.authService.login(walletSignature);
  }
}
