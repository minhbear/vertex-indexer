import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { GetNonceResponse, LoginResponse } from './dtos/response.dto';
import { WalletSignatureDTO } from './dtos/request.dto';
import { GoogleAuthGuard } from 'src/common/guards/google-auth.guard';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { Response } from 'express';
import { FE_REDIRECT_URL } from 'src/app.environment';

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
  async login(
    @Body() walletSignature: WalletSignatureDTO,
  ): Promise<LoginResponse> {
    return await this.authService.login(walletSignature);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  async googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  googleCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    const responseLogin = this.authService.generateTokens(req.user.id);

    res.redirect(`${FE_REDIRECT_URL}?accessToken=${responseLogin.accessToken}`);
  }
}
