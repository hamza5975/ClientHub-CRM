import mongoose, { Schema, Document } from 'mongoose';

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
export type RelatedEntityType = 'Lead' | 'Contact' | 'Deal';

export interface ITask extends Document {
  title: string;
  description?: string;
  dueDate?: Date;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: mongoose.Types.ObjectId;
  relatedTo?: {
    type: RelatedEntityType;
    id: mongoose.Types.ObjectId;
  };
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    dueDate: { type: Date },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'], default: 'Pending' },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    relatedTo: {
      type: { type: String, enum: ['Lead', 'Contact', 'Deal'] },
      id: { type: Schema.Types.ObjectId },
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITask>('Task', taskSchema);
