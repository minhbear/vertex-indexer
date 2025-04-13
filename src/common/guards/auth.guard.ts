import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { AccountService } from 'src/account/account.service';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  constructor(
    private readonly accountService: AccountService,
    private readonly reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const canActivate = (await super.canActivate(context)) as boolean;
    if (!canActivate) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException();
    }

    const account = await this.accountService.findAccountById(
      parseInt(user.id),
    );
    if (!account) {
      throw new UnauthorizedException('Account not found');
    }

    request.user = account;

    return true;
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const allowAny = this.reflector.get<string[]>(
      'allow-any',
      context.getHandler(),
    );
    if (user) return user;
    if (allowAny) return true;
    throw new UnauthorizedException();
  }
}
