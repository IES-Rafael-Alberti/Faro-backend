// profile.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Education } from './education.entity';
import { Recommendation } from './recommendation.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // TODO: Verify the type that we want the image to be stored with
  // @Column({ type: 'blob', nullable: true })
  // users_profile_profile_picture: Buffer;

  @Column({ length: 128 })
  headline: string;

  @Column({ length: 512, nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['Working', 'Studying', 'Looking for a job'],
    nullable: true,
  })
  ocupation_status: string;

  @OneToMany(() => Education, (education) => education.profile)
  educations: Education[];

  @OneToMany(() => Recommendation, (recommendation) => recommendation.profile)
  recommendation: Recommendation[];
}
