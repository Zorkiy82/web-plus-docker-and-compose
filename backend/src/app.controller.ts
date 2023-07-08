import { Controller, Body, Post, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './common/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import { UsersService } from './users/users.service';
import { CastomRequest } from './common/types/types';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('/signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  signin(@Req() { user }: CastomRequest) {
    return this.authService.login(user);
  }
}
