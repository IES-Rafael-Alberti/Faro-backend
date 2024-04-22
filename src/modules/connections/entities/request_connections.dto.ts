import { IsUUID } from 'class-validator';

export class RequestConnectionDto {
  @IsUUID()
  applicant_id: string;

  @IsUUID()
  required_id: string;

  @IsUUID()
  connection_id: string;
}
