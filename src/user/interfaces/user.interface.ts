import { Document } from 'mongoose';

export interface User extends Document {
  readonly _id: string;
  readonly name: string;
  readonly middleName: string;
  readonly email: string;
  readonly password: string;
  readonly profile: string;
  readonly role: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
