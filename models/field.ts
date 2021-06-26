import { Schema, Model, model } from 'mongoose';

export interface FieldData {
  name: string,
  type: string,
  data: string,
}

const fieldSchema = new Schema<FieldData>({
  name: {
    type: String,
  },
  type: {
    type: String,
  },
  data: {
    type: String,
  },
},
{
  timestamps: true,
});

const Fields: Model<FieldData> = model('Fields', fieldSchema);

export default Fields;
