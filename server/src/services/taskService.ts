import Task, { ITask, TaskPriority, TaskStatus } from '../models/Task';

interface TaskFilters {
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate?: Date;
  priority?: TaskPriority;
  status?: TaskStatus;
  assignedTo: string;
  relatedTo?: {
    type: 'Lead' | 'Contact' | 'Deal';
    id: string;
  };
}

export async function getTasks(filters: TaskFilters): Promise<{ tasks: ITask[]; total: number }> {
  const { search, status, priority, assignedTo, sortBy = 'dueDate', sortOrder = 'asc', page = 1, limit = 50 } = filters;
  
  const query: Record<string, unknown> = {};
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }
  
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (assignedTo) query.assignedTo = assignedTo;

  const skip = (page - 1) * limit;
  
  const [tasks, total] = await Promise.all([
    Task.find(query)
      .populate('assignedTo', 'name email')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit),
    Task.countDocuments(query),
  ]);

  return { tasks, total };
}

export async function getTaskById(id: string): Promise<ITask | null> {
  return Task.findById(id).populate('assignedTo', 'name email');
}

export async function createTask(input: CreateTaskInput): Promise<ITask> {
  return Task.create(input);
}

export async function updateTask(id: string, input: Partial<CreateTaskInput>): Promise<ITask | null> {
  return Task.findByIdAndUpdate(id, input, { new: true }).populate('assignedTo', 'name email');
}

export async function deleteTask(id: string): Promise<void> {
  await Task.findByIdAndDelete(id);
}

export async function getTaskStats(): Promise<{
  total: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  overdue: number;
}> {
  const tasks = await Task.find();
  const byStatus: Record<string, number> = {};
  const byPriority: Record<string, number> = {};
  let overdue = 0;
  const now = new Date();

  for (const task of tasks) {
    byStatus[task.status] = (byStatus[task.status] || 0) + 1;
    byPriority[task.priority] = (byPriority[task.priority] || 0) + 1;
    if (task.dueDate && task.dueDate < now && task.status !== 'Completed') {
      overdue++;
    }
  }

  return { total: tasks.length, byStatus, byPriority, overdue };
}
