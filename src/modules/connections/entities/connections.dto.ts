import { IsUUID } from 'class-validator';

export class CreateConnectionDto {
  @IsUUID()
  user_id: string;

  @IsUUID()
  connected_user_id: string;
}
