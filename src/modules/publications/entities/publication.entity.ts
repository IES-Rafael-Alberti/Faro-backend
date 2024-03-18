import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
// TODO: Import the UserProfile entity
//import { UserProfile } from './userProfile.entity';

@Entity('users_publications')
export class Publication {
  @PrimaryGeneratedColumn('uuid')
  user_publication_id: string;

  @Column({ length: 2048 })
  user_publication_msg: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  users_publications_created_at: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'users_user_id' })
  user: User;
  /*
  @ManyToOne(() => UserProfile)
  @JoinColumn({ name: 'users_users_profiles_user_profile_id' })
  userProfile: UserProfile;
  */
}
