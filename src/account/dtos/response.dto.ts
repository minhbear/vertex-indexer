import { ApiProperty } from '@nestjs/swagger';
import { AccountEntity } from 'src/database/entities';

export class AccountResponse {
  @ApiProperty()
  email: string;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  walletAddress: string;

  @ApiProperty()
  isUpdatedUserName: boolean;

  @ApiProperty()
  createdAt: Date;

  constructor(account: AccountEntity) {
    this.email = account.email;
    this.userName = account.userName;
    this.walletAddress = account.walletAddress;
    this.isUpdatedUserName = account.isUpdatedUserName;
    this.createdAt = account.createdAt;
  }
}
