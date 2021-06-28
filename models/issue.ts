import {
  Schema, Model, model, Document,
} from 'mongoose';
import Messages, { MessageData } from './message';
import Fields, { FieldData } from './field';

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

const issueSchema = new Schema<IssueData>({
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
    required: true,
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
  metaFields: [Fields],
  tags: [{
    type: String,
  }],
  threadMessages: [Messages],
},
{
  timestamps: true,
});

const Issues: Model<IssueData> = model('Issues', issueSchema);

export default Issues;
