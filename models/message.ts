import {
  Schema, Model, model, Document,
} from 'mongoose';

export interface MessageData extends Document {
  messageOwner: string,
  content: string,
}

const messageSchema = new Schema<MessageData>({
  messageOwner: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
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
