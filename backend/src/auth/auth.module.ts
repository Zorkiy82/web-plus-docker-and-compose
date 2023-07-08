import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport/dist';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from '../common/strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { BcryptService } from '../common/services/bcrypt.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, BcryptService],
  exports: [AuthService],
})
export class AuthModule {}
