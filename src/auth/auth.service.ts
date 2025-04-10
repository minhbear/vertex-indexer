import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { isNil } from 'lodash';
import { generateNumberUUIDNonce } from 'src/common/utils';
import { JWT_ACCESS_SECRET, WALLET_NONCE_TTL } from 'src/app.environment';
import { GetNonceResponse, LoginResponse } from './dtos/response.dto';
import { Transactional } from 'typeorm-transactional';
import { WalletSignatureDTO } from './dtos/request.dto';
import { verifyMessageSignature } from 'src/common/utils/signature.utils';
import { AccountService } from 'src/account/account.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AuthService.name);
  }

  async validateGoogleUserEmail(email: string) {
    return await this.accountService.findOrCreateAccountByEmail(email);
  }

  async getNonce(walletAddress: string): Promise<GetNonceResponse> {
    let nonce: string = await this.cacheManager.get(
      `wallet:${walletAddress}:nonce`,
    );
    if (isNil(nonce)) {
      nonce = generateNumberUUIDNonce();
      await this.cacheManager.set(
        `wallet:${walletAddress}:nonce`,
        nonce,
        WALLET_NONCE_TTL,
      );
    }
    return {
      walletAddress,
      nonce,
    };
  }

  @Transactional()
  async login(dto: WalletSignatureDTO): Promise<LoginResponse> {
    const { walletAddress, signature } = dto;

    const nonce: string = await this.cacheManager.get(
      `wallet:${walletAddress}:nonce`,
    );
    if (isNil(nonce)) {
      throw new BadRequestException('Expired nonce');
    }

    if (
      !verifyMessageSignature({
        message: nonce,
        signature,
        walletAddress,
      })
    ) {
      throw new BadRequestException('Failed to verify wallet signature');
    }

    const account =
      await this.accountService.findOrCreateAccountByWalletAddress(
        walletAddress,
      );

    await this.cacheManager.del(`wallet:${walletAddress}:nonce`);

    return this.generateTokens(account.id);
  }

  generateTokens(accountId: number): LoginResponse {
    //TODO [accessToken, refreshToken] = await Promise.all(signAsync)
    const accessToken = this.jwtService.sign(
      { sub: accountId },
      {
        secret: JWT_ACCESS_SECRET,
        expiresIn: '7d',
      },
    );

    return { accessToken: accessToken };
  }
}
