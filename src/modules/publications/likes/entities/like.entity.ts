import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Publication } from '../../entities/publication.entity';

@Entity('likes')
export class Like {
  @PrimaryColumn({ type: 'uuid' })
  user_id: string;

  @PrimaryColumn({ type: 'uuid' })
  publication_id: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Publication, (publication) => publication)
  @JoinColumn({ name: 'publicationId' })
  publication: Publication;
}
