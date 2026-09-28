import { useEffect } from 'react';
import { Bell, Check, Trash2, Info, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, Button, Spinner, Alert } from '@/components/ui';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchNotifications, markAsRead, markAllAsRead, deleteNotification } from '@/store/slices/notificationsSlice';
import type { NotificationType } from '@/types';

const typeIcons: Record<NotificationType, typeof Info> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  task: Bell,
  deal: Bell,
  lead: Bell,
};

const typeColors: Record<NotificationType, string> = {
  info: 'text-blue-600 bg-blue-100',
  success: 'text-green-600 bg-green-100',
  warning: 'text-yellow-600 bg-yellow-100',
  error: 'text-red-600 bg-red-100',
  task: 'text-purple-600 bg-purple-100',
  deal: 'text-orange-600 bg-orange-100',
  lead: 'text-cyan-600 bg-cyan-100',
};

export default function Notifications() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = async (id: string) => {
    await dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = async () => {
    await dispatch(markAllAsRead());
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteNotification(id));
  };

  if (status === 'loading') {
    return (
      <div
        className="flex h-[calc(100vh-4rem)] items-center justify-center"
        data-icod-id="src_pages_notifications_tsx_1c17">
        <Spinner size="lg" data-icod-id="src_pages_notifications_tsx_e79b" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-icod-id="src_pages_notifications_tsx_6f84">
      <div
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        data-icod-id="src_pages_notifications_tsx_bc63">
        <div data-icod-id="src_pages_notifications_tsx_9e05">
          <h1
            className="text-2xl font-bold text-foreground"
            data-icod-id="src_pages_notifications_tsx_a9c3">Notifications</h1>
          <p
            className="text-muted-foreground"
            data-icod-id="src_pages_notifications_tsx_917c">Stay updated with your activities</p>
        </div>
        <Button
          variant="outline"
          onClick={handleMarkAllAsRead}
          data-icod-id="src_pages_notifications_tsx_9e29">
          <Check className="h-4 w-4" data-icod-id="src_pages_notifications_tsx_07b1" />
          Mark All Read
        </Button>
      </div>
      {error && <Alert variant="error" data-icod-id="src_pages_notifications_tsx_dcca">{error}</Alert>}
      <div className="space-y-3" data-icod-id="src_pages_notifications_tsx_9729">
        {items.length === 0 ? (
          <Card
            className="flex flex-col items-center justify-center py-12"
            data-icod-id="src_pages_notifications_tsx_e8f7">
            <Bell
              className="mb-3 h-12 w-12 text-muted-foreground"
              data-icod-id="src_pages_notifications_tsx_ddb2" />
            <p
              className="text-muted-foreground"
              data-icod-id="src_pages_notifications_tsx_31db">No notifications yet</p>
          </Card>
        ) : (
          items.map((notification) => {
            const Icon = typeIcons[notification.type];
            const colorClass = typeColors[notification.type];

            return (
              <Card
                key={notification._id}
                className={`flex items-start gap-4 p-4 ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}
                data-icod-id={`src_pages_notifications_tsx_31a5_${notification._id}`}>
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${colorClass}`}
                  data-icod-id={`src_pages_notifications_tsx_3dbe_${notification._id}`}>
                  <Icon
                    className="h-5 w-5"
                    data-icod-id={`src_pages_notifications_tsx_a070_${notification._id}`} />
                </div>
                <div
                  className="flex-1"
                  data-icod-id={`src_pages_notifications_tsx_25c3_${notification._id}`}>
                  <p
                    className={`text-sm ${!notification.read ? 'font-medium text-foreground' : 'text-muted-foreground'}`}
                    data-icod-id={`src_pages_notifications_tsx_9e7d_${notification._id}`}>
                    {notification.message}
                  </p>
                  <p
                    className="mt-1 text-xs text-muted-foreground"
                    data-icod-id={`src_pages_notifications_tsx_6d6f_${notification._id}`}>
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                <div
                  className="flex gap-1"
                  data-icod-id={`src_pages_notifications_tsx_699b_${notification._id}`}>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMarkAsRead(notification._id)}
                      aria-label="Mark as read"
                      data-icod-id={`src_pages_notifications_tsx_4383_${notification._id}`}>
                      <Check
                        className="h-4 w-4"
                        data-icod-id={`src_pages_notifications_tsx_e368_${notification._id}`} />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(notification._id)}
                    aria-label="Delete"
                    data-icod-id={`src_pages_notifications_tsx_f0b4_${notification._id}`}>
                    <Trash2
                      className="h-4 w-4 text-destructive"
                      data-icod-id={`src_pages_notifications_tsx_4c5a_${notification._id}`} />
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
