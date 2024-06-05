import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Profile } from '../../entities/profile.entity';

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
  end_date: Date;
}
