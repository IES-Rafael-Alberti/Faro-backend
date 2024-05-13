import { Injectable } from '@nestjs/common';

import { BaseImpersonationProtectionGuard } from './BaseImpersonationProtectionGuard.guard';

@Injectable()
export class ConnectionImpersonationProtectionGuard extends BaseImpersonationProtectionGuard {
  fieldsToCheck = ['user_id', 'applicant_id'];
}
