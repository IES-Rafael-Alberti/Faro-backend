import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Publication } from '../../entities/publication.entity';

@Entity('comments')
export class Comment {
  @PrimaryColumn('uuid')
  id: string;

  @PrimaryColumn('uuid')
  publication_id: string;

  @PrimaryColumn('uuid')
  user_id: string;

  @Column('varchar', { length: 1024 })
  comment: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Publication, (publication) => publication, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'publication_id' })
  publication: Publication;

  @ManyToOne(() => User, (user) => user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
