// profile.entity.ts

import { Education } from './education.entity';
import { Recommendation } from './recommendation.entity';

export class ProfileDTO {
  id: string;

  users_profile_profile_picture: Buffer;

  headline: string;

  description: string;

  ocupation_status: string;
  educations: Education[];

  recommendation: Recommendation[];
}
