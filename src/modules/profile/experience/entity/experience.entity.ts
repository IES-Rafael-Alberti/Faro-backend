import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Profile } from '../../entities/profile.entity';

@Entity()
export class Experience {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Profile, (profile) => profile.experience)
  profile: Profile;

  @Column({ length: 128 })
  company: string;

  @Column({ length: 128 })
  position: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ length: 512, nullable: true })
  description: string;
}
