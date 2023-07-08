import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindManyOptions, FindOneOptions, Repository, ILike } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { Wish } from '../wishes/entities/wish.entity';
import { BcryptService } from '../common/services/bcrypt.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    readonly bcryptService: BcryptService,
  ) {}

  findOne(options: FindOneOptions<User>): Promise<User> {
    return this.userRepository.findOne(options);
  }

  findAll(options: FindManyOptions<User>): Promise<User[]> {
    return this.userRepository.find(options);
  }

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { username, email } = createUserDto;

    const userWhereName = await this.findOne({
      where: { username },
    });

    if (userWhereName) {
      throw new ConflictException(
        `Пользователь с именем ${username} уже зарегистрирован. Выберете другое имя`,
      );
    }

    const userWhereEmail = await this.findOne({
      where: { email: ILike(`%${email}%`) },
    });

    if (userWhereEmail) {
      throw new ConflictException(
        `Пользователь с email ${email} уже зарегистрирован. Введите другой email`,
      );
    }

    const newUser = await this.userRepository.create(createUserDto);
    newUser.password = await this.bcryptService.hash(newUser.password, 10);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = await this.userRepository.save(newUser);
    return user;
  }

  async updateMe(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { password } = updateUserDto;
    if (password) {
      updateUserDto.password = await this.bcryptService.hash(password, 10);
    }
    await this.userRepository.update(id, updateUserDto);
    return await this.findMe(id);
  }

  findOneByLogin(login: string): Promise<User> {
    const options: FindOneOptions<User> = {
      select: { username: true, id: true, password: true, email: true },
      where: [{ username: login }, { email: login }],
    };
    return this.findOne(options);
  }

  findMe(id: number): Promise<User> {
    const options = {
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { id },
    };
    return this.findOne(options);
  }

  async findWishesByOptions(
    optionName: string,
    optionvalue: number | string,
  ): Promise<Wish[]> {
    const options = {
      where: { [`${optionName}`]: optionvalue },
      relations: {
        wishes: {
          owner: true,
          offers: {
            user: true,
          },
        },
      },
    };

    const user = await this.findOne(options);

    if (!user) {
      throw new NotFoundException(
        `Не найден пользователь с ${optionName}=${optionvalue}`,
      );
    }

    const { wishes } = user;

    return wishes;
  }

  findByQuery(query: string): Promise<User[]> {
    const options: FindManyOptions<User> = {
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
      where: [
        { username: ILike(`%${query}%`) },
        { email: ILike(`%${query}%`) },
      ],
    };

    return this.findAll(options);
  }

  async findUserByName(userName: string): Promise<User> {
    const options: FindOneOptions<User> = {
      where: { username: userName },
    };

    const user = await this.findOne(options);

    if (!user) {
      throw new NotFoundException(
        `Не найден пользователь с именем - ${userName}`,
      );
    }

    return user;
  }
}
