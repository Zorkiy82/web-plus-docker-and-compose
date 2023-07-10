import {
  Controller,
  UseGuards,
  Get,
  Req,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CastomRequest } from '../common/types/types';
import { Wishlist } from './entities/wishlist.entity';

@UseGuards(JwtAuthGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() { user }: CastomRequest,
  ): Promise<Wishlist> {
    return this.wishlistsService.create(user, createWishlistDto);
  }

  @Get()
  findAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Wishlist> {
    return this.wishlistsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() { user }: CastomRequest,
  ): Promise<Wishlist> {
    return this.wishlistsService.update(+id, updateWishlistDto, user);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() { user }: CastomRequest,
  ): Promise<Wishlist> {
    return this.wishlistsService.remove(+id, user);
  }
}
