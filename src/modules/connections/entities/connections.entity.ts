import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('connections')
export class Connection {
  @PrimaryColumn({
    type: 'uuid',
  })
  connection_id: string;

  @Column({
    type: 'uuid',
  })
  user_id: string;

  @Column({
    type: 'uuid',
  })
  connected_user_id: string;

  // Typeorm relationship

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
