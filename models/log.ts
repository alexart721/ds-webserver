import { Schema, Model, model } from 'mongoose';

export interface LogData {
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
