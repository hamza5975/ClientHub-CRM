import mongoose, { Schema, Document } from 'mongoose';

export type LeadStage = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Won' | 'Lost';

export interface ILead extends Document {
  title: string;
  company: string;
  contactName: string;
  email: string;
  phone?: string;
  stage: LeadStage;
  value: number;
  assignedTo: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    contactName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    stage: { type: String, enum: ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'], default: 'New' },
    value: { type: Number, default: 0 },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<ILead>('Lead', leadSchema);
