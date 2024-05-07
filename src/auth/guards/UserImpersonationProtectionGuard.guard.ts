import { Injectable } from '@nestjs/common';

import { BaseImpersonationProtectionGuard } from './BaseImpersonationProtectionGuard.guard';

@Injectable()
export class UserImpersonationProtectionGuard extends BaseImpersonationProtectionGuard {
  fieldsToCheck = ['id', 'user_id'];
}
