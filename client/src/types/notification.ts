export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'task' | 'deal' | 'lead';

export interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: string;
}
