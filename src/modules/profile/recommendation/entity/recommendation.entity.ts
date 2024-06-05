// recommendation.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Profile } from '../../entities/profile.entity';

@Entity()
export class Recommendation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Profile, (profile) => profile.recommendations, {
    eager: true,
  })
  profile: Profile;

  @Column({ type: 'uuid' })
  senderId: string;

  @Column({ length: 1024 })
  message: string;

  @Column({ type: 'date' })
  date: Date;
}
