import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { UsersModule } from '../users/users.module';
import { WishesModule } from '../wishes/wishes.module';

@Module({
  controllers: [WishlistsController],
  providers: [WishlistsService],
  imports: [TypeOrmModule.forFeature([Wishlist]), UsersModule, WishesModule],
})
export class WishlistsModule {}
