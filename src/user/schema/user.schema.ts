import { Schema, Types } from 'mongoose';
import {
  Prop,
  Schema as SchemaDecorator,
  SchemaFactory,
} from '@nestjs/mongoose';

@SchemaDecorator()
export class User {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  middleName: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: Schema.Types.ObjectId, ref: 'Profile' }) // Reference to the profile collection
  profile: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['student', 'company', 'teacher'],
    default: 'student',
  })
  role: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
