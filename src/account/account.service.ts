import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNil } from 'lodash';
import { AccountEntity } from 'src/database/entities';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  async findOrCreateAccountByWalletAddress(
    walletAddress: string,
  ): Promise<AccountEntity> {
    const account = await this.accountRepository
      .createQueryBuilder('account')
      .where('account.walletAddress = :walletAddress', { walletAddress })
      .getOne();

    if (!isNil(account)) {
      return account;
    }

    const newAccount = await this.accountRepository.save(
      this.accountRepository.create({
        walletAddress: walletAddress,
        email: '',
      }),
    );

    return newAccount;
  }
}
