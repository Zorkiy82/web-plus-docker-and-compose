import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';

import { Length, IsUrl, IsString } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity()
export class Wishlist extends BaseEntity {
  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish, (wish) => wish.id)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.id)
  owner: User;
}
