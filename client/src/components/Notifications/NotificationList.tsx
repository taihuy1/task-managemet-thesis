import { Notification } from '@/types/notification.types';

interface Props {
    notifications: Notification[];
    onMarkRead: (id: string) => Promise<unknown>;
    onMarkAllRead: () => Promise<unknown>;
}

export default function NotificationList({ notifications, onMarkRead, onMarkAllRead }: Props) {
    if (notifications.length === 0) {
        return (
            <div style={{ position: 'absolute', top: '100%', right: 0, width: '300px', backgroundColor: 'white', border: '1px solid #ccc', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', zIndex: 1000, padding: '16px', textAlign: 'center', color: '#6b7280' }}>
                No notifications
            </div>
        );
    }

    const hasUnread = notifications.some(n => !n.isRead);

    return (
        <div style={{
            position: 'absolute', top: '100%', right: 0, width: '320px',
            backgroundColor: 'white', border: '1px solid #ccc',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)', zIndex: 1000,
            maxHeight: '400px', overflowY: 'auto',
        }}>
            {hasUnread && (
                <div style={{ padding: '8px 12px', borderBottom: '1px solid #eee', textAlign: 'right' }}>
                    <button onClick={() => onMarkAllRead()} style={{ background: 'none', color: 'var(--primary-color)', border: 'none', fontSize: '13px', padding: 0 }}>
                        Mark all as read
                    </button>
                </div>
            )}
            {notifications.map(n => (
                <div
                    key={n.id}
                    style={{ padding: '10px 12px', borderBottom: '1px solid #eee', backgroundColor: n.isRead ? 'white' : '#f0f8ff', cursor: n.isRead ? 'default' : 'pointer' }}
                    onClick={() => !n.isRead && onMarkRead(n.id)}
                >
                    <p style={{ margin: '0 0 4px', fontSize: '14px' }}>{n.message}</p>
                    <small style={{ color: '#999' }}>{new Date(n.createdAt).toLocaleString()}</small>
                </div>
            ))}
        </div>
    );
}
