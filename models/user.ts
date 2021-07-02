import {
  Schema, Model, model, Document,
} from 'mongoose';

export interface UserData extends Document {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  license: string,
  state: string,
  status: string,
  roles: string,
  channels: Object[],
  dmChannels: Object[],
  issueMeta: Object[]
}

export const userSchema = new Schema<UserData>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
  license: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Banned', 'Registered'],
    required: true,
    default: 'Pending',
  },
  roles: {
    type: String,
    enum: ['Admin', 'User'],
    required: true,
    default: 'User',
  },
  channels: [{
    id: {
      type: Schema.Types.ObjectId,
      ref: 'Channels',
    },
    name: {
      type: String,
    },
  }],
  dmChannels: [{
    id: {
      type: Schema.Types.ObjectId,
      ref: 'dmChannels',
    },
    participants: [{
      type: String,
    }],
  }],
  issueMeta: [{
    id: {
      type: Schema.Types.ObjectId,
      ref: 'Issues'
    },
    name: String
  }]
},
{
  timestamps: true,
});

const Users: Model<UserData> = model('Users', userSchema);

export default Users;
