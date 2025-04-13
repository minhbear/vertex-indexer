import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNil } from 'lodash';
import { AccountEntity } from 'src/database/entities';
import { Repository } from 'typeorm';
import { UpdateUserNameDto } from './dtos/request.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  async findOrCreateAccountByEmail(email: string): Promise<AccountEntity> {
    const account = await this.accountRepository
      .createQueryBuilder('account')
      .where('account.email = :email', { email })
      .getOne();
    if (!isNil(account)) {
      return account;
    }
    const newAccount = await this.accountRepository.save(
      this.accountRepository.create({
        email: email,
        walletAddress: '',
        userName: email,
        isUpdatedUserName: false,
      }),
    );
    return newAccount;
  }

  async findAccountById(id: number): Promise<AccountEntity> {
    const account = await this.accountRepository
      .createQueryBuilder('account')
      .where('account.id = :id', { id })
      .getOne();
    if (isNil(account)) {
      throw new BadRequestException(`Account not found`);
    }

    return account;
  }

  async updateUserNameDto(input: UpdateUserNameDto): Promise<AccountEntity> {
    const account = await this.accountRepository.findOneBy({
      id: input.accountId,
    });

    if (account.isUpdatedUserName) {
      throw new BadRequestException(`User name has already been updated`);
    }

    const isExistUserName = await this.accountRepository
      .createQueryBuilder('account')
      .where('account.userName = :userName', { userName: input.userName })
      .andWhere('account.id != :id', { id: input.accountId })
      .getOne();
    if (!isNil(isExistUserName)) {
      throw new BadRequestException(`User name already exists`);
    }
    account.userName = input.userName;
    account.isUpdatedUserName = true;
    const updatedAccount = await this.accountRepository.save(account);
    return updatedAccount;
  }

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
