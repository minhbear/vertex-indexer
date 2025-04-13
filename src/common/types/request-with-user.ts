import { AccountEntity } from 'src/database/entities';

export interface RequestWithUser extends Request {
  user: AccountEntity;
}
