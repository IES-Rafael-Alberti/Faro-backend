import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  user_profile_id: string;

  @Column({ type: 'blob', nullable: true })
  users_profile_profile_picture: Buffer;

  @Column({ type: 'varchar', length: 128 })
  user_profile_headline: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  user_profile_description: string;

  @Column({
    type: 'enum',
    enum: ['Working', 'Studying', 'Loking for a job'],
    nullable: true,
  })
  user_profile_ocupation_status: string;
}
