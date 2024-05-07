import { Injectable } from '@nestjs/common';

import { BaseImpersonationProtectionGuard } from './BaseImpersonationProtectionGuard.guard';

@Injectable()
export class DirectMessageImpersonationProtectionGuard extends BaseImpersonationProtectionGuard {
  fieldsToCheck = ['sender_id'];
}
