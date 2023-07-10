import { Entity, Column, OneToMany } from 'typeorm';

import { IsEmail, IsString, IsUrl, Length } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  @IsString()
  @Length(1, 64)
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @IsString()
  @Length(1, 200)
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar: string;

  @Column({ unique: true, select: false })
  @IsEmail()
  email: string;

  @Column({ select: false })
  @IsString()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishList) => wishList.owner)
  wishlists: Wishlist[];
}
