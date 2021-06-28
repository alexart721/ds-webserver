import {
  Schema, Model, model, Document,
} from 'mongoose';
import Messages, { MessageData } from './message';
import Users, { UserData } from './user';

export interface DmChannelData extends Document {
  activeParticipants: UserData[],
  inactiveParticipants: UserData[],
  messages: MessageData[],
}

const dmChannelSchema = new Schema<DmChannelData>({
  activeParticipants: [Users],
  inactiveParticipants: [Users],
  messages: [Messages],
},
{
  timestamps: true,
});

const DmChannels: Model<DmChannelData> = model('DmChannels', dmChannelSchema);

export default DmChannels;
