import mongoose, { Schema, Document } from 'mongoose';

export type DealStage = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Won' | 'Lost';

export interface IDeal extends Document {
  title: string;
  company: string;
  contact?: mongoose.Types.ObjectId;
  value: number;
  stage: DealStage;
  probability: number;
  expectedCloseDate?: Date;
  assignedTo: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const dealSchema = new Schema<IDeal>(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    contact: { type: Schema.Types.ObjectId, ref: 'Contact' },
    value: { type: Number, default: 0 },
    stage: { type: String, enum: ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'], default: 'New' },
    probability: { type: Number, default: 0, min: 0, max: 100 },
    expectedCloseDate: { type: Date },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IDeal>('Deal', dealSchema);
