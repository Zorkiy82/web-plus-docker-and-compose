import {
  Controller,
  UseGuards,
  Req,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CastomRequest } from '../common/types/types';
import { Wish } from './entities/wish.entity';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createWishDto: CreateWishDto,
    @Req() { user }: CastomRequest,
  ): Promise<Record<string, never>> {
    return this.wishesService.create(user, createWishDto);
  }

  @Get('/last')
  getLastWishes(): Promise<Wish[]> {
    return this.wishesService.findLastWishes();
  }

  @Get('/top')
  getTopWishes(): Promise<Wish[]> {
    return this.wishesService.findTopWishes();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/copy')
  copyWish(
    @Param('id') id: number,
    @Req() { user }: CastomRequest,
  ): Promise<Record<string, never>> {
    return this.wishesService.copyWish(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getWishById(@Param('id') id: number): Promise<Wish> {
    return this.wishesService.findWishById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  updateWishById(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @Req() { user }: CastomRequest,
  ): Promise<Record<string, never>> {
    return this.wishesService.updateWishById(id, updateWishDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  deleteWishById(
    @Param('id') id: number,
    @Req() { user }: CastomRequest,
  ): Promise<Wish> {
    return this.wishesService.deleteWishById(id, user);
  }
}
