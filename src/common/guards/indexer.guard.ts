import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { RequestWithUser } from '../types/request-with-user';

@Injectable()
export class IndexerGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const account = (context.switchToHttp().getRequest() as RequestWithUser)
      .user;

    if (!account.isUpdatedUserName) {
      throw new BadRequestException(
        `Must update user name before creating indexer space`,
      );
    }

    return true;
  }
}
