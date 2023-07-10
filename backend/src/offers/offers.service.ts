import { Injectable, ConflictException } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { WishesService } from '../wishes/wishes.service';
import { UsersService } from '../users/users.service';
import { TUserData } from '../common/types/types';

@Injectable()
export class OffersService {
  relationOptions = {
    item: {
      owner: true,
      offers: true,
    },
    user: {
      wishes: {
        owner: true,
        offers: true,
      },
      offers: {
        user: {
          offers: true,
        },
      },
      wishlists: {
        owner: true,
        items: true,
      },
    },
  };

  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    readonly wishesService: WishesService,
    readonly usersService: UsersService,
  ) {}

  async create(
    user: TUserData,
    createOfferDto: CreateOfferDto,
  ): Promise<Record<string, never>> {
    const { amount, itemId } = createOfferDto;
    const wish = await this.wishesService.findWishById(itemId);
    if (user.id === wish.owner.id) {
      throw new ConflictException(
        `Нельзя вносить деньги на собственные подарки`,
      );
    }
    const offerOwner = await this.usersService.findMe(user.id);
    const difference = wish.price - wish.raised;
    if (difference === 0) {
      throw new ConflictException(`Деньги на этот подарок уже собраны :)`);
    }
    if (difference < amount) {
      throw new ConflictException(
        `Осталось собрать ${difference} руб. Больше не нужно :)`,
      );
    }

    const newOffer = await this.offerRepository.create(createOfferDto);
    newOffer.user = offerOwner;
    newOffer.item = wish;
    await this.offerRepository.save(newOffer);
    wish.offers.push(newOffer);
    wish.raised += amount;
    await this.wishesService.updateFull(wish);
    return {};
  }

  findAll(): Promise<Offer[]> {
    const option: FindManyOptions = {
      relations: this.relationOptions,
    };
    return this.offerRepository.find(option);
  }

  findOne(id: number): Promise<Offer> {
    const option: FindOneOptions = {
      where: { id },
      relations: this.relationOptions,
    };
    return this.offerRepository.findOne(option);
  }
}
