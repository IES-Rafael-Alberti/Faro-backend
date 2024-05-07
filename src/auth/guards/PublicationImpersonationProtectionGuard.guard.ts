import { Injectable } from '@nestjs/common';

import { BaseImpersonationProtectionGuard } from './BaseImpersonationProtectionGuard.guard';

@Injectable()
export class PublicationImpersonationProtectionGuard extends BaseImpersonationProtectionGuard {
  fieldsToCheck = ['id', 'user_id'];
}
