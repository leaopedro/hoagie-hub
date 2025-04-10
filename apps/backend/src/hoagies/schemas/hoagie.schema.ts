import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type HoagieDocument = Hoagie & Document;

@Schema({ timestamps: true })
export class Hoagie {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], required: true })
  ingredients: string[];

  @Prop()
  image?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  creator: User;
}

export const HoagieSchema = SchemaFactory.createForClass(Hoagie);
