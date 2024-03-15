import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({ type: 'varchar', length: 45 })
  user_name: string;

  @Column({ type: 'varchar', length: 45 })
  user_first_surname: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  user_second_surname: string;

  @Column({ type: 'varchar', length: 254 })
  user_email: string;

  @Column({ type: 'varchar', length: 60 })
  user_password: string;

  @Column({ type: 'enum', enum: ['admin', 'teacher', 'company', 'student'] })
  user_role: string;

  @Column({ type: 'uuid' })
  users_profiles_user_profile_id: string;
}
