import { Entity, Column, ManyToMany, ManyToOne, JoinTable } from 'typeorm';

import { Length, IsUrl, IsString, IsNumber } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity()
export class Wish extends BaseEntity {
  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({ type: 'double precision', default: 0 })
  @IsNumber()
  price: number;

  @Column({ type: 'double precision', default: 0 })
  @IsNumber()
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column()
  @IsString()
  @Length(1, 1024)
  description: string;

  @ManyToMany(() => Offer, (offer) => offer.item)
  @JoinTable()
  offers: Offer[];

  @Column({ type: 'integer', default: 0 })
  @IsNumber()
  copied: number;
}
