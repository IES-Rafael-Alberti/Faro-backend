import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 45 })
  name: string;

  @Column({ type: 'varchar', length: 45 })
  first_surname: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  second_surname: string;

  @Column({ type: 'varchar', length: 254 })
  email: string;

  @Column({ type: 'varchar', length: 60 })
  password: string;

  @Column({ type: 'enum', enum: ['admin', 'teacher', 'company', 'student'] })
  role: string;

  @Column({ type: 'uuid' })
  users_profiles_user_profile_id: string;
}
