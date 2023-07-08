import { Module } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [WishesController],
  providers: [WishesService],
  imports: [TypeOrmModule.forFeature([Wish]), UsersModule],
  exports: [WishesService],
})
export class WishesModule {}
