import { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationList from './NotificationList';

export default function NotificationBell() {
    const { notifications, unreadCount, markRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ position: 'relative' }}>
            <button onClick={() => setIsOpen(!isOpen)} style={{ position: 'relative' }}>
                Notifications
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute', top: -5, right: -5,
                        backgroundColor: 'red', color: 'white',
                        borderRadius: '50%', padding: '2px 6px', fontSize: '12px'
                    }}>
                        {unreadCount}
                    </span>
                )}
            </button>
            {isOpen && (
                <NotificationList
                    notifications={notifications}
                    onMarkRead={markRead}
                />
            )}
        </div>
    );
}
