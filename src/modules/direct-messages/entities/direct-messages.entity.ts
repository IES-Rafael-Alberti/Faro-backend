import { PrimaryColumn, Column, Entity } from 'typeorm';

@Entity('users_direct_messages')
export class DirectMessage {
  @Column({
    type: 'varchar',
    length: 1024,
  })
  user_direct_message_msg: string;

  @PrimaryColumn({
    type: 'uuid',
  })
  user_direct_message_sender: string;

  @PrimaryColumn({
    type: 'uuid',
  })
  user_direct_message_receiber: string;

  @PrimaryColumn({
    type: 'uuid',
  })
  users_direct_message_id: string;

  @Column({ type: 'date' }) // Assuming 'timestamp' type for dates
  user_direct_message_date: Date;
}
