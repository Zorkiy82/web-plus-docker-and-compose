import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindByQueryDto } from './dto/find-by-query.dto';
import { CastomRequest } from '../common/types/types';
import { User } from './entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/find')
  findByQuery(@Body() { query }: FindByQueryDto): Promise<User[]> {
    return this.usersService.findByQuery(query);
  }

  @Get('/me')
  async getMe(@Req() { user }: CastomRequest): Promise<User> {
    const { id } = user;
    return this.usersService.findMe(id);
  }

  @Patch('/me')
  updateMe(
    @Req() { user }: CastomRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const { id } = user;
    return this.usersService.updateMe(id, updateUserDto);
  }

  @Get('/me/wishes')
  async getMeWishes(@Req() { user }: CastomRequest): Promise<Wish[]> {
    const { id } = user;
    return this.usersService.findWishesByOptions('id', id);
  }

  @Get('/:username/wishes')
  getWishesByUserName(@Param('username') userName: string): Promise<Wish[]> {
    return this.usersService.findWishesByOptions('username', userName);
  }

  @Get('/:username')
  geTUserDataByName(@Param('username') userName: string): Promise<User> {
    return this.usersService.findUserByName(userName);
  }
}
