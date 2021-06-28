import {
  Schema, Model, model, Document,
} from 'mongoose';
import Issues, { IssueData } from './issue';

export interface ChannelData extends Document {
  name: string,
  issues: IssueData[],
}

const channelSchema = new Schema<ChannelData>({
  name: {
    type: String,
    required: true,
  },
  issues: [Issues],
},
{
  timestamps: true,
});

const Channels: Model<ChannelData> = model('Channels', channelSchema);

export default Channels;
