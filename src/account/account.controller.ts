import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { UpdateUserNameDto } from './dtos/request.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/auth.guard';
import { AccountResponse } from './dtos/response.dto';
import { RequestWithUser } from 'src/common/types/request-with-user';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get(':accountId')
  async findAccount(
    @Param('accountId') accountId: string,
  ): Promise<AccountResponse> {
    const account = await this.accountService.findAccountById(
      parseInt(accountId),
    );
    return new AccountResponse(account);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Patch('update-user-name')
  @ApiResponse({
    status: 200,
    type: AccountResponse,
  })
  async updateUserName(
    @Body() input: UpdateUserNameDto,
    @Req() req: RequestWithUser,
  ): Promise<AccountResponse> {
    input.accountId = req.user.id;
    const account = await this.accountService.updateUserNameDto(input);
    return new AccountResponse(account);
  }
}
