import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Recommendation } from '../recommendation/entity/recommendation.entity';
import { Experience } from '../experience/entity/experience.entity';
import { Education } from '../education/entity/education.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Use appropriate column types and lengths
  @Column({ type: 'mediumblob', nullable: true })
  users_profile_profile_picture: Buffer;

  @Column({ length: 128, nullable: true })
  headline: string;

  @Column({ length: 512, nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['Working', 'Studying', 'Looking for a job'],
    nullable: true,
  })
  occupation_status: string;

  // Define relationships with other entities
  @OneToMany(() => Recommendation, (recommendation) => recommendation.profile, {
    cascade: true, // Ensure cascading operations like save and delete
  })
  recommendations: Recommendation[];

  @OneToMany(() => Experience, (experience) => experience.profile, {
    cascade: true,
  })
  experience: Experience[];

  @OneToMany(() => Education, (education) => education.profile, {
    cascade: true,
  })
  educations: Education[];
}
