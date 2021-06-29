import {
  Schema, Model, model, Document,
} from 'mongoose';
import { MessageData, messageSchema } from './message';
import { UserData, userSchema } from './user';

export interface DmChannelData extends Document {
  activeParticipants: UserData[],
  inactiveParticipants: UserData[],
  messages: MessageData[],
}

export const dmChannelSchema = new Schema<DmChannelData>({
  activeParticipants: [userSchema],
  inactiveParticipants: [userSchema],
  messages: [messageSchema],
},
{
  timestamps: true,
});

const DmChannels: Model<DmChannelData> = model('DmChannels', dmChannelSchema);

export default DmChannels;
