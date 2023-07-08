import { ConflictException, Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { WishesService } from '../wishes/wishes.service';
import { TUserData } from '../common/types/types';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}

  async create(
    user: TUserData,
    createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    const newWishList = this.wishlistRepository.create(createWishlistDto);
    const owner = await this.usersService.findMe(user.id);
    const wishes = await this.wishesService.findAllWishesByIdList(
      createWishlistDto.itemsId,
    );

    newWishList.owner = owner;
    newWishList.items = wishes;

    await this.wishlistRepository.save(newWishList);

    return newWishList;
  }

  findAll(): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  findOne(id: number): Promise<Wishlist> {
    return this.wishlistRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    user: TUserData,
  ): Promise<Wishlist> {
    const wishList = await this.findOne(id);
    if (wishList.owner.id !== user.id) {
      throw new ConflictException(
        `Редактировать можно только свою подборку подарков`,
      );
    }

    const { name, image, itemsId }: UpdateWishlistDto = updateWishlistDto;

    wishList.name = name ? name : wishList.name;
    wishList.image = image ? image : wishList.image;
    if (itemsId) {
      const wishes = await this.wishesService.findAllWishesByIdList(itemsId);
      wishList.items = wishes;
    }

    await this.wishlistRepository.save(wishList);

    return wishList;
  }

  async remove(id: number, user: TUserData): Promise<Wishlist> {
    const wishList = await this.findOne(id);

    if (wishList.owner.id !== user.id) {
      throw new ConflictException(
        `Удалить можно только свою подборку подарков`,
      );
    }

    await this.wishlistRepository.delete(id);

    return wishList;
  }
}
