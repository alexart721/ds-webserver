import {
  Schema, Model, model, Document,
} from 'mongoose';

export interface MessageData extends Document {
  messageOwnerId: string,
  messageOwnerName: string,
  content: string,
}

export const messageSchema = new Schema<MessageData>({
  messageOwnerId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  messageOwnerName: String,
  content: {
    type: String,
    required: true,
  },
},
{
  timestamps: true,
});

const Messages: Model<MessageData> = model('Messages', messageSchema);

export default Messages;
