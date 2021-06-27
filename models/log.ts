import {
  Schema, Model, model, Document,
} from 'mongoose';

export interface LogData extends Document {
  content: string,
}

const logSchema = new Schema<LogData>({
  content: {
    type: String,
    required: true,
  },
},
{
  timestamps: true,
});

const Logs: Model<LogData> = model('Logs', logSchema);

export default Logs;
