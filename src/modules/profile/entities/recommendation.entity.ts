// recommendation.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Profile } from './profile.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Recommendation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Profile, (profile) => profile.recommendation)
  profile: Profile;

  @ManyToOne(() => User, (user: User) => user.user_id)
  sender: User;

  @Column({ length: 1024 })
  message: string;

  @Column({ type: 'date' })
  date: Date;
}
