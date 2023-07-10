import { Entity, Column, ManyToOne } from 'typeorm';

import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';
import { IsBoolean, IsNumber } from 'class-validator';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity()
export class Offer extends BaseEntity {
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish)
  item: Wish;

  @IsNumber()
  @Column({ type: 'double precision' })
  amount: number;

  @IsBoolean()
  @Column({ default: false })
  hidden: boolean;
}
