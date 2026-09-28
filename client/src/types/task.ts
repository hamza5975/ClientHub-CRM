export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
export type RelatedEntityType = 'Lead' | 'Contact' | 'Deal';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: UserRef;
  relatedTo?: {
    type: RelatedEntityType;
    id: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserRef {
  _id: string;
  name: string;
  email: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  assignedTo?: string;
  relatedTo?: {
    type: RelatedEntityType;
    id: string;
  };
}
