import mongoose, { Schema, Document, models, Types } from 'mongoose';

export interface ITemplate extends Document {
  templateName: string;
  userId: Types.ObjectId; 
  timeSpan: string;
  employees: { name: string; position: string }[];
  scenario: string;
  scenarioDetails: object;
}

const TemplateSchema: Schema = new Schema({
  templateName: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  timeSpan: { type: String, required: true },
  employees: [{
    name: { type: String, required: true },
    position: { type: String, required: true },
    _id: false 
  }],
  scenario: { type: String, required: true },
  scenarioDetails: { type: Object, default: {} },
}, { timestamps: true });

export default models.Template || mongoose.model<ITemplate>('Template', TemplateSchema);