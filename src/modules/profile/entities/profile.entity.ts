// profile.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Education } from './education.entity';
import { Recommendation } from './recommendation.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'blob', nullable: true })
  users_profile_profile_picture: Buffer;

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

  // Constructor for easy initialization
  constructor(
    headline: string,
    ocupation_status: string,
    description: string = '',
    users_profile_profile_picture: Buffer,
  ) {
    this.headline = headline;
    this.ocupation_status = ocupation_status;
    this.description = description;
    this.users_profile_profile_picture = users_profile_profile_picture;
  }
}
