// education.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class Education {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Profile, (profile) => profile.educations)
  profile: Profile;

  @Column({ length: 128 })
  institution: string;

  @Column({ length: 128 })
  degree: string;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date?: Date;

  // Constructor for easy initialization
  constructor(
    institution: string,
    degree: string,
    start_date: Date,
    end_date?: Date,
  ) {
    this.institution = institution;
    this.degree = degree;
    this.start_date = start_date;
    this.end_date = end_date;
  }
}
