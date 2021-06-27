import {
  Schema, Model, model, Document,
} from 'mongoose';

export interface ChannelData extends Document {
  name: string,
  issues: string[],
}

const channelSchema = new Schema<ChannelData>({
  name: {
    type: String,
    required: true,
  },
  issues: [{
    type: Schema.Types.ObjectId,
    ref: 'Issues',
    required: true,
  }],
},
{
  timestamps: true,
});

const Channels: Model<ChannelData> = model('Channels', channelSchema);

export default Channels;
