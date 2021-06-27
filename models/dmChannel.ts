import {
  Schema, Model, model, Document,
} from 'mongoose';

export interface DmChannelData extends Document {
  participants: string[],
  messages: string[],
}

const dmChannelSchema = new Schema<DmChannelData>({
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  }],
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Messages',
    required: true,
  }],
},
{
  timestamps: true,
});

const DmChannels: Model<DmChannelData> = model('DmChannels', dmChannelSchema);

export default DmChannels;
