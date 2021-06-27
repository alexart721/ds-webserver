import {
  Schema, Model, model, Document,
} from 'mongoose';

export interface FieldData extends Document {
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
