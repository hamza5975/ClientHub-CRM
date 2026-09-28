import Notification, { INotification, NotificationType } from '../models/Notification';

interface NotificationFilters {
  userId?: string;
  type?: NotificationType;
  read?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  message: string;
}

export async function getNotifications(filters: NotificationFilters): Promise<{ notifications: INotification[]; total: number }> {
  const { userId, type, read, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 50 } = filters;
  
  const query: Record<string, unknown> = {};
  
  if (userId) query.userId = userId;
  if (type) query.type = type;
  if (read !== undefined) query.read = read;

  const skip = (page - 1) * limit;
  
  const [notifications, total] = await Promise.all([
    Notification.find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments(query),
  ]);

  return { notifications, total };
}

export async function createNotification(input: CreateNotificationInput): Promise<INotification> {
  return Notification.create(input);
}

export async function markAsRead(id: string): Promise<INotification | null> {
  return Notification.findByIdAndUpdate(id, { read: true }, { new: true });
}

export async function markAllAsRead(userId: string): Promise<void> {
  await Notification.updateMany({ userId, read: false }, { read: true });
}

export async function deleteNotification(id: string): Promise<void> {
  await Notification.findByIdAndDelete(id);
}

export async function getUnreadCount(userId: string): Promise<number> {
  return Notification.countDocuments({ userId, read: false });
}
