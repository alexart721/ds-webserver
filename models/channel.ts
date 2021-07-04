import {
  Schema, Model, model, Document,
} from 'mongoose';
import { IssueData, issueSchema } from './issue';

export interface ChannelData extends Document {
  name: string,
  issues: IssueData[],
}

export const channelSchema = new Schema<ChannelData>({
  name: {
    type: String,
    required: true,
  },
  issues: [issueSchema],
  archivedIssues: [issueSchema],
},
{
  timestamps: true,
});

const Channels: Model<ChannelData> = model('Channels', channelSchema);

export default Channels;
