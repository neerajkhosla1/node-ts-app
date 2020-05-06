import { Schema, model, Model, Document } from 'mongoose';

const UserSchema = new Schema(
  {
    name: { type: String, required: true, },
    email: { type: String, required: true, index: { unique: true } },
    dateOfBirth: { type: Date, default: Date.now, required: true },
    gender: {
      type: Schema.Types.String,
      required: true,
      enum: ['male', 'female'],
    }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

interface UserProps extends Document {
  name: string;
  // Duplicate all props from the above schema :(
}

export const User: Model<UserProps> = model('User', UserSchema);