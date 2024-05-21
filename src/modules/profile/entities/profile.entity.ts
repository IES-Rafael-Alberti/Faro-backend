import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Recommendation } from './recommendation.entity';
import { Experience } from './experience.entity';
import { Education } from './education.entity';

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
  occupation_status: string;

  @OneToMany(() => Recommendation, (recommendation) => recommendation.profile)
  recommendations: Recommendation[];

  @OneToMany(() => Experience, (experience) => experience.profile)
  experience: Experience[];

  @OneToMany(() => Education, (education) => education.profile)
  educations: Education[];
}
