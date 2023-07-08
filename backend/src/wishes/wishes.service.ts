import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import {
  FindManyOptions,
  FindOneOptions,
  Repository,
  FindOptionsOrderValue,
  UpdateResult,
  DeleteResult,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { TUserData } from '../common/types/types';

@Injectable()
export class WishesService {
  relationSettings = {
    owner: true,
    offers: {
      user: true,
    },
  };

  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private usersService: UsersService,
  ) {}

  async create(
    user: TUserData,
    createWishDto: CreateWishDto,
  ): Promise<Record<string, never>> {
    const newWish = this.wishRepository.create(createWishDto);
    const owner = await this.usersService.findMe(user.id);
    newWish.owner = owner;
    await this.wishRepository.save(newWish);
    return {};
  }

  async copyWish(id: number, user: TUserData): Promise<Record<string, never>> {
    const wish = await this.findWishById(id);
    if (!wish) {
      throw new NotFoundException(`По :id ничего не найдено`);
    }

    const { name, link, image, price, description }: CreateWishDto = wish;

    const newWish = await this.create(user, {
      name,
      link,
      image,
      price,
      description,
    });

    wish.copied += 1;

    this.wishRepository.save(wish);

    return newWish;
  }

  findAll(options: FindManyOptions<Wish>): Promise<Wish[]> {
    return this.wishRepository.find(options);
  }

  findOne(options: FindOneOptions<Wish>): Promise<Wish> {
    return this.wishRepository.findOne(options);
  }

  async findWishById(id: number): Promise<Wish> {
    const options = {
      where: { id },
      relations: this.relationSettings,
    };

    const wish = await this.findOne(options);

    if (!wish) {
      throw new NotFoundException(`По :id ничего не найдено`);
    }

    return wish;
  }

  async findAllWishesByIdList(idList: number[]): Promise<Wish[]> {
    const whereOptions = idList.map((id: number) => {
      return { id };
    });
    const options = {
      where: whereOptions,
    };

    const wish = await this.findAll(options);

    if (!wish) {
      throw new NotFoundException(`По :id ничего не найдено`);
    }

    return wish;
  }

  findLastWishes(): Promise<Wish[]> {
    const orderValue: FindOptionsOrderValue = 'DESC';
    const options = {
      order: {
        createdAt: orderValue,
      },
      take: 40,
      relations: this.relationSettings,
    };
    return this.findAll(options);
  }

  findTopWishes(): Promise<Wish[]> {
    const orderValue: FindOptionsOrderValue = 'DESC';
    const options = {
      order: {
        copied: orderValue,
      },
      take: 20,
      relations: this.relationSettings,
    };
    return this.findAll(options);
  }

  update(id: number, updateWishDto: UpdateWishDto): Promise<UpdateResult> {
    return this.wishRepository.update(id, updateWishDto);
  }

  updateFull(wish: Wish): Promise<Wish> {
    return this.wishRepository.save(wish);
  }

  async updateWishById(
    id: number,
    updateWishDto: UpdateWishDto,
    user: TUserData,
  ): Promise<Record<string, never>> {
    const wish = await this.findWishById(id);
    if (!wish) {
      throw new NotFoundException(`По :id ничего не найдено`);
    }
    if (wish.owner.id !== user.id) {
      throw new ConflictException(
        `Нельзя редактировать wish другого пользователя`,
      );
    }
    if (wish.offers.length && 'price' in updateWishDto) {
      throw new ConflictException(
        `Нельзя изменять стоимость, если уже есть желающие скинуться`,
      );
    }

    await this.update(id, updateWishDto);

    return {};
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.wishRepository.delete(id);
  }

  async deleteWishById(id: number, user: TUserData): Promise<Wish> {
    const wish = await this.findWishById(id);
    if (!wish) {
      throw new NotFoundException(`По :id ничего не найдено`);
    }
    if (wish.owner.id !== user.id) {
      throw new ConflictException(`Нельзя удалять wish другого пользователя`);
    }
    if (wish.offers.length) {
      throw new ConflictException(
        `Нельзя удалять wish, если уже есть желающие скинуться`,
      );
    }

    await this.remove(id);

    return wish;
  }
}
