import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;
import type { Document } from 'mongoose';

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  message: string;
  repliedTo?: mongoose.Types.ObjectId;
  status: 'sent' | 'delivered' | 'read';
  isRead: boolean;
  deletedFor: mongoose.Types.ObjectId[];
  reportedBy: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    reportedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Message = models?.Message || model<IMessage>('Message', messageSchema);