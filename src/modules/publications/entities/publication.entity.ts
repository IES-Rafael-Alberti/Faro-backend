import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('users_publications')
export class Publication {
  @PrimaryGeneratedColumn('uuid')
  user_publication_id: string;

  @Column({ length: 2048 })
  user_publication_msg: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  users_publications_created_at: string;

  @Column('uuid')
  users_user_id: string;

  // Typeorm relationship

  @ManyToOne(() => User)
  @JoinColumn({ name: 'users_user_id' })
  user: User;
}
