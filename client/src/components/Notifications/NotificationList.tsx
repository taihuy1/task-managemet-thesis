import { Notification } from '@/types/notification.types';

interface NotificationListProps {
    notifications: Notification[];
    onMarkRead: (id: string) => Promise<unknown>;
}

export default function NotificationList({ notifications, onMarkRead }: NotificationListProps) {
    if (notifications.length === 0) {
        return <div style={{ padding: '10px' }}>No new notifications</div>;
    }

    return (
        <div style={{
            position: 'absolute', top: '100%', right: 0, width: '300px',
            backgroundColor: 'white', border: '1px solid #ccc',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)', zIndex: 1000,
            maxHeight: '400px', overflowY: 'auto'
        }}>
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    style={{
                        padding: '10px',
                        borderBottom: '1px solid #eee',
                        backgroundColor: notification.read ? 'white' : '#f0f8ff'
                    }}
                    onClick={() => !notification.read && onMarkRead(notification.id)}
                >
                    <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>{notification.message}</p>
                    <small style={{ color: '#666' }}>{new Date(notification.createdAt).toLocaleString()}</small>
                </div>
            ))}
        </div>
    );
}
