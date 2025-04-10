import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from 'src/database/entities/entities';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { cacheModule } from 'src/config';
import { AccountModule } from 'src/account/account.module';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from 'src/common/guards/auth.strategy';
import { JWT_ACCESS_SECRET } from 'src/app.environment';
import { GoogleStrategy } from 'src/common/guards/google.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature(entities),
    cacheModule,
    AccountModule,
    JwtModule.register({
      global: true,
      secret: JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, GoogleStrategy],
})
export class AuthModule {}
