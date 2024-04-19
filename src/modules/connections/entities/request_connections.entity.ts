import { Entity, PrimaryColumn } from 'typeorm';

@Entity('request_connections')
export class RequestConnection {
  @PrimaryColumn({
    type: 'uuid',
  })
  applicant_id: string;

  @PrimaryColumn({
    type: 'uuid',
  })
  required_id: string;

  @PrimaryColumn({
    type: 'uuid',
  })
  connection_id: string;
}
