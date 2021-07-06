import {
  Schema, Model, model, Document,
} from 'mongoose';
import { MessageData, messageSchema } from './message';
import { FieldData, fieldSchema } from './field';

export interface IssueData extends Document {
  title: string,
  priority: string,
  status: string,
  issueOwner: string,
  patientAge: number,
  patientGender: string,
  patientMedicalIssues: string,
  patientMedications: string,
  patientVitals: object,
  metaFields: FieldData[],
  tags: string[],
  threadMessages: MessageData[],
}

export const issueSchema = new Schema<IssueData>({
  title: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
    required: true,
  },
  status: {
    type: String,
    enum: ['Open', 'Closed'],
    default: 'Open',
  },
  issueOwner: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  patientAge: {
    type: Number,
    required: true,
  },
  patientGender: {
    type: String,
    required: true,
  },
  patientMedicalIssues: {
    type: String,
    required: true,
  },
  patientMedications: {
    type: String,
    required: true,
  },
  patientVitals: {
    temperature: {
      type: Number,
      required: true,
    },
    heartRate: {
      type: Number,
      required: true,
    },
    bloodPressure: {
      type: Number,
      required: true,
    },
  },
  metaFields: [fieldSchema],
  tags: [{
    type: String,
  }],
  threadMessages: [messageSchema],
},
{
  timestamps: true,
});

const Issues: Model<IssueData> = model('Issues', issueSchema);

export default Issues;
