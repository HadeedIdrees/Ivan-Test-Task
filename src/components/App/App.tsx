import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase/firebase';

const App: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('');

  useEffect(() => {
    const unsubscribe = firestore.collection('notifications').onSnapshot(snapshot => {
      const updatedNotifications: any[] = [];
      snapshot.forEach(doc => {
        updatedNotifications.push({ id: doc.id, ...doc.data() });
      });
      setNotifications(updatedNotifications);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = (id: string) => {
    firestore.collection('notifications').doc(id).update({ read: true });
  };

  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
  };

  const handleButtonClick = (color: string) => {
    firestore.collection('notifications').add({
      type: 'info', // Assuming all notifications are of type 'info' for simplicity
      color,
      read: false
    });
    setSelectedColor(color);
  };

  return (
    <div style={{ margin: '20px' }}>
      <h1>Notification System</h1>
      <div style={{ marginBottom: '20px' }}>
        <button style={{ backgroundColor: 'red', marginRight: '10px' }} onClick={() => handleButtonClick('red')}>Red</button>
        <button style={{ backgroundColor: 'blue', marginRight: '10px' }} onClick={() => handleButtonClick('blue')}>Blue</button>
        <button style={{ backgroundColor: 'orange' }} onClick={() => handleButtonClick('orange')}>Orange</button>
      </div>
      <div>
        <h2>Notifications</h2>
        {notifications.map(notification => (
          <div key={notification.id} style={{ marginBottom: '10px' }}>
            <p style={{ color: notification.color }}>
              {notification.read
                ? `${notification.color} color is stored and read`
                : `${notification.color} color stored in db but not marked as read`
              }
            </p>
            {!notification.read && (
              <button onClick={() => handleNotificationClick(notification.id)}>Mark as Read</button>
            )}
          </div>
        ))}
      </div>
      {selectedColor && <div>Selected Color: {selectedColor}</div>}
    </div>
  );
};

export default App;
